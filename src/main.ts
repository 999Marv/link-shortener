import { generateShortCode, getShortLink, storeShortLink } from './db.ts';
import { Router } from './router.ts';

const app = new Router();

app.post('/links', async (req) => {
  const { longUrl } = await req.json();

  const shortCode = await generateShortCode(longUrl);
  await storeShortLink(longUrl, shortCode, 'testUser');

  return new Response('success!', {
    status: 201,
  });
});

app.get('/links/:id', async (_req, _info, params) => {
  const shortCode = params?.pathname.groups.id;

  const data = await getShortLink(shortCode!);

  return new Response(JSON.stringify(data), {
    status: 201,
    headers: {
      'content-type': 'application/json',
    },
  });
});

app.post('/health-check', () => new Response('ITS ALIVE'));

export default {
  fetch(req) {
    return app.handler(req);
  },
} satisfies Deno.ServeDefaultExport;
