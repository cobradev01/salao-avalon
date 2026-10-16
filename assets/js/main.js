(() => {
  "use strict";

  const cfg = window.AVALON_CONFIG || {};
  const defaults = window.AVALON_DEFAULTS;
  const configured = Boolean(cfg.supabaseUrl) && !cfg.supabaseUrl.includes("SEU-PROJETO") && Boolean(window.supabase);

  const $ = (sel, root = document) => root.querySelector(sel);

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value === undefined || value === null || value === false || value === "") continue;
      if (key.startsWith("on") && typeof value === "function") node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value === true ? "" : value);
    }
    node.append(...children.filter((c) => c !== undefined && c !== null && c !== false));
    return node;
  }

  const formatDate = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR");

  const instagramUrl = (value) => (/^https?:/.test(value) ? value : `https://instagram.com/${value.replace(/^@/, "")}`);

  // Logos das redes sociais em SVG (texto fixo do próprio script, nunca vem do banco).
  const ICONS = {
    instagram:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zM7.6 4A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM17.5 5.3a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"/></svg>',
    facebook:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8.2h2.8l.4-3.3h-3.2V8.4c0-.9.3-1.6 1.6-1.6h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.3h2.8V22h3.4z"/></svg>',
    tiktok:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
    youtube:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5a2.7 2.7 0 0 0-1.9 1.9C2 8.9 2 12 2 12s0 3.1.4 4.8a2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9c.4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8zM10 15.1V8.9l5.2 3.1-5.2 3.1z"/></svg>',
    threads:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.2 2c-4.7 0-7.2 2.2-7.2 6.5v.5c0 4.4 2.5 7 7.2 7h.1c2.8 0 4.8-1.2 5.9-3.2l-2-1.1c-.7 1.4-2 2-3.9 2-2.7 0-4.3-1.5-4.3-4.3V9c0-2.6 1.4-4.2 4.5-4.2 2.6 0 4 1.2 4.6 3.4l2.1-.6C18.4 4.2 16.1 2 12.2 2zm.6 9.1c-.8 0-1.6.2-1.6 1.1 0 .5.5.9 1.4.9.9 0 1.7-.5 1.8-1.9-.5-.1-1.1-.1-1.6-.1z"/></svg>',
    x:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    whatsapp:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
  };

  function icon(name) {
    const template = document.createElement("template");
    template.innerHTML = ICONS[name].trim();
    return template.content.firstElementChild;
  }

  const waLink = (site, text) => {
    const message = encodeURIComponent(text || site.mensagem || "Olá! Quero agendar um horário.");
    return `https://wa.me/${String(site.whatsapp || "").replace(/\D/g, "")}?text=${message}`;
  };

  async function loadContent() {
    if (!configured) return defaults;
    try {
      const client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
      const ordered = (table) => client.from(table).select("*").eq("active", true).order("position", { ascending: true });
      const [site, banners, team, services, promos, gallery] = await Promise.all([
        client.from("site_settings").select("value").eq("key", "site").maybeSingle(),
        ordered("banners"),
        ordered("team_members"),
        ordered("services"),
        ordered("promotions"),
        ordered("gallery"),
      ]);
      const pick = (res, fallback) => (res.error ? fallback : res.data);
      return {
        site: { ...defaults.site, ...(pick(site, null)?.value || {}) },
        banners: pick(banners, defaults.banners),
        team_members: pick(team, defaults.team_members),
        services: pick(services, defaults.services),
        promotions: pick(promos, defaults.promotions),
        gallery: pick(gallery, defaults.gallery),
      };
    } catch (err) {
      console.warn("Avalon: usando o conteúdo padrão.", err);
      return defaults;
    }
  }

  function renderSite(site) {
    document.querySelectorAll("[data-whatsapp]").forEach((a) => {
      a.href = waLink(site, a.dataset.waText);
      a.target = "_blank";
      a.rel = "noopener";
    });

    // Localização: cartões de endereço, WhatsApp e horário, com texto de apoio quando vazio
    $("#loc-endereco").textContent = site.endereco || "Consulte o endereço no mapa ao lado.";
    $("#loc-telefone").textContent = site.whatsapp_exibir || "";
    $("#loc-horario").textContent = site.horario || "Consulte pelo WhatsApp.";

    // Mapa: usa as coordenadas do link do Google Maps do negócio
    // Latitude/longitude digitadas no painel têm prioridade; senão, usa o link do Google Maps
    const typed = { lat: String(site.latitude || "").trim(), lng: String(site.longitude || "").trim() };
    const typedOk = typed.lat && typed.lng && !isNaN(Number(typed.lat)) && !isNaN(Number(typed.lng));
    const coords = typedOk ? typed : parseCoords(site.google_maps || "");
    $("#map-card").hidden = !coords;
    if (coords) {
      // "Como chegar" abre direto a página da Avalon no Google Maps (link salvo no painel)
      const directions = site.google_maps;
      $("#mapa").src = `https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=17&hl=pt-BR&output=embed`;
      $("#site-rota").href = directions;
      $("#loc-rota-link").href = directions;
    }

    $("#footer-redes").replaceChildren(...socialLinks(site));

    // Link de agendamento online (AppBarber)
    const booking = $("#site-agendar-app");
    booking.href = site.agendar_url || "#";
    booking.hidden = !site.agendar_url;
  }

  function parseCoords(url) {
    const exact = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    const around = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    const m = exact || around;
    return m ? { lat: m[1], lng: m[2] } : null;
  }

  // Só entram as redes preenchidas no painel
  function socialLinks(site) {
    return [
      ["instagram", "Instagram", site.instagram],
      ["facebook", "Facebook", site.facebook],
      ["tiktok", "TikTok", site.tiktok],
      ["youtube", "YouTube", site.youtube],
      ["threads", "Threads", site.threads],
      ["x", "X", site.x],
    ]
      .filter(([, , url]) => url)
      .map(([key, label, url]) =>
        el("a", { class: "social", href: url, target: "_blank", rel: "noopener", "aria-label": label, title: label }, icon(key)),
      );
  }

  // Ponto de foco de cada foto do carrossel (onde está o rosto), para não cortar no celular
  const HERO_FOCUS = {
    "hero-01.jpg": "70% 25%",
    "hero-02.jpg": "70% 30%",
    "hero-03.jpg": "50% 25%",
    "hero-04.jpg": "50% 30%",
    "hero-05.jpg": "60% 30%",
    "hero-06.jpg": "55% 30%",
    "hero-07.jpg": "45% 25%",
    "hero-08.jpg": "40% 30%",
    "hero-09.jpg": "50% 30%",
    "hero-10.jpg": "35% 30%",
  };
  const heroFocus = (src) => HERO_FOCUS[String(src || "").split("/").pop()] || "50% 30%";

  function renderBanners(list, site) {
    const wrap = $("#banners");
    const dots = $("#hero-dots");
    const slides = list.length ? list : defaults.banners.slice(0, 1);

    wrap.replaceChildren(
      ...slides.map((b, i) => {
        const external = /^https?:/.test(b.button_link || "");
        return el(
          "div",
          { class: i === 0 ? "hero-slide is-active" : "hero-slide" },
          el("img", {
            class: "hero-img",
            src: b.image_url,
            alt: b.title || "Avalon Barbearia",
            style: `object-position: ${heroFocus(b.image_url)}`,
            fetchpriority: i === 0 ? "high" : "low",
          }),
          el(
            "div",
            { class: "hero-content" },
            el("p", { class: "eyebrow" }, "Barbearia masculina premium"),
            el(i === 0 ? "h1" : "h2", {}, b.title || "Avalon Barbearia"),
            b.subtitle ? el("p", { class: "hero-sub" }, b.subtitle) : null,
            el(
              "div",
              { class: "hero-actions" },
              el(
                "a",
                {
                  class: "btn",
                  href: b.button_link || waLink(site),
                  target: external ? "_blank" : null,
                  rel: external ? "noopener" : null,
                },
                b.button_label || "Agendar pelo WhatsApp",
              ),
            ),
          ),
        );
      }),
    );

    dots.replaceChildren(
      ...slides.map((_, i) =>
        el("button", { class: i === 0 ? "dot is-active" : "dot", type: "button", "aria-label": `Banner ${i + 1}` }),
      ),
    );

    const slideNodes = wrap.querySelectorAll(".hero-slide");
    const dotNodes = dots.querySelectorAll(".dot");
    let current = 0;
    const show = (n) => {
      current = n;
      slideNodes.forEach((s, i) => s.classList.toggle("is-active", i === n));
      dotNodes.forEach((d, i) => d.classList.toggle("is-active", i === n));
    };
    dotNodes.forEach((d, i) => d.addEventListener("click", () => show(i)));
    if (slideNodes.length > 1) setInterval(() => show((current + 1) % slideNodes.length), 4200);
  }

  // Foto ampliada ao clicar (fecha com o botão, com Esc ou clicando fora)
  function openLightbox(src, alt) {
    const box = el(
      "div",
      { class: "lightbox", role: "dialog", "aria-modal": "true", "aria-label": alt || "Foto ampliada" },
      el("img", { src, alt: alt || "" }),
      el("button", { class: "lightbox-close", type: "button", "aria-label": "Fechar", onclick: close }, "×"),
    );
    function close() {
      box.remove();
      document.removeEventListener("keydown", onKey);
    }
    function onKey(e) {
      if (e.key === "Escape") close();
    }
    box.addEventListener("click", (e) => {
      if (e.target === box) close();
    });
    document.addEventListener("keydown", onKey);
    document.body.append(box);
  }

  // Galeria de fotos da barbearia (o painel adiciona e remove fotos)
  function renderGallery(list) {
    const section = $("#galeria");
    section.hidden = list.length === 0;
    $("#galeria-grid").replaceChildren(
      ...list.map((g) =>
        el(
          "figure",
          { class: g.featured ? "gallery-item reveal is-wide" : "gallery-item reveal", onclick: () => openLightbox(g.image_url, g.caption) },
          el("img", {
            src: g.image_url,
            alt: g.caption || "Foto da Avalon Barbearia",
            loading: "lazy",
            // fotos mais largas que altas ocupam duas colunas, sem cortar
            onload: (e) => {
              if (e.target.naturalWidth > e.target.naturalHeight * 1.2) e.target.closest("figure").classList.add("is-wide");
            },
          }),
          g.caption ? el("figcaption", {}, g.caption) : null,
        ),
      ),
    );
  }

  // Compartilhar promoção: o Instagram não aceita link direto, então o texto com hashtags é copiado
  async function shareInstagram(text, url) {
    const full = `${text}\n${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: full, url });
        return;
      } catch (_) {
        // cancelado pelo usuário: segue para copiar o texto
      }
    }
    try {
      await navigator.clipboard.writeText(full);
      alert("Texto com as hashtags copiado. Cole na sua publicação do Instagram.");
    } catch (_) {
      alert(full);
    }
    window.open("https://www.instagram.com/", "_blank", "noopener");
  }

  function shareRow(p, site) {
    const url = window.location.origin + window.location.pathname;
    const tags = String(site.hashtags || "").trim();
    const details = [p.title, p.price_label, p.valid_until ? `válida até ${formatDate(p.valid_until)}` : ""].filter(Boolean);
    const text = [details.join(" · "), tags].filter(Boolean).join("\n");
    const link = (label, href) =>
      el("a", { class: "share-btn", href, target: "_blank", rel: "noopener", "aria-label": `Compartilhar no ${label}` }, icon(label.toLowerCase()), el("span", {}, label));
    return el(
      "div",
      { class: "share-row" },
      link("WhatsApp", `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`),
      link("Facebook", `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`),
      el(
        "button",
        { class: "share-btn", type: "button", "aria-label": "Compartilhar no Instagram", onclick: () => shareInstagram(text, url) },
        icon("instagram"),
        el("span", {}, "Instagram"),
      ),
    );
  }

  function renderPromos(list, site) {
    const section = $("#promocoes");
    section.hidden = list.length === 0;
    $("#promos-grid").replaceChildren(
      ...list.map((p) =>
        el(
          "article",
          { class: "card promo" },
          el(
            "div",
            { class: "promo-media" },
            p.image_url ? el("img", { src: p.image_url, alt: p.title, loading: "lazy" }) : null,
            el("span", { class: "promo-stamp" }, "Promoção"),
          ),
          el(
            "div",
            { class: "card-body" },
            p.price_label ? el("span", { class: "tag" }, p.price_label) : null,
            el("h3", {}, p.title),
            p.description ? el("p", {}, p.description) : null,
            p.valid_until ? el("small", { class: "muted" }, `Válido até ${formatDate(p.valid_until)}`) : null,
            shareRow(p, site),
          ),
        ),
      ),
    );
  }

  // Cada serviço vira um botão que abre a agenda online (o AppBarber não tem link por serviço)
  function renderServices(list, bookingUrl) {
    $("#servicos-grid").replaceChildren(
      ...list.map((s) => {
        const body = [
          el("h3", {}, s.name),
          s.description ? el("p", {}, s.description) : null,
          el("div", { class: "price" }, s.price_label || "Consulte"),
          bookingUrl ? el("span", { class: "service-cta" }, "Agendar este serviço") : null,
        ];
        return bookingUrl
          ? el("a", { class: "card service card-link", href: bookingUrl, target: "_blank", rel: "noopener", "aria-label": `Agendar ${s.name}` }, ...body)
          : el("article", { class: "card service" }, ...body);
      }),
    );
  }

  function renderTeam(list) {
    $("#equipe-grid").replaceChildren(
      ...list.map((m) =>
        el(
          "article",
          { class: "card member" },
          el("div", { class: "photo" }, el("img", { src: m.photo_url, alt: `${m.name}, barbeiro na Avalon`, loading: "lazy" })),
          el(
            "div",
            { class: "card-body" },
            el("h3", {}, m.name),
            m.role ? el("p", { class: "muted" }, m.role) : null,
            m.instagram
              ? el("a", { class: "social", href: instagramUrl(m.instagram), target: "_blank", rel: "noopener", "aria-label": "Instagram do barbeiro", title: "Instagram" }, icon("instagram"))
              : null,
          ),
        ),
      ),
    );
  }

  function setupUI() {
    const header = $(".site-header");
    const toggle = $(".menu-toggle");
    const nav = $("#menu");

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }),
    );

    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-whatsapp]") && typeof window.gtag === "function") {
        window.gtag("event", "whatsapp_click", { event_category: "lead" });
      }
    });

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          }),
        { threshold: 0.12 },
      );
      document.querySelectorAll(".reveal").forEach((node) => io.observe(node));
    } else {
      document.querySelectorAll(".reveal").forEach((node) => node.classList.add("in"));
    }
  }

  async function init() {
    const content = await loadContent();
    renderSite(content.site);
    renderBanners(content.banners, content.site);
    renderPromos(content.promotions, content.site);
    renderGallery(content.gallery);
    renderServices(content.services, content.site.agendar_url);
    renderTeam(content.team_members);
    $("#ano").textContent = new Date().getFullYear();
    setupUI();
  }

  init();
})();
