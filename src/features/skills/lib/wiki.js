export class WikiRequestError extends Error {
  constructor(code, message) { super(message); this.name = 'WikiRequestError'; this.code = code; }
}

// Reads the summary from the page's own language edition first (id.wikipedia for the Indonesian site) and falls
// back to English when that edition has no article for the title.
export async function fetchSkillSummary(wikiTitle, { signal, fetchImpl = fetch, language = 'en' } = {}) {
  if (language === 'en') return fetchFromEdition(wikiTitle, 'en', { signal, fetchImpl });
  try {
    return await fetchFromEdition(wikiTitle, language, { signal, fetchImpl });
  } catch (error) {
    if (error?.code !== 'not_found') throw error;
    return fetchFromEdition(wikiTitle, 'en', { signal, fetchImpl });
  }
}

async function fetchFromEdition(wikiTitle, edition, { signal, fetchImpl }) {
  const slug = encodeURIComponent(wikiTitle.replaceAll(' ', '_'));
  let response;
  try {
    response = await fetchImpl(`https://${edition}.wikipedia.org/api/rest_v1/page/summary/${slug}`, { signal, headers: { Accept: 'application/json' } });
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw new WikiRequestError('network', 'Wikipedia tidak dapat dijangkau.');
  }
  if (response.status === 404) throw new WikiRequestError('not_found', 'Artikel tidak ditemukan.');
  if (!response.ok) throw new WikiRequestError('request', `Wikipedia mengembalikan status ${response.status}.`);
  let data;
  try { data = await response.json(); }
  catch { throw new WikiRequestError('invalid', 'Ringkasan Wikipedia tidak dapat dibaca.'); }
  if (typeof data.extract !== 'string' || !data.extract.trim()) throw new WikiRequestError('not_found', 'Ringkasan artikel belum tersedia.');
  return { title: typeof data.title === 'string' ? data.title : wikiTitle, extract: data.extract, url: `https://${edition}.wikipedia.org/wiki/${slug}` };
}
