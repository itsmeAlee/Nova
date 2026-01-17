---
name: client-state
description: Managing local state (Cart, Filters) without excessive re-renders.
---
# Client State Management

1. **Shopping Cart**:
   - Use **React Context API** (`CartContext.tsx`) or **Zustand** for the shopping cart.
   - Persist cart to `localStorage` so data isn't lost on refresh.
   - The Cart should NOT write to the database until the "Checkout" button is pressed.

2. **URL State**:
   - For filtering (Search, Category selection), use URL Search Params (`?category=dairy&sort=price`).
   - This makes the app shareable and bookmarkable.
