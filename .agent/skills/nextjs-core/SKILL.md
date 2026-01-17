---
name: nextjs-core
description: Guidelines for App Router, Server Actions, and Data Fetching strategies.
---
# Next.js 14+ Architecture

1. **Rendering Strategy**:
   - **Server Components (Default)**: Use for fetching data (Products grid, Dashboard stats).
   - **Client Components**: Use ONLY for interactivity (Add to Cart button, Search bar).
   - Use `Suspense` boundaries for loading states (e.g., `<Suspense fallback={<Skeleton />}><ProductList /></Suspense>`).

2. **Server Actions (`app/actions.ts`)**:
   - All mutations (Create Order, Update Stock, Add Product) MUST be Server Actions.
   - Always revalidate cache after mutation: `revalidatePath('/shop')`.
   - DO NOT use API Routes (`/pages/api`) unless absolutely necessary for webhooks.
