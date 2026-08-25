const BASE_PATH = '/games/kyou-nani-taberu';

function assetRequest(request) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(BASE_PATH)) return null;
  const rest = url.pathname.slice(BASE_PATH.length);
  url.pathname = rest || '/';
  return new Request(url, request);
}

export default {
  async fetch(request, env) {
    const nextRequest = assetRequest(request);
    if (!nextRequest) return new Response('Not found', { status: 404 });
    const response = await env.ASSETS.fetch(nextRequest);
    if (response.status !== 404) return response;
    if (request.method === 'GET' && new URL(request.url).pathname.replace(/\/$/, '') === BASE_PATH) {
      const url = new URL(request.url);
      url.pathname = '/';
      return env.ASSETS.fetch(new Request(url, request));
    }
    return response;
  }
};
