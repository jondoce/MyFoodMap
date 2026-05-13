# AGENTS.md

## Commands
- Use `npm` for this repo. The lockfile is `package-lock.json`.
- `npm start` starts Expo.
- `npm run ios`, `npm run android`, `npm run web` run the native/web targets.
- `npm run lint` runs ESLint.
- `npm run typecheck` runs `tsc --noEmit`.
- `npm test` runs Jest. For one file, pass a path after `--`, for example `npm test -- src/features/location/__tests__/locationService.test.ts`.

## Structure
- Expo Router drives navigation. App routes live in `app/` and `app/_layout.tsx` is the root layout.
- `src/features/` holds feature code, `src/shared/` holds reusable UI/config, and `src/lib/` holds infra clients.
- `components/` contains app-level helpers used by the router layout, including `useColorScheme` and themed primitives.

## Repo Notes
- `app/_layout.tsx` loads fonts, imports `global.css`, and wraps the app in `QueryProvider` and React Navigation theming.
- `app/(tabs)/_layout.tsx` gates the tab navigator behind `useAuth`; unauthenticated users are redirected to `/(auth)/login`.
- Supabase is required at runtime. `src/lib/supabase/client.ts` throws if `EXPO_PUBLIC_SUPABASE_URL` or `EXPO_PUBLIC_SUPABASE_ANON_KEY` is missing.
- Jest is configured in `jest.config.js` with aliases for `@/`, `@features/`, `@shared/`, and `@lib/`.
- `expo-location` is mocked in `src/features/location/__tests__/locationService.test.ts`; follow that pattern for location tests.
- Tailwind preflight is disabled in `tailwind.config.ts` (`corePlugins: { preflight: false }`). Do NOT re-enable it — `react-native-css-interop@0.2.3` crashes on `aspect-ratio` from preflight CSS.
- `@tailwind base` is NOT used in `global.css` — it causes the same `parseAspectRatio` crash even with preflight disabled. Only `@tailwind components` and `@tailwind utilities` are safe.
- Do NOT wrap rules in `@layer base { ... }` in `global.css` — Tailwind throws "`@layer base` is used but no matching `@tailwind base` directive is present" on bundle and breaks Metro on native. Keep web-only rules (CSS variables, `body`, `*`) at the top level; they are ignored on native.
- Google Fonts are loaded via `<link>` in `app/+html.tsx` (web only). Do NOT add `@import url(...)` in `global.css` — it triggers the same CSS parser crash.
- `react-native-css-interop@0.2.3` has an upstream bug: the `box-shadow` case in `parseDeclaration` is missing a `return` and falls through to `aspect-ratio`, which then crashes on `parseAspectRatio` because `ratio` is undefined. Fixed locally via `patches/react-native-css-interop+0.2.3.patch` and applied automatically by the `postinstall` script (`patch-package`). Do NOT remove the patch or the postinstall hook unless upstream ships a fix.
