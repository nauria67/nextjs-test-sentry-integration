"use client";

import { useState } from "react";
import * as Sentry from "@sentry/nextjs";
import {
  addBreadcrumb,
  captureErrorWithCitation,
  captureMessageWithCitation,
  setCitationContext,
  setUserContext,
} from "@/lib/sentry-utils";

type ErrorType = "error" | "typeError" | "asyncError" | "apiError" | "message";

export default function SentryDemoPage() {
  const [citationNumber, setCitationNumber] = useState("CIT-2024-001");
  const [message, setMessage] = useState("Test message from Sentry Demo");
  const [lastTriggered, setLastTriggered] = useState<string | null>(null);

  const triggerError = async (type: ErrorType) => {
    try {
      // Add breadcrumb before triggering error
      addBreadcrumb("user-action", `User triggered ${type} error`, {
        citationNumber,
        timestamp: new Date().toISOString(),
      });

      // Set citation context
      setCitationContext(citationNumber, {
        errorType: type,
        triggeredAt: new Date().toISOString(),
      });

      setLastTriggered(`${type} at ${new Date().toLocaleTimeString()}`);

      switch (type) {
        case "error":
          throw new Error(`Manual Error Test - Citation: ${citationNumber}`);

        case "typeError":
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const obj: any = null;
          obj.method();
          break;

        case "asyncError":
          await new Promise((_, reject) => {
            setTimeout(
              () =>
                reject(
                  new Error(`Async Error Test - Citation: ${citationNumber}`)
                ),
              100
            );
          });
          break;

        case "apiError":
          const response = await fetch(`/api/test-error?citation=${encodeURIComponent(citationNumber)}`);
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "API Error");
          }
          break;

        case "message":
          captureMessageWithCitation(message, citationNumber, "error", {
            source: "sentry-demo-page",
          });
          break;
      }
    } catch (error) {
      // Errors in event handlers are not caught by error boundaries
      // We need to manually capture them with Sentry
      captureErrorWithCitation(
        error instanceof Error ? error : new Error(String(error)),
        citationNumber,
        {
          errorType: type,
          source: "sentry-demo-page",
          triggeredAt: new Date().toISOString(),
        }
      );
      
      // Re-throw to show in console for debugging
      throw error;
    }
  };

  const setTestUser = () => {
    setUserContext({
      id: "user-123",
      email: "test@example.com",
      username: "testuser",
      citationNumber,
    });
    setLastTriggered("User context set");
  };

  const captureCustomError = () => {
    const error = new Error("Custom captured error with citation");
    captureErrorWithCitation(error, citationNumber, {
      customField: "custom value",
      page: "sentry-demo",
    });
    setLastTriggered("Custom error captured");
  };

  const triggerPerformanceTest = async () => {
    await Sentry.startSpan(
      {
        op: "test",
        name: "Performance Test Span",
      },
      async () => {
        // Simulate some work
        await new Promise((resolve) => setTimeout(resolve, 500));

        await Sentry.startSpan(
          {
            op: "db.query",
            name: "Simulated Database Query",
          },
          async () => {
            await new Promise((resolve) => setTimeout(resolve, 200));
          }
        );

        await Sentry.startSpan(
          {
            op: "http.client",
            name: "Simulated External API Call",
          },
          async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        );
      }
    );

    setLastTriggered("Performance spans recorded");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        Sentry Demo
      </h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-300">
        Test various Sentry features including error tracking, custom context,
        and performance monitoring.
      </p>

      {lastTriggered && (
        <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-blue-700 dark:text-blue-300">
            Last triggered: {lastTriggered}
          </p>
        </div>
      )}

      {/* Configuration Section */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Configuration
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="citation"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Citation Number
            </label>
            <input
              type="text"
              id="citation"
              value={citationNumber}
              onChange={(e) => setCitationNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Custom Message
            </label>
            <input
              type="text"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>
      </section>

      {/* Error Triggers Section */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Error Triggers
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Click buttons below to trigger different types of errors. Check your
          Sentry dashboard to see them!
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ErrorButton
            label="Throw Error"
            description="Basic Error throw"
            color="red"
            onClick={() => triggerError("error")}
          />
          <ErrorButton
            label="Type Error"
            description="Null reference error"
            color="orange"
            onClick={() => triggerError("typeError")}
          />
          <ErrorButton
            label="Async Error"
            description="Promise rejection"
            color="yellow"
            onClick={() => triggerError("asyncError")}
          />
          <ErrorButton
            label="API Error"
            description="Server-side error"
            color="purple"
            onClick={() => triggerError("apiError")}
          />
          <ErrorButton
            label="Capture Message"
            description="Manual message capture"
            color="blue"
            onClick={() => triggerError("message")}
          />
          <ErrorButton
            label="Custom Error"
            description="With citation context"
            color="pink"
            onClick={captureCustomError}
          />
        </div>
      </section>

      {/* Context Section */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Context & User
        </h2>
        <div className="mt-4 flex gap-4">
          <button
            onClick={setTestUser}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          >
            Set Test User
          </button>
          <button
            onClick={() => {
              Sentry.setUser(null);
              setLastTriggered("User context cleared");
            }}
            className="rounded-md bg-zinc-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-500"
          >
            Clear User
          </button>
        </div>
      </section>

      {/* Performance Section */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Performance Monitoring
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Test performance monitoring by creating custom spans and transactions.
        </p>
        <div className="mt-4">
          <button
            onClick={triggerPerformanceTest}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Run Performance Test
          </button>
        </div>
      </section>

      {/* Session Replay Info */}
      <section className="mt-8 rounded-lg bg-zinc-100 p-6 dark:bg-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          📹 Session Replay
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          Session Replay is active! When errors occur, Sentry will capture a
          video-like replay of user actions leading up to the error. Navigate
          around the app and trigger some errors to see it in action.
        </p>
        <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-300">
          <li>100% of sessions with errors are recorded</li>
          <li>10% of all sessions are sampled for replay</li>
          <li>DOM mutations, network requests, and console logs are captured</li>
        </ul>
      </section>

      {/* Instructions */}
      <section className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
          📌 Setup Instructions
        </h2>
        <ol className="mt-4 list-inside list-decimal space-y-2 text-blue-800 dark:text-blue-200">
          <li>
            Create a project in{" "}
            <a
              href="https://sentry.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Sentry.io
            </a>
          </li>
          <li>
            Copy your DSN from Project Settings → Client Keys (DSN)
          </li>
          <li>
            Create a <code className="rounded bg-blue-100 px-1 dark:bg-blue-800">.env.local</code> file with:
            <pre className="mt-2 overflow-x-auto rounded bg-blue-100 p-2 text-xs dark:bg-blue-800">
{`NEXT_PUBLIC_SENTRY_DSN=your-dsn-here
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-auth-token`}
            </pre>
          </li>
          <li>Restart the development server</li>
          <li>Trigger errors and check your Sentry dashboard!</li>
        </ol>
      </section>
    </div>
  );
}

function ErrorButton({
  label,
  description,
  color,
  onClick,
}: {
  label: string;
  description: string;
  color: string;
  onClick: () => void;
}) {
  const colorClasses: Record<string, string> = {
    red: "bg-red-600 hover:bg-red-500",
    orange: "bg-orange-600 hover:bg-orange-500",
    yellow: "bg-yellow-600 hover:bg-yellow-500",
    purple: "bg-purple-600 hover:bg-purple-500",
    blue: "bg-blue-600 hover:bg-blue-500",
    pink: "bg-pink-600 hover:bg-pink-500",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-md px-4 py-3 text-white shadow-sm transition-colors ${colorClasses[color]}`}
    >
      <span className="block text-sm font-semibold">{label}</span>
      <span className="block text-xs opacity-75">{description}</span>
    </button>
  );
}
