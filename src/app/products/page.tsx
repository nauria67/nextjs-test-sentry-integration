"use client";

import { useEffect, useState } from "react";
import * as Sentry from "@sentry/nextjs";
import { addBreadcrumb } from "@/lib/sentry-utils";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  citationNumber: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Add breadcrumb for tracking user navigation
    addBreadcrumb("navigation", "User visited products page");

    const fetchProducts = async () => {
      try {
        const response = await Sentry.startSpan(
          {
            op: "http.client",
            name: "GET /api/products",
          },
          async () => {
            return await fetch("/api/products");
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.products);

        addBreadcrumb("api", "Products fetched successfully", {
          count: data.products.length,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        Sentry.captureException(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-red-700 dark:text-red-300">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        Products
      </h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-300">
        Browse our products. Each product has a unique citation number for
        tracking.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const handleClick = () => {
    // Add breadcrumb when user clicks on a product
    addBreadcrumb("user-action", `Viewed product: ${product.name}`, {
      productId: product.id,
      citationNumber: product.citationNumber,
    });

    // Set context for this product
    Sentry.setContext("product", {
      id: product.id,
      name: product.name,
      citation_number: product.citationNumber,
    });
  };

  return (
    <div
      className="cursor-pointer rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-zinc-800"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          #{product.citationNumber}
        </span>
        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-300">
          ${product.price}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
        {product.name}
      </h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        {product.description}
      </p>
    </div>
  );
}
