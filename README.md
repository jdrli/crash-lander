# Crash Lander - QA Testing Dashboard

This is a [Next.js](https://nextjs.org/) frontend for the Crash Lander QA API, bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, make sure the Crash Lander API server is running:

```bash
# From the crash-lander-api directory
cd crash-lander-api
npm run dev
```

Then, run the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

If your API server runs on a different port or URL, create a `.env.local` file with:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

By default, it uses `http://localhost:3000`.

## How to Use

1. Enter a URL to test in the input field
2. Click "Run QA Tests"
3. View the comprehensive test results including Playwright tests and Lighthouse diagnostics

## Learn More

To learn more about Next.js, take a look at the [Next.js documentation](https://nextjs.org/docs).

## API Documentation

The API server provides comprehensive QA testing including:
- Playwright tests for UI, performance, accessibility, security, and functionality
- Lighthouse diagnostics for performance, accessibility, best practices, SEO and PWA metrics