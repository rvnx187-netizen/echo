import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const MAX = 280;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' } });

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return json({}, 204);
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  let body: { content?: unknown };
  try { body = await request.json(); } catch { return json({ error: 'invalid_json' }, 400); }
  const content = typeof body.content === 'string' ? body.content.trim() : '';
  if (!content || content.length > MAX || /https?:\/\//i.test(content) || /www\./i.test(content)) return json({ error: 'invalid_content' }, 400);
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data, error } = await supabase.from('messages').insert({ content, status: 'pending' }).select('id,status').single();
  if (error) return json({ error: 'storage_failed' }, 500);
  return json({ message: data, detail: 'pending_moderation' }, 202);
});
