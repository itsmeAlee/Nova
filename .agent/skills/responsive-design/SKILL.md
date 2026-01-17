---
name: responsive-design
description: Rules for Mobile-First development and responsive navigation.
---
# Responsive Standards

1. **Mobile-First approach**:
   - Write standard classes for MOBILE views first (e.g., `flex-col`, `w-full`).
   - Use `md:` and `lg:` prefixes for Tablet/Desktop overrides.

2. **Navigation**:
   - **Desktop**: Show full links (Store, Admin Portal).
   - **Mobile**: Hide links. Show a "Hamburger Menu" icon that opens a Sheet/Drawer.

3. **Typography Scaling**:
   - Use `text-xl` on mobile and `md:text-3xl` on desktop for headings.
   - The Logo 'FASTTRACK' must be visible on ALL screens.
