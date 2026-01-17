---
name: secure-auth
description: Handling Authentication, Role-Based Access Control (RBAC), and Middleware.
---
# Authentication & Security

1. **Middleware Logic**:
   - Matcher: `['/admin/:path*', '/checkout/:path*']`.
   - If user accesses `/admin` AND role != 'admin', redirect to `/`.

2. **Client-Side Auth**:
   - Use the `useUser()` hook from Supabase for conditional rendering (e.g., showing "Login" vs "Sign Out").

3. **Protection**:
   - Never trust the client. Always verify roles again inside Server Actions before performing database writes.
