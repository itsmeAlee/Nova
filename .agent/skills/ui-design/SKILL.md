---
name: ui-design
description: Design system using Tailwind CSS, Shadcn UI, and the 'FreshTrack' Green Theme.
---
# UI/UX Standards (Green Theme)

1. **Color Palette**:
   - **Primary Brand**: `bg-emerald-500` (Buttons, Active States, Highlights).
   - **Secondary Brand**: `bg-emerald-50` (Card Backgrounds, Sidebars).
   - **Text**: `text-slate-900` (Headings), `text-slate-500` (Body).
   - **Accents**: Use `text-emerald-600` for price tags and stock counts.

2. **Component Styling**:
   - **Buttons**: Rounded-xl, font-medium. Primary buttons must be `bg-emerald-500 hover:bg-emerald-600 text-white`.
   - **Cards**: White background, `shadow-sm`, `border-slate-100`, `rounded-2xl`.
   - **Inputs**: `bg-slate-50` with `focus:ring-emerald-500`.

3. **Critical Status Indicators (Keep these RED)**:
   - **Expired Items**: `bg-red-50 text-red-700 border-red-200` (This overrides the green theme for safety).
   - **Low Stock**: `text-orange-600` (Warning).

4. **Typography**:
   - Use clean, sans-serif fonts.
   - Headers (`h1`, `h2`) should be bold and tracking-tight.
