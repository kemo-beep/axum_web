---
name: best-frontend
description: Frontend architecture and component patterns for readability, maintainability, and scalability. Use when creating or refactoring React components, routes, hooks, or UI structure in the web project.
---

# Best Frontend Practices

Guidance for keeping the frontend clean, componentized, and scalable in this TanStack Start + shadcn project.

## Component Organization

### One Component Per File

- **Extract each logical UI piece into its own file** under `src/components/`.
- Prefer many small, focused files over few large ones.
- Colocate related components: `FeatureCard.tsx` + `FeatureCardList.tsx` or `FeatureCard/index.tsx` + `FeatureCard/Card.tsx`.

### Naming Conventions

| Type        | Convention      | Example                    |
|-------------|-----------------|----------------------------|
| Components  | PascalCase      | `UserProfile.tsx`          |
| Hooks       | camelCase + use | `useAuth.ts`, `useUserForm.ts` |
| Utils       | camelCase       | `formatDate.ts`            |
| Route files | route path      | `index.tsx`, `about.tsx`   |

### File Layout

```
src/
├── components/
│   ├── ui/              # shadcn primitives (Button, Input, etc.)
│   ├── layout/          # Header, Footer, Sidebar
│   ├── features/        # Feature-specific blocks (group by domain)
│   └── shared/          # Reusable across features
├── hooks/
├── routes/
├── lib/
├── data/
└── integrations/
```

## Component Guidelines

### Keep Components Focused

- **Single responsibility**: Each component does one thing well.
- **Max ~200 lines**: Extract subcomponents or hooks when larger.
- **Props over inline logic**: Prefer `children` or explicit props over complex JSX in place.

### Route Files Stay Thin

- Route files should mainly wire `createFileRoute` to a **page component** imported from elsewhere.
- Put page layout and composition in `src/components/pages/` or feature folders.
- Example:

```tsx
// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '#/components/pages/HomePage'

export const Route = createFileRoute('/')({ component: HomePage })
```

### Extract Inline Data and Logic

- Move static arrays/objects to `src/data/` or `src/constants/`.
- Move reusable logic to custom hooks in `src/hooks/`.
- Avoid long inline `.map()` or data definitions inside components.

### Use Path Aliases

- Import via `#/components/...`, `#/hooks/...`, etc.
- Keeps imports short and stable when refactoring.

## Maintainability & Readability

### Structure Within a Component

1. Imports (grouped: React/external, internal, types)
2. Types/interfaces
3. Component definition
4. Export

### Prefer Composition

- Build complex UIs from small, composable components.
- Use `children` and render props when flexibility is needed.
- Avoid prop drilling: use context or state libraries for shared data.

### Form Components (TanStack Form)

- Keep form field wrappers (e.g. `TextField`, `Select`) in dedicated files.
- Extract `ErrorMessages` and similar helpers.
- Use `useFieldContext` / `useFormContext` in form-specific components only.

## Scalability

- **Feature folders**: Group by domain when a feature grows (`auth/`, `billing/`, etc.).
- **Lazy loading**: Use `React.lazy` + `Suspense` for heavy route-level components.
- **Shared types**: Centralize in `src/types/` or colocate with the feature.
- **Avoid coupling routes to implementation**: Route files import page components; page components orchestrate features.

## Checklist for New/Refactored Work

- [ ] One logical component per file
- [ ] No inline data blobs; extract to `data/` or constants
- [ ] Logic in hooks, not inline in JSX
- [ ] Imports use `#/` path alias
- [ ] Route files are thin and delegate to page components
- [ ] Components under ~200 lines; split if larger
