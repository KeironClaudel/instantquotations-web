# Startup Hardening Manual Test Notes

## 1. Blocked `/api/company-settings`
- Sign in normally.
- In DevTools, enable request blocking for `/api/company-settings`.
- Refresh the app.
- Expected:
  - The app does not render a blank page.
  - The startup recovery screen appears.
  - `Copy diagnostics` includes only endpoint, status code, error code, content type, timestamp, and user agent.
  - `Continue with defaults` keeps the app visible, but quotation creation and company settings writes are blocked.

## 2. `text/html` response instead of JSON
- Configure the local proxy/dev server so `/api/company-settings` returns an HTML document.
- Refresh after authentication.
- Expected:
  - The startup recovery screen appears.
  - Diagnostics show an unexpected content type or HTML response path.
  - Onboarding does not open automatically.

## 3. Valid incomplete company settings
- Make the backend return a valid JSON company settings object with missing required setup fields such as an empty `displayName` or empty `currencySymbol`.
- Refresh after authentication.
- Expected:
  - The app does not show the startup recovery screen.
  - The user is redirected to `/app/onboarding/company`.
  - This only happens when the response is valid JSON and shape validation succeeds.

## 4. Valid complete company settings
- Make the backend return a valid complete company settings object.
- Refresh after authentication.
- Expected:
  - The app loads normally.
  - No startup recovery screen appears.
  - Protected routes stay accessible.

## 5. Expired session / `401`
- Expire the auth cookies or force the backend to return `401` for the session hydration path.
- Refresh.
- Expected:
  - The refresh flow is attempted once.
  - If refresh fails, the app clears the session and redirects to `/login`.
  - The startup recovery screen is not shown for an expired session.

## 6. Backend `500`
- Make `/api/company-settings` return `500` with JSON.
- Refresh after authentication.
- Expected:
  - The startup recovery screen appears.
  - The app can continue with defaults for non-critical viewing.
  - Company settings save/logo upload and quotation create/share/send remain blocked until real settings load.
