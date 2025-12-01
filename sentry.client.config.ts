// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Enable Session Replay for error replays
  replaysSessionSampleRate: 0.1, // Sample 10% of sessions for replay
  replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors for replay

  integrations: [
    Sentry.replayIntegration({
      // Mask all text and block all media for privacy
      maskAllText: false,
      blockAllMedia: false,
    }),
    Sentry.browserTracingIntegration(),
    Sentry.feedbackIntegration({
      // Display a feedback button
      colorScheme: "system",
      isNameRequired: true,
      isEmailRequired: true,
      showBranding: false,
    }),
  ],

  // Define environment
  environment: process.env.NODE_ENV || "development",

  // Configure which URLs should be considered as part of your application
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],

  // Called before sending events - useful for adding context
  beforeSend(event) {
    // Add custom tags
    event.tags = {
      ...event.tags,
      app_version: "1.0.0",
    };
    return event;
  },
});
