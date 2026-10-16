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
        ["Instagram", site.instagram],
        ["Facebook", site.facebook],
        ["TikTok", site.tiktok],
        ["YouTube", site.youtube],
      ]
        .filter(([, url]) => url)
        .map(([label, url]) => el("a", { class: "social", href: url, target: "_blank", rel: "noopener", "aria-label": label }, label)),
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
              ? el("a", { class: "social", href: instagramUrl(m.instagram), target: "_blank", rel: "noopener" }, "Instagram")
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
