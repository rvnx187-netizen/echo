# Segurança

- Mensagens são tratadas como texto (`textContent`); HTML e scripts não são interpretados.
- A migration permite leitura pública somente de mensagens aprovadas e não concede escrita pública.
- Operações privilegiadas devem usar Edge Functions e a service role somente no servidor.
- Não prometa anonimato absoluto: provedores podem processar dados técnicos para segurança.
- Configure HTTPS, CSP, `frame-ancestors`, `X-Content-Type-Options` e rate limiting no host/edge antes do lançamento.
- Revise RLS e teste tentativas de leitura de mensagens pendentes antes de publicar.
