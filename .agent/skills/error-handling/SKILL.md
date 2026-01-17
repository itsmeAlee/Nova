---
name: error-handling
description: Strategy for handling errors gracefully and logging them.
---
# Error Handling Strategy

1. **User Feedback**:
   - Use **Toast Notifications** (`sonner` or `use-toast`) for all user actions.
   - Success: "Item added to cart." (Green)
   - Error: "Failed to checkout. Insufficient stock." (Red)

2. **Component Failures**:
   - Create `error.tsx` files in route segments to catch server errors without crashing the whole app.
   - Use `not-found.tsx` for 404s (e.g., Product not found).
