// Conteúdo usado enquanto o Supabase não estiver configurado (ou se a conexão falhar).
// Os mesmos dados são gravados no banco pelo supabase/schema.sql.
window.AVALON_DEFAULTS = {
  site: {
    nome: "Avalon Barbearia",
    whatsapp: "5562993067066",
    whatsapp_exibir: "(62) 99306-7066",
    mensagem: "Olá! Quero agendar um horário na Avalon Barbearia.",
    endereco: "",
    horario: "",
    google_maps: "https://www.google.com/maps/place/Avalon+barbearia/@-16.6979321,-49.3038516,17z/data=!3m1!4b1!4m6!3m5!1s0x935ef35249937e67:0x65ce57a93319db64!8m2!3d-16.6979373!4d-49.3012767!16s%2Fg%2F11mdvmsxn2?entry=ttu",
    instagram: "https://instagram.com/avalonbarbearia062",
    facebook: "",
    tiktok: "",
    youtube: "",
    threads: "",
    x: "",
  },
  banners: [
    {
      title: "Precisão em cada detalhe",
      subtitle: "Cortes masculinos com acabamento de alto padrão",
      image_url: "assets/img/hero-01.jpg",
      button_label: "Agendar pelo WhatsApp",
      button_link: "",
    },
    {
      title: "A barba feita como ela merece",
      subtitle: "Navalha, toalha quente e acabamento impecável",
      image_url: "assets/img/hero-02.jpg",
      button_label: "Agendar pelo WhatsApp",
      button_link: "",
    },
    {
      title: "Sua melhor versão começa aqui",
      subtitle: "Estilo • Cuidado • Confiança",
      image_url: "assets/img/hero-03.jpg",
      button_label: "Agendar pelo WhatsApp",
      button_link: "",
    },
  ],
  team_members: [
    { name: "Barbeiro Avalon", role: "Barbeiro especialista", photo_url: "assets/img/equipe-01.jpeg", instagram: "" },
    { name: "Barbeiro Avalon", role: "Barbeiro especialista", photo_url: "assets/img/equipe-02.jpeg", instagram: "" },
    { name: "Barbeiro Avalon", role: "Barbeiro especialista", photo_url: "assets/img/equipe-03.jpeg", instagram: "" },
  ],
  services: [
    { name: "Corte masculino", description: "Corte moderno com acabamento impecável e finalização.", price_label: "Consulte" },
    { name: "Barba modelada", description: "Desenho e modelagem da barba com toalha quente.", price_label: "Consulte" },
    { name: "Sobrancelha masculina", description: "Alinhamento e definição para um olhar marcante.", price_label: "Consulte" },
    { name: "Corte + barba", description: "O combo completo para renovar o visual de ponta a ponta.", price_label: "Consulte" },
  ],
  promotions: [],
};
