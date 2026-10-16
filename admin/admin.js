(() => {
  "use strict";

  const cfg = window.AVALON_CONFIG || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const BUCKET = "media";

  const TABLES = {
    banners: {
      label: "Banners",
      title: "banner",
      preview: ["title", "position"],
      fields: [
        { key: "title", label: "Título", required: true },
        { key: "subtitle", label: "Subtítulo", type: "textarea" },
        { key: "image_url", label: "Imagem (use foto na horizontal, 1600×900 ou maior)", type: "image" },
        { key: "button_label", label: "Texto do botão" },
        { key: "button_link", label: "Link do botão (vazio = abre o WhatsApp)" },
        { key: "position", label: "Ordem (menor aparece primeiro)", type: "number" },
        { key: "active", label: "Ativo", type: "bool" },
      ],
    },
    team_members: {
      label: "Equipe",
      title: "barbeiro",
      preview: ["name", "role"],
      fields: [
        { key: "name", label: "Nome", required: true },
        { key: "role", label: "Especialização (ex.: Degradê, barba e navalha)" },
        { key: "photo_url", label: "Foto (retrato, vertical)", type: "image" },
        { key: "instagram", label: "Instagram (@usuario ou link)" },
        { key: "position", label: "Ordem", type: "number" },
        { key: "active", label: "Ativo", type: "bool" },
      ],
    },
    services: {
      label: "Serviços e preços",
      title: "serviço",
      preview: ["name", "price_label"],
      fields: [
        { key: "name", label: "Nome do serviço", required: true },
        { key: "description", label: "Descrição", type: "textarea" },
        { key: "price_label", label: "Preço (ex.: R$ 45,00 ou Consulte)" },
        { key: "position", label: "Ordem", type: "number" },
        { key: "active", label: "Ativo", type: "bool" },
      ],
    },
    promotions: {
      label: "Promoções",
      title: "promoção",
      preview: ["title", "valid_until"],
      fields: [
        { key: "title", label: "Título", required: true },
        { key: "description", label: "Descrição", type: "textarea" },
        { key: "price_label", label: "Oferta (ex.: R$ 30,00)" },
        { key: "image_url", label: "Imagem", type: "image" },
        { key: "valid_until", label: "Válida até", type: "date" },
        { key: "position", label: "Ordem", type: "number" },
        { key: "active", label: "Ativa", type: "bool" },
      ],
    },
  };

  const SITE_FIELDS = [
    { key: "nome", label: "Nome da barbearia" },
    { key: "whatsapp", label: "WhatsApp só com números, com DDI e DDD (ex.: 5562993067066)" },
    { key: "whatsapp_exibir", label: "WhatsApp para exibir (ex.: (62) 99306-7066)" },
    { key: "mensagem", label: "Mensagem padrão do WhatsApp", type: "textarea" },
    { key: "endereco", label: "Endereço", type: "textarea" },
    { key: "horario", label: "Horário de funcionamento" },
    { key: "google_maps", label: "Link do Google Maps" },
    { key: "instagram", label: "Instagram (link)" },
    { key: "facebook", label: "Facebook (link)" },
    { key: "tiktok", label: "TikTok (link)" },
    { key: "youtube", label: "YouTube (link)" },
    { key: "threads", label: "Threads (link)" },
    { key: "x", label: "X (link)" },
  ];

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value === undefined || value === null || value === false) continue;
      if (key.startsWith("on") && typeof value === "function") node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value === true ? "" : value);
    }
    node.append(...children.filter((c) => c !== undefined && c !== null && c !== false));
    return node;
  }

  const showEl = (sel, visible) => $(sel).classList.toggle("hidden", !visible);

  if (!cfg.supabaseUrl || cfg.supabaseUrl.includes("SEU-PROJETO") || !window.supabase) {
    showEl("#config-erro", true);
    return;
  }

  const client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  let currentTab = "banners";

  // Login
  $("#login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    $("#login-erro").textContent = "";
    const { error } = await client.auth.signInWithPassword({
      email: form.email.value.trim(),
      password: form.password.value,
    });
    if (error) $("#login-erro").textContent = "E-mail ou senha inválidos.";
  });

  $("#logout").addEventListener("click", () => client.auth.signOut());

  client.auth.onAuthStateChange((_event, session) => {
    showEl("#login", !session);
    showEl("#panel", Boolean(session));
    if (session) openTab(currentTab);
  });

  // Abas
  function renderTabs() {
    const nav = $("#tabs");
    const keys = [...Object.keys(TABLES), "site"];
    nav.replaceChildren(
      ...keys.map((key) =>
        el(
          "button",
          {
            type: "button",
            class: key === currentTab ? "tab is-active" : "tab",
            "data-tab": key,
            onclick: () => openTab(key),
          },
          key === "site" ? "Contato e redes" : TABLES[key].label,
        ),
      ),
    );
  }

  async function openTab(key) {
    currentTab = key;
    renderTabs();
    const content = $("#content");
    content.replaceChildren(el("p", { class: "muted" }, "Carregando…"));
    if (key === "site") return renderSite(content);
    return renderList(key, content);
  }

  // Listas
  async function renderList(key, container) {
    const table = TABLES[key];
    const { data, error } = await client.from(key).select("*").order("position", { ascending: true });
    if (error) {
      container.replaceChildren(el("p", { class: "erro" }, `Erro ao carregar: ${error.message}`));
      return;
    }
    container.replaceChildren(
      el(
        "div",
        { class: "toolbar" },
        el("h2", {}, table.label),
        el("button", { class: "btn", type: "button", onclick: () => openForm(key, null) }, `+ Novo ${table.title}`),
      ),
      data.length
        ? el("div", { class: "list" }, ...data.map((row) => rowCard(key, row)))
        : el("p", { class: "muted" }, "Nenhum item ainda. Clique em \"Novo\" para adicionar."),
    );
  }

  function rowCard(key, row) {
    const table = TABLES[key];
    const imageField = table.fields.find((f) => f.type === "image");
    const thumb = imageField ? row[imageField.key] : null;
    const details = table.preview
      .slice(1)
      .map((k) => (row[k] ? String(row[k]) : ""))
      .filter(Boolean)
      .join(" · ");

    return el(
      "article",
      { class: row.active === false ? "row is-off" : "row" },
      thumb ? el("img", { class: "thumb", src: thumb, alt: "" }) : el("div", { class: "thumb" }),
      el(
        "div",
        { class: "row-info" },
        el("strong", {}, String(row[table.preview[0]] || "(sem título)")),
        details ? el("span", { class: "muted" }, details) : null,
        el("small", { class: "muted" }, row.active === false ? "Oculto no site" : "Visível no site"),
      ),
      el(
        "div",
        { class: "row-actions" },
        el("button", { class: "btn btn-sm btn-outline", type: "button", onclick: () => openForm(key, row) }, "Editar"),
        el("button", { class: "btn btn-sm btn-danger", type: "button", onclick: () => removeRow(key, row) }, "Excluir"),
      ),
    );
  }

  async function removeRow(key, row) {
    const name = row[TABLES[key].preview[0]] || "este item";
    if (!window.confirm(`Excluir ${name}? Essa ação não pode ser desfeita.`)) return;
    const { error } = await client.from(key).delete().eq("id", row.id);
    if (error) return window.alert(`Erro ao excluir: ${error.message}`);
    openTab(key);
  }

  // Formulário em modal
  function openForm(key, row) {
    const table = TABLES[key];
    const dialog = $("#modal");
    const form = $("#modal-form");
    const values = row || { position: 0, active: true };

    form.replaceChildren(
      el("h2", {}, row ? `Editar ${table.title}` : `Novo ${table.title}`),
      ...table.fields.map((f) => fieldInput(f, values[f.key])),
      el("p", { class: "erro", id: "form-erro", role: "alert" }),
      el(
        "div",
        { class: "form-actions" },
        el("button", { class: "btn btn-outline", type: "button", onclick: () => dialog.close() }, "Cancelar"),
        el("button", { class: "btn", type: "submit" }, "Salvar"),
      ),
    );

    form.onsubmit = async (e) => {
      e.preventDefault();
      const payload = collect(table.fields, form, true);
      const query = row
        ? client.from(key).update(payload).eq("id", row.id)
        : client.from(key).insert(payload);
      const { error } = await query;
      if (error) {
        $("#form-erro").textContent = `Erro ao salvar: ${error.message}`;
        return;
      }
      dialog.close();
      openTab(key);
    };

    dialog.showModal();
  }

  function fieldInput(f, value) {
    const id = `f-${f.key}`;

    if (f.type === "bool") {
      const input = el("input", { type: "checkbox", id, name: f.key });
      input.checked = value !== false;
      return el("div", { class: "field inline" }, el("label", { for: id }, input, f.label));
    }

    if (f.type === "image") {
      const hidden = el("input", { type: "hidden", name: f.key });
      hidden.value = value || "";
      const preview = el("img", { class: "preview", alt: "" });
      if (value) preview.src = value;
      else preview.hidden = true;

      const file = el("input", { type: "file", accept: "image/*" });
      file.addEventListener("change", async () => {
        const picked = file.files[0];
        if (!picked) return;
        const path = `${f.key}/${Date.now()}-${picked.name.replace(/[^\w.-]+/g, "_")}`;
        const { error } = await client.storage.from(BUCKET).upload(path, picked, { cacheControl: "3600" });
        if (error) {
          $("#form-erro").textContent = `Erro no envio da imagem: ${error.message}`;
          return;
        }
        const { data } = client.storage.from(BUCKET).getPublicUrl(path);
        hidden.value = data.publicUrl;
        preview.src = data.publicUrl;
        preview.hidden = false;
      });

      return el("div", { class: "field" }, el("label", {}, f.label), preview, file, hidden);
    }

    const input = f.type === "textarea"
      ? el("textarea", { id, name: f.key, rows: "3" })
      : el("input", { id, name: f.key, type: f.type || "text", required: f.required ? true : null });
    input.value = value ?? (f.type === "number" ? 0 : "");
    return el("div", { class: "field" }, el("label", { for: id }, f.label), input);
  }

  function collect(fields, form, emptyAsNull) {
    const out = {};
    for (const f of fields) {
      const input = form.elements[f.key];
      if (f.type === "bool") out[f.key] = input.checked;
      else if (f.type === "number") out[f.key] = Number(input.value) || 0;
      else {
        const v = input.value.trim();
        out[f.key] = v === "" && emptyAsNull ? null : v;
      }
    }
    return out;
  }

  // Contato e redes
  async function renderSite(container) {
    const { data, error } = await client
      .from("site_settings")
      .select("value")
      .eq("key", "site")
      .maybeSingle();

    if (error) {
      container.replaceChildren(el("p", { class: "erro" }, `Erro ao carregar: ${error.message}`));
      return;
    }

    const values = data?.value || {};
    const form = el(
      "form",
      { class: "form-page", id: "site-form" },
      el("h2", {}, "Contato e redes sociais"),
      ...SITE_FIELDS.map((f) => fieldInput(f, values[f.key])),
      el("p", { class: "erro", id: "form-erro", role: "alert" }),
      el("button", { class: "btn", type: "submit" }, "Salvar alterações"),
      el("p", { class: "muted" }, "As alterações aparecem no site logo após salvar. Os links vazios não são exibidos."),
    );

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const value = collect(SITE_FIELDS, form, false);
      const { error: saveError } = await client
        .from("site_settings")
        .upsert({ key: "site", value, updated_at: new Date().toISOString() });
      $("#form-erro").textContent = saveError ? `Erro ao salvar: ${saveError.message}` : "Salvo com sucesso.";
    });

    container.replaceChildren(form);
  }
})();
