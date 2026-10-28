// Checks for the API routes. Scripts can fake these headers, so they only stop other websites from calling the
// endpoints through their visitors' browsers; the per-visitor rate limits handle the rest.

// The request came from one of this site's own pages.
export const fromOwnSite = (request) => {
  try { return new URL(request.headers.get('origin')).host === request.headers.get('host'); } catch { return false; }
};

// The browser says another website sent it (beacons may come without an Origin, so a missing one is allowed).
export const fromOtherSite = (request) => request.headers.get('sec-fetch-site') === 'cross-site'
  || (request.headers.has('origin') && !fromOwnSite(request));

// Vercel sets x-forwarded-for to the visitor's real IP (clients can't override it there).
export const visitorOf = (request) => request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
