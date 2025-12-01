import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
          Next.js + Sentry Integration Demo
        </h1>
        <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          A comprehensive demonstration of Sentry&apos;s error tracking, performance
          monitoring, and session replay capabilities in a Next.js application.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/sentry-demo"
            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Try Sentry Demo
          </Link>
          <Link
            href="/about"
            className="text-sm font-semibold leading-6 text-zinc-900 dark:text-white"
          >
            Learn more <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="Error Tracking"
          description="Automatic capture of unhandled exceptions and manual error reporting with rich context including citation numbers."
          icon="🐛"
        />
        <FeatureCard
          title="Performance Monitoring"
          description="Track page load times, API response times, and custom transactions to identify bottlenecks."
          icon="⚡"
        />
        <FeatureCard
          title="Session Replay"
          description="Replay user sessions to understand exactly what happened before an error occurred."
          icon="🎬"
        />
        <FeatureCard
          title="Custom Context"
          description="Add citation numbers and custom metadata to errors for better debugging and filtering."
          icon="📋"
        />
        <FeatureCard
          title="API Integration"
          description="Monitor your API routes with automatic error capture and performance tracking."
          icon="🔌"
        />
        <FeatureCard
          title="User Feedback"
          description="Collect user feedback directly when errors occur with the built-in feedback widget."
          icon="💬"
        />
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-zinc-800">
      <div className="text-4xl">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-zinc-600 dark:text-zinc-300">{description}</p>
    </div>
  );
}
