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
      node.setAttribute(key, value === true ? "" : value);
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
      const [site, banners, team, services, promos] = await Promise.all([
        client.from("site_settings").select("value").eq("key", "site").maybeSingle(),
        ordered("banners"),
        ordered("team_members"),
        ordered("services"),
        ordered("promotions"),
      ]);
      const pick = (res, fallback) => (res.error ? fallback : res.data);
      return {
        site: { ...defaults.site, ...(pick(site, null)?.value || {}) },
        banners: pick(banners, defaults.banners),
        team_members: pick(team, defaults.team_members),
        services: pick(services, defaults.services),
        promotions: pick(promos, defaults.promotions),
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

    const setInfo = (sel, value) => {
      const node = $(sel);
      if (!node) return;
      node.textContent = value || "";
      (node.closest(".info-row") || node).hidden = !value;
    };
    setInfo("#site-telefone", site.whatsapp_exibir);
    setInfo("#site-endereco", site.endereco);
    setInfo("#site-horario", site.horario);

    const maps = $("#site-maps");
    if (maps) {
      maps.href = site.google_maps || "#";
      maps.hidden = !site.google_maps;
    }

    const redes = $("#redes");
    redes.replaceChildren(
      ...[
        ["instagram", "Instagram", site.instagram],
        ["facebook", "Facebook", site.facebook],
        ["tiktok", "TikTok", site.tiktok],
        ["youtube", "YouTube", site.youtube],
      ]
        .filter(([, , url]) => url)
        .map(([key, label, url]) =>
          el("a", { class: "social", href: url, target: "_blank", rel: "noopener", "aria-label": label, title: label }, icon(key)),
        ),
    );
  }

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
    if (slideNodes.length > 1) setInterval(() => show((current + 1) % slideNodes.length), 6500);
  }

  function renderPromos(list) {
    const section = $("#promocoes");
    section.hidden = list.length === 0;
    $("#promos-grid").replaceChildren(
      ...list.map((p) =>
        el(
          "article",
          { class: "card promo" },
          p.image_url ? el("img", { src: p.image_url, alt: p.title, loading: "lazy" }) : null,
          el(
            "div",
            { class: "card-body" },
            p.price_label ? el("span", { class: "tag" }, p.price_label) : null,
            el("h3", {}, p.title),
            p.description ? el("p", {}, p.description) : null,
            p.valid_until ? el("small", { class: "muted" }, `Válido até ${formatDate(p.valid_until)}`) : null,
          ),
        ),
      ),
    );
  }

  function renderServices(list) {
    $("#servicos-grid").replaceChildren(
      ...list.map((s) =>
        el(
          "article",
          { class: "card service" },
          el("h3", {}, s.name),
          s.description ? el("p", {}, s.description) : null,
          el("div", { class: "price" }, s.price_label || "Consulte"),
        ),
      ),
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
    renderPromos(content.promotions);
    renderServices(content.services);
    renderTeam(content.team_members);
    $("#ano").textContent = new Date().getFullYear();
    setupUI();
  }

  init();
})();
