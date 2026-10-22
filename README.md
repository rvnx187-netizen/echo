# ECHO

ECHO é um pequeno universo de mensagens positivas anônimas: **deixe algo bom no universo**.

## Estado atual

O frontend está funcional sem dependências e abre diretamente em `index.html`. Sem configuração externa, ele exibe conteúdo fictício claramente marcado como **modo demonstração** e mantém novos ecos apenas na tela atual. A migration e a Edge Function fornecem a base segura para o fluxo real com Supabase; a publicação real ainda exige configurar o projeto e a moderação administrativa.

## Executar localmente

Abra `index.html` no navegador. Para evitar restrições de módulos em `file://`, use qualquer servidor estático local disponível, por exemplo `python -m http.server 8080`, e acesse `http://localhost:8080`.

## Supabase

1. Crie um projeto Supabase.
2. Aplique `supabase/migrations/001_initial.sql` pelo SQL Editor ou CLI.
3. Publique `supabase/functions/submit-message` com a chave `SUPABASE_SERVICE_ROLE_KEY` apenas como secret da função.
4. Configure a URL da função no frontend e substitua o comportamento de demonstração por uma chamada `fetch` autenticada com a chave anon pública.
5. Adicione uma função administrativa separada, protegida por autenticação Supabase, para aprovar/rejeitar/ocultar mensagens. Nunca coloque a service role no navegador.

## Testes e segurança

O fluxo local pode ser verificado manualmente: contador, limite de 280 caracteres, mensagens vazias, links, pausa, `prefers-reduced-motion`, foco de teclado e estado de erro. A integração Supabase não foi executada porque não há credenciais configuradas. Veja [SECURITY.md](SECURITY.md) e [PRIVACY.md](PRIVACY.md).

## Deploy

Hospede os arquivos estáticos em Cloudflare Pages ou outro host HTTPS. Configure as variáveis somente no ambiente de deploy. Não publique o site ou crie cobranças sem revisão explícita.

## Próximas etapas

- Ligar o composer à Edge Function real.
- Implementar autenticação e painel administrativo separado.
- Adicionar Realtime apenas para mensagens `approved`.
- Configurar Turnstile e rate limiting no edge.
- Adicionar testes automatizados com Playwright/Vitest quando Node estiver disponível.
