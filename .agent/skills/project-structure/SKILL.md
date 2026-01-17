---
name: project-structure
description: Rules for file organization, naming conventions, and environment variables.
---
# Project Structure & Standards

1. **Directory Layout**:
   - `app/`: All routes and pages.
   - `components/`:
     - `ui/`: Raw shadcn components (buttons, inputs).
     - `features/`: Business logic components (e.g., `ProductCard`, `CartSummary`).
     - `layout/`: Global layout elements (Sidebar, Navbar).
   - `lib/`: Utility functions and Supabase clients (`supabase.ts`, `utils.ts`).
   - `types/`: Global TypeScript interfaces (prefer generated database types).

2. **Naming Conventions**:
   - Files: `kebab-case.tsx` (e.g., `product-card.tsx`).
   - Components: `PascalCase` (e.g., `ProductCard`).
   - Functions: `camelCase` (e.g., `calculateTotal`).

3. **Environment**:
   - Access variables ONLY via `process.env.NEXT_PUBLIC_...` on client.
   - Never commit `.env` files.
