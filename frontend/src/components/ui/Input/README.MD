
---

## Main `Input` Props

Below are the core props most commonly used on the main `Input` component.

| Prop | Type | Description |
| --- | --- | --- |
| `id` | `string` | Input id. Auto-generated if omitted. |
| `name` | `string` | Native input name. |
| `type` | `string` | Input type. Supports text, email, password, search, tel, number, url, date. |
| `value` | `string \| number` | Controlled value. |
| `defaultValue` | `string \| number` | Uncontrolled default value. |
| `label` | `string` | Floating label content. |
| `placeholder` | `string` | Native placeholder text. |
| `helperText` | `ReactNode` | Contextual helper text below the input. |
| `helperTextState` | `string` | Helper state: `default`, `info`, `success`, `warning`. |
| `error` | `boolean \| string \| ReactNode \| ReactNode[]` | Error state or error content. |
| `errorMessage` | `string \| ReactNode \| ReactNode[]` | Explicit error message. |
| `success` | `boolean` | Success visual state. |
| `warning` | `boolean` | Warning visual state. |
| `disabled` | `boolean` | Disabled field state. |
| `readOnly` | `boolean` | Read-only field state. |
| `loading` | `boolean` | Loading state. |
| `required` | `boolean` | Shows required state and ARIA support. |
| `leftIcon` | `ReactNode` | Leading icon. |
| `rightIcon` | `ReactNode` | Trailing icon. |
| `prefix` | `ReactNode` | Leading text affix. |
| `suffix` | `ReactNode` | Trailing text affix. |
| `showPasswordToggle` | `boolean` | Enables password visibility toggle. |
| `showClearButton` | `boolean` | Enables clear action when value exists. |
| `characterCounter` | `boolean` | Shows character counter. |
| `maxLength` | `number` | Max character count. |
| `showCounterProgress` | `boolean` | Shows progress bar in counter. |
| `showCounterRemaining` | `boolean` | Announces remaining characters. |
| `variant` | `string` | Visual variant. |
| `size` | `string` | Field size scale. |
| `shape` | `string` | Field shape preset. |
| `radius` | `string` | Optional radius override. |
| `className` | `string` | Container class name. |
| `inputClassName` | `string` | Field class name. |
| `actionsClassName` | `string` | Action area class name. |
| `helperClassName` | `string` | Helper message class name. |
| `errorClassName` | `string` | Error message class name. |
| `counterClassName` | `string` | Counter class name. |

---

## Component Responsibilities

Use the right component for the right job:

- use `Input` for the complete field experience
- use `InputContainer` when you need custom composition around the field
- use `InputField` when you only need the raw styled input
- use `InputActions` for affixes and action controls
- use `InputLabel` for floating labels
- use `InputHelperText` for guidance or supporting text
- use `InputError` for validation feedback
- use `InputCounter` for character-limited input experiences
- use `InputIcon` for reusable icon presentation
- use `PasswordToggle` for password-only visibility behavior

---

## Best Practices

- Prefer the main `Input` component unless you need highly custom layouts.
- Keep validation logic in the parent form layer, not inside presentational components.
- Use `label` whenever possible for clear accessibility.
- Provide `error` or `errorMessage` for invalid states instead of manually styling fields.
- Use `helperText` for guidance, not for validation failure.
- Use `showPasswordToggle` only with `type="password"`.
- Use `characterCounter` with `maxLength` for best UX.
- Keep icons meaningful and lightweight.
- Respect reduced-motion behavior when extending the package.
- Avoid duplicating logic already implemented by package children.

---

## When To Use Which Feedback Component

- Use `InputHelperText` for hints, context, and non-blocking guidance.
- Use `InputError` for blocking validation or error feedback.
- Use `success` and `warning` states to visually reinforce form status without replacing validation messaging.
- Use `InputCounter` for content-length guidance and limits.

---

## Production Notes

This package is built for a startup-grade React application and is suitable for:

- auth forms
- profile forms
- search bars
- filters
- admin dashboards
- booking workflows
- payment forms
- onboarding flows

It is designed to scale across a large product codebase while staying consistent with the KisanO brand and UI system.