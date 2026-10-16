# Avalon Barbearia

Site institucional com painel administrativo. Front-end estático (HTML, CSS e JavaScript puros) e Supabase para conteúdo, login e fotos.

## Estrutura

```
index.html              Site público
assets/css/styles.css   Estilo (Roboto, amarelo, hover branco)
assets/js/config.js     URL e chave do Supabase (preencher)
assets/js/defaults.js   Conteúdo padrão, usado se o Supabase não responder
assets/js/main.js       Carrega o conteúdo do Supabase e monta o site
admin/                  Painel administrativo (protegido por login)
supabase/schema.sql     Tabelas, regras de acesso, bucket de fotos e dados iniciais
robots.txt, sitemap.xml SEO (troque SEU-DOMINIO.com.br)
```

## Como configurar

1. **Crie o projeto no Supabase** (supabase.com > New project).
2. **Rode o banco:** no menu SQL Editor, cole o conteúdo de `supabase/schema.sql` e clique em Run.
3. **Crie o seu usuário de admin:** Authentication > Users > Add user > Create new user. Use e-mail e senha seus.
4. **Preencha a conexão:** em Project Settings > API, copie a *Project URL* e a *anon public key* para `assets/js/config.js`.
5. **Teste localmente:** abra `index.html` no navegador. Para o admin, abra `admin/index.html` e entre com o usuário criado.

## Como usar o painel

Em `/admin/` você altera:

- **Banners:** foto, título, subtítulo, texto e link do botão, ordem e ativo/oculto.
- **Equipe:** foto, nome, função e Instagram.
- **Serviços e preços:** nome, descrição e preço (ou "Consulte").
- **Promoções:** foto, oferta, validade e ordem.
- **Contato e redes:** número de WhatsApp, mensagem padrão, endereço, horário, Google Maps e links das redes.

As alterações aparecem no site logo após salvar.

## Publicação

O site é estático, então pode ir para qualquer hospedagem (Netlify, Vercel, Cloudflare Pages ou GitHub Pages). Antes de divulgar:

- Troque `SEU-DOMINIO.com.br` em `index.html`, `robots.txt` e `sitemap.xml`.
- Cole a tag do Google Ads/gtag no `<head>` do `index.html` (há um comentário indicando onde). O clique no WhatsApp já dispara o evento `whatsapp_click`.
- Use a URL da página inicial como destino dos anúncios.
