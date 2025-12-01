import * as Sentry from "@sentry/nextjs";

/**
 * Set user context for Sentry
 */
export function setUserContext(user: {
  id: string;
  email?: string;
  username?: string;
  citationNumber?: string;
}) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });

  // Add citation_number as additional context
  if (user.citationNumber) {
    Sentry.setContext("citation", {
      citation_number: user.citationNumber,
    });
  }
}

/**
 * Clear user context from Sentry
 */
export function clearUserContext() {
  Sentry.setUser(null);
}

/**
 * Add custom context with citation number
 */
export function setCitationContext(citationNumber: string, additionalData?: Record<string, unknown>) {
  Sentry.setContext("citation", {
    citation_number: citationNumber,
    ...additionalData,
  });
}

/**
 * Set custom tags for filtering in Sentry
 */
export function setCustomTags(tags: Record<string, string>) {
  Object.entries(tags).forEach(([key, value]) => {
    Sentry.setTag(key, value);
  });
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  category: string,
  message: string,
  data?: Record<string, unknown>,
  level: Sentry.SeverityLevel = "info"
) {
  Sentry.addBreadcrumb({
    category,
    message,
    level,
    data,
  });
}

/**
 * Capture a custom error with citation context
 */
export function captureErrorWithCitation(
  error: Error,
  citationNumber: string,
  extraContext?: Record<string, unknown>
) {
  Sentry.withScope((scope) => {
    scope.setContext("citation", {
      citation_number: citationNumber,
      ...extraContext,
    });
    Sentry.captureException(error);
  });
}

/**
 * Capture a message with citation context
 */
export function captureMessageWithCitation(
  message: string,
  citationNumber: string,
  level: Sentry.SeverityLevel = "info",
  extraContext?: Record<string, unknown>
) {
  Sentry.withScope((scope) => {
    scope.setContext("citation", {
      citation_number: citationNumber,
      ...extraContext,
    });
    scope.setLevel(level);
    Sentry.captureMessage(message);
  });
}

/**
 * Create a span for performance monitoring
 */
export async function withPerformanceSpan<T>(
  operation: string,
  description: string,
  callback: () => Promise<T>
): Promise<T> {
  return await Sentry.startSpan(
    {
      op: operation,
      name: description,
    },
    async () => {
      return await callback();
    }
  );
}

/**
 * Manually trigger different types of errors for testing
 */
export const testErrors = {
  throwError: (message: string = "Test Error") => {
    throw new Error(message);
  },

  throwTypeError: () => {
    const obj: Record<string, unknown> = {};
    // @ts-expect-error - intentional error for testing
    obj.nonExistentMethod();
  },

  throwReferenceError: () => {
    // @ts-expect-error - intentional error for testing
    nonExistentVariable.doSomething();
  },

  asyncError: async () => {
    await new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Async Error")), 100);
    });
  },

  captureMessage: (message: string, level: Sentry.SeverityLevel = "error") => {
    Sentry.captureMessage(message, level);
  },

  captureException: (error: Error) => {
    Sentry.captureException(error);
  },
};
