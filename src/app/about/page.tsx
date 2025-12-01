export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        About This Demo
      </h1>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Sentry Integration Features
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-300">
            This Next.js application demonstrates comprehensive Sentry integration
            including error tracking, performance monitoring, and session replay
            capabilities.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Key Features
          </h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-zinc-600 dark:text-zinc-300">
            <li>Automatic error capture with stack traces</li>
            <li>Custom context including citation numbers</li>
            <li>Performance transaction monitoring</li>
            <li>Session replay for error reproduction</li>
            <li>User feedback collection</li>
            <li>API route monitoring</li>
            <li>Manual error triggering for testing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Tech Stack
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <TechBadge name="Next.js 16" />
            <TechBadge name="React 19" />
            <TechBadge name="TypeScript" />
            <TechBadge name="Tailwind CSS" />
            <TechBadge name="Sentry SDK" />
            <TechBadge name="Session Replay" />
          </div>
        </section>
      </div>
    </div>
  );
}

function TechBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-300/20">
      {name}
    </span>
  );
}
