# Torto Design Language

This document defines the visual and interaction design system for the Torto webapp. It is the authoritative reference for AI tools when building or modifying UI/UX.

> **Rule**: When building UI, always follow this document. Do not invent new patterns, tokens, or component styles unless explicitly asked.

---

## 1. Design Principles

1. **Clean and minimal** — No decorative flourishes. Every element earns its place.
2. **Utility-first** — Compose UIs with Tailwind classes directly; avoid custom CSS.
3. **Mobile-first responsive** — Start with the smallest breakpoint and layer up with `sm:`, `md:`, `lg:`.
4. **Functional color** — Colors communicate meaning (brand, success, error, warning), not decoration.
5. **Generous whitespace** — Use spacing to create hierarchy, not dividers or heavy borders.

---

## 2. Color Tokens

All colors are defined in `src/app/globals.css` under `@theme`. Use Tailwind classes (e.g., `bg-primary-300`, `text-error-300`), never raw hex values.

### Semantic Scale

Each palette follows a **50–500 scale** where:
- **50–100**: Backgrounds (tints)
- **200**: Accents, highlights
- **300**: Default / main shade (this is the "base" you reach for first)
- **400**: Hover / pressed states
- **500**: Dark variant, high-contrast text on light tint

### Primary (Deep Teal) — Brand identity

| Token | Hex | Usage |
|---|---|---|
| `primary-50` | `#F0FDFA` | Icon background circles, subtle tints |
| `primary-100` | `#CCFBF1` | — |
| `primary-200` | `#2DD4BF` | Decorative accents |
| `primary-300` | `#0F766E` | **Main brand color.** Buttons, active nav, links, focus rings |
| `primary-400` | `#115E59` | Hover state for primary buttons |
| `primary-500` | `#134E4A` | Gradient endpoints (sign-in panel) |

### Neutral (Slate) — Text, borders, backgrounds

| Token | Hex | Usage |
|---|---|---|
| `neutral-50` | `#FFFFFF` | Card backgrounds, page surface |
| `neutral-100` | `#F1F5F9` | Sidebar background, subtle dividers |
| `neutral-200` | `#E2E8F0` | Card borders, section dividers |
| `neutral-300` | `#64748B` | Secondary text, inactive nav items |
| `neutral-400` | `#334155` | Emphasized secondary text |
| `neutral-500` | `#0F172A` | Primary headings, high-contrast text |

### Success (Emerald)

| Token | Hex | Usage |
|---|---|---|
| `success-50` | `#ECFDF5` | Success background tint |
| `success-300` | `#10B981` | Success text, positive trends |
| `success-500` | `#064E3B` | — |

### Error (Red)

| Token | Hex | Usage |
|---|---|---|
| `error-50` | `#FEF2F2` | Error alert background |
| `error-300` | `#EF4444` | Error text, danger buttons |
| `error-400` | `#DC2626` | Danger hover state |
| `error-500` | `#991B1B` | — |

### Warning (Amber)

| Token | Hex | Usage |
|---|---|---|
| `warning-50` | `#FFFBEB` | Warning background tint |
| `warning-300` | `#F59E0B` | Warning text, icons |
| `warning-500` | `#92400E` | — |

### Background

| Token | Hex | Usage |
|---|---|---|
| `background` | `#F8FAFB` | Page-level background behind all content |

### Supplementary Colors

For non-semantic uses (charts, badges), Tailwind's `gray-*`, `green-*`, `blue-*`, `red-*`, `yellow-*` scales are used alongside the custom tokens.

Chart palette: `#3b82f6`, `#f59e0b`, `#10b981`, `#ef4444`, `#8b5cf6`, `#ec4899`

---

## 3. Typography

### Font

- **Sans** (body + UI): `Inter` (weights 300–800), loaded from Google Fonts
- **Mono** (code): System monospace stack

### Scale

| Role | Classes | Where |
|---|---|---|
| Page title | `text-3xl font-bold tracking-tight text-gray-900` | `PageHeading` |
| Page subtitle | `text-sm text-neutral-500` | Below page title |
| Section/card title | `text-sm leading-6 font-semibold` | `SectionCard` header |
| Modal title | `text-lg font-semibold text-gray-900` | `Modal` |
| Body text | `text-sm text-gray-900` | General content |
| Secondary text | `text-sm text-gray-500` | Descriptions, captions |
| Muted text | `text-sm text-neutral-300` | Inactive items, hints |
| KPI value | `text-2xl font-semibold text-gray-900` | `SummaryCard` |
| Badge text | `text-xs font-medium` | `Badge` |
| Chart legend | `text-xs text-gray-700` | `DonutChart` legend |
| Form label | `text-sm font-medium text-gray-700` | All form inputs |
| Error text | `text-sm text-red-600` | Below form fields |
| Link text | `text-sm text-primary-300 hover:text-primary-400 hover:underline` | Inline links |

---

## 4. Spacing and Layout

### Page Structure

**Desktop (md+):**
```
┌──────────────────────────────────────────────────┐
│ Root (h-screen, flex, overflow-hidden)            │
│ ┌────────────┬───────────────────────────────────┐│
│ │ Sidebar    │ Main Area                         ││
│ │ w-[256px]  │ flex-1 flex-col overflow-hidden   ││
│ │ bg-gray-50 │ ┌─────────────────────────────┐   ││
│ │ p-6       │ │ Header (border-b, px-6 py-3)│   ││
│ │            │ ├─────────────────────────────┤   ││
│ │            │ │ Content (flex-1             │   ││
│ │            │ │   overflow-y-auto p-8)      │   ││
│ │            │ └─────────────────────────────┘   ││
│ └────────────┴───────────────────────────────────┘│
└──────────────────────────────────────────────────┘
```

**Mobile (<md):** Sidebar hidden. Content uses full width with `pb-20 md:pb-8` for bottom tab bar clearance. `BottomTabBar` is fixed at bottom with same nav items as sidebar.

### Spacing Values

| Context | Classes |
|---|---|
| Content area padding | `p-8` |
| Sidebar padding | `p-6` |
| Card body padding | `p-4 sm:p-6` (default) |
| Card header padding | `px-4 py-3 sm:px-6 sm:py-4` |
| Form field spacing | `space-y-4` (tight) or `space-y-6` (relaxed) |
| Grid gap | `gap-4` (cards) or `gap-6` (sections) |
| Section vertical gap | `space-y-6` or `space-y-8` |
| Button internal padding | `px-3 py-2.5 sm:py-2` (default), `px-2.5 py-1.5` (sm) — via `BUTTON_SIZE_CLASSES` |
| Input internal padding | `py-2.5 sm:py-2` (default), `py-1.5` (sm) — via `INPUT_SIZE_CLASSES` |
| Page heading bottom | `mb-8` |
| Header bar padding | `px-6 py-3` |

### Responsive Breakpoints

| Prefix | Min-width | Usage |
|---|---|---|
| (none) | 0 | Single column, stacked layout |
| `sm:` | 640px | 2-column grids, show secondary table columns |
| `md:` | 768px | Fixed table layout |
| `lg:` | 1024px | 4-column grids, sidebar visible (sign-in), 2-column section grids |

### Common Grid Patterns

```
KPI cards:    grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4
Sections:     grid grid-cols-1 gap-6 lg:grid-cols-2
Sign-in:      flex → hidden lg:flex lg:w-2/5 + flex-1
```

---

## 5. Component Library

All shared components live in `src/core/presentations/components/`. Import via `@/core/presentations/components/{name}`.

### Buttons

**FilledButton** — Primary CTA. Full-width by default. Override with `className="w-auto"`.

| Prop | Values | Default |
|---|---|---|
| `color` | `"primary"` / `"secondary"` / `"danger"` | `"primary"` |
| `size` | `"default"` / `"sm"` (`ComponentSize`) | `"default"` |
| `loading` | boolean | `false` |
| `disabled` | boolean | `false` |
| `type` | `"button"` / `"submit"` / `"reset"` | `"submit"` |

Color map:
- **primary**: `bg-primary-300 hover:bg-primary-400 text-white`
- **secondary**: `bg-gray-200 hover:bg-gray-300 text-gray-900`
- **danger**: `bg-red-500 hover:bg-red-600 text-white`

Size classes (from `BUTTON_SIZE_CLASSES` in `form-field.tsx`):
- **default**: `px-3 py-2.5 text-sm font-semibold sm:py-2`
- **sm**: `px-2.5 py-1.5 text-xs font-semibold`

Base classes: `inline-flex w-full justify-center rounded-md shadow-xs`

**OutlinedButton** — Secondary actions, cancel buttons. Full-width by default.

Style: `bg-white ring-1 ring-inset ring-gray-300 hover:bg-gray-50 text-gray-900`

**Button pairs** — Cancel + Submit side-by-side:
```tsx
<div className="flex gap-x-3 pt-2">
  <OutlinedButton onClick={onCancel}>Cancel</OutlinedButton>
  <FilledButton type="submit" loading={loading}>Save</FilledButton>
</div>
```

### Form Inputs

All form inputs extend `BaseInputProps` (from `form-field.tsx`): `label?`, `error?`, `className?`, `size?: ComponentSize`, `required?`. Each input wraps its element in `<FormField>` which handles label, error, and layout.

Shared input styling:
- Input: `block w-full rounded-md bg-white px-3 ${INPUT_SIZE_CLASSES[size]} text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-300`
- Error: `mt-1 text-sm text-red-600`
- Label-to-input gap: `mt-1`

Size classes (from `INPUT_SIZE_CLASSES` in `form-field.tsx`):
- **default**: `py-2.5 text-sm sm:py-2` (mobile-first: larger touch target, compact on desktop)
- **sm**: `py-1.5 text-xs` (compact inline use, always small)

| Component | Extra Props |
|---|---|
| `TextInput` | `type`, `placeholder`, `value`, `onChange` |
| `SelectInput` | `options: {label, value}[]`, `placeholder`, `value`, `onChange` |
| `TextareaInput` | `placeholder`, `value`, `onChange`, `rows` (default 3) |
| `DateInput` | `value` (string), `onChange` |

### Cards

**SectionCard** — Primary content container.

```tsx
<SectionCard
  title="Section Title"
  headerAction={<FilledButton className="w-auto">Action</FilledButton>}
  bodyClassName=""  // override body padding (e.g., for flush tables)
>
  {children}
</SectionCard>
```

Style: `rounded-lg border border-neutral-200 bg-white`
- Header: `border-b border-b-neutral-100 px-4 py-3 sm:px-6 sm:py-4`
- Body: `p-4 sm:p-6` (default)

**SummaryCard** — KPI display.

```tsx
<SummaryCard
  title="Total Cost"
  value="$1.2M"
  trend={{ value: "+5.3%", positive: true }}
/>
```

Style: `rounded-lg border border-neutral-200 bg-white p-6`

### Modal

Uses `@headlessui/react` Dialog primitives.

```tsx
<Modal open={isOpen} onClose={close} title="Modal Title">
  <form className="space-y-4">
    {/* form fields */}
    <div className="flex gap-x-3 pt-2">
      <OutlinedButton onClick={close}>Cancel</OutlinedButton>
      <FilledButton type="submit">Save</FilledButton>
    </div>
  </form>
</Modal>
```

Style: `max-w-lg rounded-lg bg-white shadow-xl`, backdrop `bg-gray-500/75`.

### Table

Compound component. Always wrap in `SectionCard` with `bodyClassName=""`.

```tsx
<SectionCard title="Items" bodyClassName="">
  <Table.Container>
    <Table>
      <Table.Header items={[
        { node: "Name", hideOnMobile: false },
        { node: "Status", hideOnMobile: true },
      ]} />
      <Table.Body items={rows.map(r => ({
        row: [
          { node: r.name, hideOnMobile: false },
          { node: <Badge color="green">{r.status}</Badge>, hideOnMobile: true },
        ],
      }))} />
    </Table>
  </Table.Container>
</SectionCard>
```

- Rows: `divide-y divide-gray-200`
- Header: `bg-gray-50 text-sm font-semibold text-gray-900`
- Cells: `px-3 py-4 text-sm text-gray-500`
- Responsive: `hideOnMobile: true` hides column below `sm:`

### Badge

```tsx
<Badge color="green">Active</Badge>
```

Colors: `"gray"` | `"green"` | `"blue"` | `"red"` | `"yellow"`

Style: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-{color}-100 text-{color}-700`

### DonutChart

```tsx
<DonutChart
  items={[{ label: "Stocks", value: 5000, formattedValue: "$5,000" }]}
  emptyMessage="No data available."
/>
```

Uses SVG with the chart color palette. Legend rendered below.

### CurrencyTabs

```tsx
<CurrencyTabs currencies={["USD", "SGD"]} selected="USD" onChange={setCurrency} />
```

- Active: `bg-gray-900 text-white rounded-full`
- Inactive: `bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full`

### SegmentedToggle

Binary or multi-option toggle for switching between modes (e.g. "Select Existing" / "Create New").

```tsx
<SegmentedToggle
  options={[
    { label: "Select Existing", value: "select" },
    { label: "Create New", value: "create" },
  ]}
  value={mode}
  onChange={setMode}
/>
```

Style: Container `rounded-lg border border-gray-200 p-0.5`, active pill `bg-primary-300 text-white rounded-md`, inactive `text-gray-600 hover:text-gray-900 rounded-md`.

### DataCard / DataCardRow

Mobile-friendly card for displaying key-value data (used in list views on small screens).

```tsx
<DataCard onClick={handleClick}>
  <DataCardRow label="Name" value="My Account" />
  <DataCardRow label="Currency" value="SGD" />
</DataCard>
```

Style: `rounded-lg border border-neutral-200 bg-white p-4`, optional `onClick` adds `cursor-pointer active:bg-gray-50`.

### StepIndicator

Multi-step progress indicator for wizards.

```tsx
<StepIndicator steps={["Account", "Asset", "Transaction"]} currentIndex={1} />
```

Uses numbered circles with `primary-300` for completed/current steps, `gray-300` for future. Connecting lines between steps.

### Feedback

| Component | Usage |
|---|---|
| `Spinner` | Centered loading. Wrap in `<div className="flex justify-center py-12">`. Accepts `className` to override color (default `text-primary-300`). Buttons pass `className="text-white"` or `className="text-gray-900"`. |
| `ErrorDisplay` | Error alert. Red bg with `XCircleIcon`. Children = error message text. |
| `PageHeading` | Top of every page. `children` = title, `subtitle` = optional description. |
| `TortoLogo` | Brand logo. `variant="dark"` (default) or `"light"`. Size via `className="w-28"`. |

---

## 6. Icons

**Library**: `@heroicons/react` (Heroicons v2)

### Import Patterns

```tsx
import { HomeIcon } from "@heroicons/react/24/outline";     // Default (inactive)
import { HomeIcon } from "@heroicons/react/24/solid";        // Active / filled
import { XCircleIcon } from "@heroicons/react/20/solid";     // Small inline
```

### Sizing

| Context | Class |
|---|---|
| Navigation items | `size-5` |
| Inline icons (buttons, alerts) | `size-5` |
| Decorative (empty states) | `size-6` |
| Large decorative | `size-12` |
| Icon backgrounds | `size-12` container with `size-6` icon |

### Navigation Icon Pairs

Each nav item uses **outline** (inactive) and **solid** (active) variants:
- `HomeIcon` — Home
- `ClockIcon` — Activity
- `Cog6ToothIcon` — Settings

---

## 7. Interaction Patterns

### Navigation

Sidebar link states:
- **Active**: `bg-primary-300/10 text-primary-300` with solid icon
- **Inactive**: `text-neutral-300 hover:bg-primary-300/5 hover:text-primary-300` with outline icon

### Focus States

All interactive elements: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300`

### Loading States

```tsx
// Page/section loading
<div className="flex justify-center py-12">
  <Spinner />
</div>

// Button loading — pass loading={true}, shows spinner inline
<FilledButton loading={true}>Save</FilledButton>
```

### Error States

```tsx
<ErrorDisplay>{error.message}</ErrorDisplay>
```

Red alert box with `XCircleIcon`. Always show the error message text, never a generic fallback.

### Empty States

Centered layout with icon, heading, description, and CTA:

```tsx
<div className="flex flex-col items-center py-12">
  <div className="flex size-12 items-center justify-center rounded-full bg-primary-50">
    <SomeIcon className="size-6 text-primary-300" />
  </div>
  <h3 className="mt-4 text-base font-semibold text-gray-900">Nothing here yet</h3>
  <p className="mt-1 max-w-sm text-center text-sm text-gray-500">
    Descriptive message explaining what to do.
  </p>
  <FilledButton type="button" onClick={onAction} className="mt-6 w-auto">
    Create first item
  </FilledButton>
</div>
```

### State Rendering Order

Every data-driven component must handle states in this order:

```tsx
if (loading) return <Spinner centered />;
if (error) return <ErrorDisplay>{error.message}</ErrorDisplay>;
if (data.length === 0) return <EmptyState />;
return <DataView />;
```

---

## 8. Page Composition

### Standard Authenticated Page

```tsx
export default function FeaturePage() {
  return (
    <>
      <PageHeading subtitle="Optional description">Page Title</PageHeading>
      {/* Optional: filter bar */}
      <div className="space-y-6">
        {/* Content sections */}
      </div>
    </>
  );
}
```

### Dashboard Page (with currency selector)

```tsx
<PageHeading subtitle="Track your investments">Dashboard</PageHeading>
<div className="space-y-6">
  <CurrencyTabs currencies={currencies} selected={selected} onChange={onChange} />
  <PortfolioSummaryImpl />
  <PositionsTableImpl />
  <PortfolioBreakdownImpl />
</div>
```

### CRUD List Page

```tsx
<PageHeading subtitle="Manage your accounts">Accounts</PageHeading>
<AccountListImpl />
{/* AccountListImpl internally renders: SectionCard + Table + Modals */}
```

---

## 9. Sign-In Page Style

Two-panel layout (desktop) / single panel (mobile):

- **Left panel** (hidden on mobile): Gradient bg `from-primary-500 via-primary-400 to-primary-300`, decorative translucent circles (`bg-white/10`, `bg-white/20`), testimonial quote in `text-white/90`
- **Right panel**: Centered form, max-width `max-w-md`, `space-y-8` vertical rhythm
- Sign-in button uses `!rounded-full py-2.5` override for pill shape

---

## 10. Do's and Don'ts

### Do

- Use existing components from `@/core/presentations/components/`
- Follow the state rendering order (loading → error → empty → data)
- Use `clsx` for conditional class merging
- Use `space-y-*` for vertical rhythm inside forms and sections
- Use `gap-*` for grid and flex layouts
- Keep button pairs as `OutlinedButton` + `FilledButton` in a `flex gap-x-3`
- Use `bodyClassName=""` on `SectionCard` when embedding tables (removes padding)
- Use the custom color tokens (`primary-*`, `neutral-*`, `error-*`, `success-*`, `warning-*`)

### Don't

- Don't create new color variables — use the existing token palette
- Don't use `margin` for spacing between sibling elements — use `space-y-*` or `gap-*`
- Don't add `ring-*` focus styles manually — use the existing `focus-visible:outline-*` pattern
- Don't use raw `<button>` — use `FilledButton` or `OutlinedButton`
- Don't use raw `<input>` — use `TextInput`, `SelectInput`, `DateInput`, or `TextareaInput`
- Don't use raw `<dialog>` — use the `Modal` component (Headless UI)
- Don't add shadows to cards — `SectionCard` already handles border + bg
- Don't mix `px`/`rem` with Tailwind spacing classes
- Don't introduce new icon libraries — use `@heroicons/react`
- Don't hardcode breakpoints — use Tailwind responsive prefixes
