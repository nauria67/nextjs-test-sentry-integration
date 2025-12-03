import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

// Mock products data
const products = [
  {
    id: 1,
    name: "Enterprise Dashboard",
    description: "Comprehensive analytics dashboard for enterprise teams",
    price: 299.99,
    citationNumber: "CIT-PROD-001",
  },
  {
    id: 2,
    name: "API Integration Kit",
    description: "Connect your services with our powerful API toolkit",
    price: 149.99,
    citationNumber: "CIT-PROD-002",
  },
  {
    id: 3,
    name: "Security Suite",
    description: "Advanced security monitoring and threat detection",
    price: 499.99,
    citationNumber: "CIT-PROD-003",
  },
  {
    id: 4,
    name: "Analytics Pro",
    description: "Real-time analytics with custom reporting",
    price: 199.99,
    citationNumber: "CIT-PROD-004",
  },
  {
    id: 5,
    name: "DevOps Toolkit",
    description: "Streamline your CI/CD pipeline with automation",
    price: 349.99,
    citationNumber: "CIT-PROD-005",
  },
  {
    id: 6,
    name: "Cloud Manager",
    description: "Multi-cloud infrastructure management solution",
    price: 599.99,
    citationNumber: "CIT-PROD-006",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shouldFail = searchParams.get("fail") === "true";
  const delay = parseInt(searchParams.get("delay") || "0", 10);

  // Start a span for performance monitoring
  return await Sentry.startSpan(
    {
      op: "http.server",
      name: "GET /api/products",
    },
    async () => {
      // Simulate network delay if requested
      if (delay > 0) {
        await Sentry.startSpan(
          {
            op: "delay",
            name: "Simulated Network Delay",
          },
          async () => {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        );
      }

      // Simulate failure for testing
      if (shouldFail) {
        const error = new Error("Products API intentionally failed");
        
        Sentry.withScope((scope) => {
          scope.setContext("products_api", {
            total_products: products.length,
            requested_delay: delay,
            shouldFail,
            endpoint: "/api/products",
            timestamp: new Date().toISOString(),
          });
          scope.setTag("api_error", "products_fetch_failed");
          Sentry.captureException(error);
        });

        return NextResponse.json(
          { error: "Failed to fetch products" },
          { status: 500 }
        );
      }

      // Simulate database query
      const fetchedProducts = await Sentry.startSpan(
        {
          op: "db.query",
          name: "Fetch Products from Database",
        },
        async () => {
          // Simulate DB latency
          await new Promise((resolve) => setTimeout(resolve, 50));
          return products;
        }
      );

      return NextResponse.json({
        products: fetchedProducts,
        count: fetchedProducts.length,
        timestamp: new Date().toISOString(),
      });
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, citationNumber } = body;

    // Validate required fields
    if (!name || !price) {
      Sentry.withScope((scope) => {
        scope.addBreadcrumb({
          category: "validation",
          message: "Product creation validation failed",
          level: "warning",
          data: { name, price },
        });
      });

      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    // Create new product (mock)
    const newProduct = {
      id: products.length + 1,
      name,
      description: description || "",
      price: parseFloat(price),
      citationNumber: citationNumber || `CIT-PROD-${String(products.length + 1).padStart(3, "0")}`,
    };

    // Use withScope to set context for the created product
    Sentry.withScope((scope) => {
      scope.setContext("product_created", {
        product_id: newProduct.id,
        citation_number: newProduct.citationNumber,
      });
      scope.setContext("citation", {
        citation_number: newProduct.citationNumber,
      });
      scope.setTag("citation_number", newProduct.citationNumber);
      scope.addBreadcrumb({
        category: "product",
        message: "New product created",
        level: "info",
        data: newProduct,
      });
    });

    return NextResponse.json({
      success: true,
      product: newProduct,
    });
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setContext("products_api", {
        endpoint: "/api/products",
        method: "POST",
        error: "Failed to create product",
        timestamp: new Date().toISOString(),
      });
      Sentry.captureException(error);
    });

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
