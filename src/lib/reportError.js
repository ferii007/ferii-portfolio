// Sends a browser-side error to /api/client-error, which writes it to Vercel's Runtime Logs. Nothing personal is
// sent: only the message, where it happened and the page path. At most a few reports per page view.
export const CLIENT_ERROR_ENDPOINT = '/api/client-error';
export const MAX_FIELD = 500;

let sent = 0;
const clip = (value) => String(value ?? '').slice(0, MAX_FIELD);

export function reportClientError(kind, error, extra = {}) {
  if (typeof window === 'undefined' || sent >= 5) return;
  sent += 1;
  const body = JSON.stringify({
    kind: clip(kind),
    message: clip(error?.message ?? error),
    stack: clip(error?.stack),
    page: clip(window.location.pathname),
    ...Object.fromEntries(Object.entries(extra).map(([key, value]) => [key, clip(value)])),
  });
  try {
    if (!navigator.sendBeacon?.(CLIENT_ERROR_ENDPOINT, new Blob([body], { type: 'application/json' }))) {
      fetch(CLIENT_ERROR_ENDPOINT, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
    }
  } catch { /* reporting must never break the page */ }
}
