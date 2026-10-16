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
    google_maps: "",
    instagram: "https://instagram.com/avalonbarbearia062",
    facebook: "",
    tiktok: "",
    youtube: "",
  },
  banners: [
    {
      title: "Cortes que definem seu estilo",
      subtitle: "Estilo • Cuidado • Confiança",
      image_url: "assets/img/banner-01.jpeg",
      button_label: "Agendar pelo WhatsApp",
      button_link: "",
    },
    {
      title: "Onde a qualidade fala mais alto",
      subtitle: "Barba modelada, sobrancelha e atendimento premium",
      image_url: "assets/img/banner-02.jpeg",
      button_label: "Agendar pelo WhatsApp",
      button_link: "",
    },
    {
      title: "Atendimento premium do começo ao fim",
      subtitle: "Corte, barba e sobrancelha com hora marcada",
      image_url: "assets/img/banner-03.jpeg",
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
