"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

interface ErrorBoundaryFallbackProps {
  error: Error & { digest?: string };
  resetErrorBoundary: () => void;
}

export function ErrorBoundaryFallback({
  error,
  resetErrorBoundary,
}: ErrorBoundaryFallbackProps) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 dark:bg-zinc-900">
      <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-800">
        <h2 className="mb-4 text-2xl font-bold text-red-600 dark:text-red-400">
          Something went wrong!
        </h2>
        <p className="mb-4 text-zinc-600 dark:text-zinc-300">
          An unexpected error occurred. The error has been reported to our team.
        </p>
        {error.digest && (
          <p className="mb-4 font-mono text-sm text-zinc-500 dark:text-zinc-400">
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={resetErrorBoundary}
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
