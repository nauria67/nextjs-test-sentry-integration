import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function GET(request: Request) {
  // Parse query parameters
  const { searchParams } = new URL(request.url);
  const shouldFail = searchParams.get("fail") === "true";
  const citationNumber = searchParams.get("citation") || "UNKNOWN";

  if (shouldFail || true) {
    // Always fail for demo purposes
    const error = new Error(
      `Server-side error triggered - Citation: ${citationNumber}`
    );
    
    // Use withScope to ensure context is attached to this specific error
    Sentry.withScope((scope) => {
      // Set citation context
      scope.setContext("citation", {
        citation_number: citationNumber,
      });
      
      // Set API request context
      scope.setContext("api_request", {
        endpoint: "/api/test-error",
        citation_number: citationNumber,
        shouldFail,
        timestamp: new Date().toISOString(),
      });

      // Add breadcrumb
      scope.addBreadcrumb({
        category: "api",
        message: "Test error endpoint called",
        level: "info",
        data: { shouldFail, citationNumber },
      });

      // Set tag for easier filtering
      scope.setTag("citation_number", citationNumber);

      Sentry.captureException(error);
    });

    return NextResponse.json(
      {
        error: "Server-side error occurred",
        citation_number: citationNumber,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "No error triggered",
    citation_number: citationNumber,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { citationNumber, action } = body;

    // Simulate different error scenarios based on action
    switch (action) {
      case "validation_error":
        return NextResponse.json(
          { error: "Validation failed", details: "Required field missing" },
          { status: 400 }
        );

      case "auth_error":
        Sentry.withScope((scope) => {
          scope.setContext("citation", {
            citation_number: citationNumber,
          });
          scope.setContext("api_request", {
            endpoint: "/api/test-error",
            method: "POST",
            citation_number: citationNumber,
            action,
          });
          scope.setTag("citation_number", citationNumber);
          Sentry.captureMessage("Authentication error in test endpoint", "warning");
        });
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );

      case "server_error":
        throw new Error(`Server error triggered by action - Citation: ${citationNumber}`);

      default:
        return NextResponse.json({
          success: true,
          action,
          citation_number: citationNumber,
        });
    }
  } catch (error) {
    // Extract citation number from error message if available
    const citationMatch = error instanceof Error && error.message.match(/Citation: ([A-Za-z0-9-_]+)$/);
    const citationNumber = citationMatch ? citationMatch[1] : "UNKNOWN";

    Sentry.withScope((scope) => {
      scope.setContext("citation", {
        citation_number: citationNumber,
      });
      scope.setContext("api_request", {
        endpoint: "/api/test-error",
        method: "POST",
        citation_number: citationNumber,
        timestamp: new Date().toISOString(),
      });
      scope.setTag("citation_number", citationNumber);
      Sentry.captureException(error);
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
