"use client";

import { useState } from "react";
import * as Sentry from "@sentry/nextjs";
import { addBreadcrumb, setCitationContext } from "@/lib/sentry-utils";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    citationNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Add breadcrumb for form submission
    addBreadcrumb("form", "Contact form submitted", {
      citationNumber: formData.citationNumber,
    });

    // Set citation context
    if (formData.citationNumber) {
      setCitationContext(formData.citationNumber, {
        formType: "contact",
        userEmail: formData.email,
      });
    }

    try {
      // Simulate API call with performance tracking
      await Sentry.startSpan(
        {
          op: "http.client",
          name: "POST /api/contact",
        },
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      );

      setSubmitStatus("success");
      addBreadcrumb("form", "Contact form submission successful");

      // Clear form
      setFormData({ name: "", email: "", message: "", citationNumber: "" });
    } catch (error) {
      setSubmitStatus("error");
      Sentry.captureException(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        Contact Us
      </h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-300">
        Have questions? Send us a message and we&apos;ll get back to you.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="citationNumber"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Citation Number (optional)
          </label>
          <input
            type="text"
            id="citationNumber"
            value={formData.citationNumber}
            onChange={(e) =>
              setFormData({ ...formData, citationNumber: e.target.value })
            }
            placeholder="e.g., CIT-2024-001"
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            required
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        {submitStatus === "success" && (
          <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-green-700 dark:text-green-300">
              Message sent successfully!
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-red-700 dark:text-red-300">
              Failed to send message. Please try again.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
