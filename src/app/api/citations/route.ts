import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

// Mock citations data
const citations = [
  {
    id: "CIT-2024-001",
    title: "Initial System Configuration",
    description: "Setup and configuration of the core system components",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
    metadata: { priority: "high", department: "engineering" },
  },
  {
    id: "CIT-2024-002",
    title: "Performance Optimization Review",
    description: "Analysis and recommendations for system performance improvements",
    status: "completed",
    createdAt: "2024-02-20T14:45:00Z",
    metadata: { priority: "medium", department: "operations" },
  },
  {
    id: "CIT-2024-003",
    title: "Security Audit Findings",
    description: "Results from Q1 security audit and remediation steps",
    status: "in_progress",
    createdAt: "2024-03-10T09:00:00Z",
    metadata: { priority: "critical", department: "security" },
  },
  {
    id: "CIT-2024-004",
    title: "API Integration Documentation",
    description: "Technical documentation for third-party API integrations",
    status: "draft",
    createdAt: "2024-03-25T16:20:00Z",
    metadata: { priority: "low", department: "documentation" },
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const citationId = searchParams.get("id");
  const status = searchParams.get("status");

  return await Sentry.startSpan(
    {
      op: "http.server",
      name: "GET /api/citations",
    },
    async () => {
      // If specific citation ID is requested
      if (citationId) {
        const citation = citations.find((c) => c.id === citationId);

        if (!citation) {
          // Use withScope for not found error
          Sentry.withScope((scope) => {
            scope.setContext("citation", {
              citation_number: citationId,
            });
            scope.setContext("citations_api", {
              endpoint: "/api/citations",
              filters: { citationId, status },
              timestamp: new Date().toISOString(),
            });
            scope.setTag("citation_number", citationId);
            scope.addBreadcrumb({
              category: "api",
              message: "Citation not found",
              level: "warning",
              data: { citationId },
            });
          });

          return NextResponse.json(
            { error: "Citation not found", citation_number: citationId },
            { status: 404 }
          );
        }

        return NextResponse.json({ citation });
      }

      // Filter by status if provided
      let filteredCitations = citations;
      if (status) {
        filteredCitations = citations.filter((c) => c.status === status);
      }

      return NextResponse.json({
        citations: filteredCitations,
        count: filteredCitations.length,
        timestamp: new Date().toISOString(),
      });
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, priority, department } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Generate new citation ID
    const newId = `CIT-2024-${String(citations.length + 1).padStart(3, "0")}`;

    const newCitation = {
      id: newId,
      title,
      description: description || "",
      status: "draft",
      createdAt: new Date().toISOString(),
      metadata: {
        priority: priority || "medium",
        department: department || "general",
      },
    };

    // Use withScope to add context for this successful creation
    Sentry.withScope((scope) => {
      scope.setContext("citation", {
        citation_number: newCitation.id,
        status: newCitation.status,
        priority: newCitation.metadata.priority,
      });
      scope.setTag("citation_number", newCitation.id);
      scope.addBreadcrumb({
        category: "citation",
        message: "New citation created",
        level: "info",
        data: { citationId: newCitation.id, title: newCitation.title },
      });
    });

    return NextResponse.json({
      success: true,
      citation: newCitation,
    });
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setContext("citations_api", {
        endpoint: "/api/citations",
        method: "POST",
        error: "Failed to create citation",
        timestamp: new Date().toISOString(),
      });
      Sentry.captureException(error);
    });
    
    return NextResponse.json(
      { error: "Failed to create citation" },
      { status: 500 }
    );
  }
}
