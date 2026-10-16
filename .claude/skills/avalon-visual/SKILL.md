---
name: avalon-visual
description: Padrão visual do site e painel da Avalon Barbearia (cores, tipografia, botões, hover, WhatsApp, rodapé, fotos). Use sempre que criar ou alterar qualquer tela, seção, botão, card, rodapé ou estilo do projeto salao_avalon.
---

# Padrão visual Avalon

Use este padrão em toda alteração de interface do projeto. Não invente cores, fontes ou estilos novos sem pedido explícito do cliente.

## Cores (tokens em `assets/css/styles.css` e `assets/css/premium.css`)

- Fundo: `#0a0a0a` (`--bg`), secundário `#121212` (`--bg-2`), cards `#1a1a1a` (`--bg-3`)
- Dourado/amarelo principal: `#f5c400` (`--gold`), tom claro `#ffd84d`
- Degradê dourado para filetes e títulos especiais: `--gold-grad`
- Texto: `#f4f4f4` (`--text`), secundário `#9a9a9a` / `#a9a9a9` (`--muted`)
- Linhas e bordas douradas suaves: `--line` = `rgba(245, 196, 0, 0.22)`
- WhatsApp: verde `#25d366` (só no botão flutuante e nas ações de WhatsApp)

Nunca usar branco puro como fundo de seção. O branco aparece só como estado de hover.

## Tipografia

- Fonte única: **Roboto**, carregada do Google Fonts com pesos `300, 400, 500, 700`. Não usar peso 900.
- Títulos (`h1`, `h2`): peso 700, `letter-spacing: -0.02em`, `line-height` 1.12.
- `h3`: peso 600. Textos de corpo: peso 400, `line-height` 1.7.
- Rótulos em maiúsculas (eyebrow, títulos do rodapé, botões): peso 500, espaçamento amplo (0.14em a 0.22em), tamanho pequeno (0.72rem a 0.85rem).
- Subtítulos de destaque (hero): peso 300.
- Tamanhos com `clamp()` para responder à tela. Nunca fixar tamanho grande em px no título principal.

## Botões, links e hover

- Padrão: fundo ou borda **amarelo**, texto **preto** (botão cheio) ou **amarelo** (botão de contorno).
- Hover e foco: **fundo branco**, texto preto, borda branca. Vale para botões, links de menu, redes sociais, itens de lista e cards.
- Redes sociais: botão circular de 52px com o símbolo oficial (sem texto), amarelo no normal e branco no hover.
- Transição suave de 0.3s. Respeitar `prefers-reduced-motion`.

## WhatsApp

- Botão flutuante: pílula verde fixa no canto inferior direito, com texto "Agende agora" no desktop e só o ícone no celular. Anel pulsante verde ao redor. No hover fica branco com texto verde.
- Todos os botões de agendamento usam `data-whatsapp` (o link é montado em `main.js`).

## Layout

- Container com largura máxima de 1180px e 16px de margem lateral.
- Seções com padding vertical de 96px no desktop e 72px no celular, separadas por filete dourado fino.
- Seções alternadas: fundo `#0a0a0a` e depois `--bg-2`.
- Cabeçalho de seção: filete dourado curto, eyebrow em maiúsculas, título e uma linha de apoio.
- Rodapé em 4 colunas (marca, links rápidos, contato, redes), linha divisória, copyright centralizado e crédito "Desenvolvido por GLC Tecnologia®" com link para `https://www.glctecnologia.com.br`. Deixar espaço embaixo para o botão flutuante não cobrir o crédito.
- Redes sociais aparecem só se preenchidas no painel. Nunca duplicar os ícones na página.

## Fotos

- Slides do hero: `assets/img/hero-01.jpg`, `hero-02.jpg`, `hero-03.jpg`, em JPEG de até 1920px de largura.
- Em telas de até 900px, o `object-position` do hero fica deslocado para a direita (`82% 25%`) para mostrar o barbeiro, não o braço.
- Fotos novas: converter para JPEG com qualidade 85 antes de colocar no repositório.

## Painel administrativo (`admin/`)

- Mesma paleta, mesma fonte Roboto e mesmos botões amarelo→branco do site.
- Campos de texto: 20px (`1.25rem`), peso 500, cor branca. Placeholder em peso 300 e cinza `#8a8a8a`.
- Rótulos: 16–17px, cor `#c9c9c9`. Botões: 16px, letras maiúsculas com espaçamento.
- Títulos das telas: `h2` 28–32px, peso 700. Nomes nas listas: 20–21px, peso 500.
- Campo de senha sempre com botão de mostrar/ocultar (olho dourado, branco no hover).
- Caminhos de imagem do site (`assets/...`) são relativos à raiz. No painel, use `mediaUrl()` para subir um nível.

## Mapa

- A seção "Como chegar" usa iframe do Google Maps com `output=embed`, montado a partir das coordenadas do link salvo em `google_maps` (padrões `!3d…!4d…` ou `@lat,lng`).

## Não fazer

- Não mudar a fonte para outra família sem pedido.
- Não usar peso 900 nem texto em caixa-alta longo.
- Não colocar ícones repetidos na mesma tela.
- Não expor chaves `service_role` nem o arquivo `BD AVALON.txt`.
