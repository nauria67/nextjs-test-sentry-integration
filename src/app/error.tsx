"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Something went wrong!
        </h2>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
          An error occurred while loading this page.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-sm text-zinc-500 dark:text-zinc-400">
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md bg-zinc-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-500"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
