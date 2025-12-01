# Next.js Sentry Integration Demo

A comprehensive demonstration of Sentry integration with Next.js including error tracking, performance monitoring, session replay, and more.

## Features

- ✅ **Error Tracking**: Automatic and manual error capture with rich context
- ✅ **Custom Context**: Citation numbers and metadata attached to all events
- ✅ **Performance Monitoring**: Transaction and span tracking for APIs and user actions
- ✅ **Session Replay**: Video-like replays of user sessions leading to errors
- ✅ **User Feedback**: Built-in feedback widget for user error reports
- ✅ **Multi-page Website**: Home, About, Products, Contact, and Sentry Demo pages
- ✅ **API Integration**: RESTful API routes with Sentry instrumentation
- ✅ **Manual Error Triggers**: Test buttons for various error types
- ✅ **Error Boundaries**: Graceful error handling with user-friendly fallbacks

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- @sentry/nextjs

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- A Sentry.io account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/nextjs-test-sentry-integration.git
cd nextjs-test-sentry-integration
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

4. Configure your Sentry credentials in `.env.local`:
```env
NEXT_PUBLIC_SENTRY_DSN=your-dsn-here
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-auth-token
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── citations/     # Citations API with Sentry context
│   │   ├── products/      # Products API with performance spans
│   │   └── test-error/    # Error testing endpoint
│   ├── about/             # About page
│   ├── contact/           # Contact form with Sentry tracking
│   ├── products/          # Products page with API integration
│   ├── sentry-demo/       # Interactive Sentry demo page
│   ├── error.tsx          # Error boundary component
│   ├── global-error.tsx   # Global error handler
│   ├── layout.tsx         # Root layout with navigation
│   └── page.tsx           # Home page
├── components/
│   ├── ErrorBoundaryFallback.tsx
│   └── Navigation.tsx
└── lib/
    └── sentry-utils.ts    # Sentry utility functions
```

## Sentry Configuration Files

- `sentry.client.config.ts` - Client-side Sentry initialization with Session Replay
- `sentry.server.config.ts` - Server-side Sentry initialization
- `sentry.edge.config.ts` - Edge runtime Sentry initialization
- `instrumentation.ts` - Next.js instrumentation for automatic setup
- `next.config.ts` - Next.js config with Sentry webpack plugin

## Key Features Explained

### Citation Number Context

Every error can include a citation number for tracking:

```typescript
import { setCitationContext, captureErrorWithCitation } from "@/lib/sentry-utils";

// Set citation context globally
setCitationContext("CIT-2024-001", { customField: "value" });

// Capture error with citation
captureErrorWithCitation(error, "CIT-2024-001", { extraData: "..." });
```

### Performance Monitoring

Track custom operations with spans:

```typescript
import * as Sentry from "@sentry/nextjs";

await Sentry.startSpan(
  { op: "db.query", name: "Fetch user data" },
  async () => {
    // Your async operation
  }
);
```

### Session Replay

Session Replay is configured to:
- Sample 10% of all sessions
- Sample 100% of sessions with errors
- Capture DOM mutations, network requests, and console logs

### Manual Error Triggers

Visit the `/sentry-demo` page to test:
- Basic Error throws
- Type Errors (null reference)
- Async Errors (Promise rejections)
- API Errors (server-side)
- Custom message capture
- Performance span creation

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Fetch all products with performance tracking |
| `/api/products` | POST | Create a new product |
| `/api/citations` | GET | Fetch citations (supports filtering) |
| `/api/citations` | POST | Create a new citation |
| `/api/test-error` | GET/POST | Test error scenarios |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
