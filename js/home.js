const btnAbrirMenu = document.getElementById("abrirMenu");
const menuMobile = document.getElementById("menuMobile");

const btnDiminuirFonte = document.getElementById("diminuirFonte");
const btnAumentarFonte = document.getElementById("aumentarFonte");
const btnResetarFonte = document.getElementById("resetarFonte");

const campoBusca = document.getElementById("campoBusca");
const btnPesquisar = document.getElementById("btnPesquisar");

const formSugestoes = document.getElementById("formSugestoes");
const mensagemForm = document.getElementById("mensagemForm");
const anoAtual = document.getElementById("anoAtual");

const TAMANHO_PADRAO = 16;
const TAMANHO_MIN = 14;
const TAMANHO_MAX = 22;
const CHAVE_FONTE = "eloSaude_tamanhoFonte";

/* =========================
   FONTE
========================= */
function aplicarTamanhoFonte(valor) {
  document.documentElement.style.fontSize = `${valor}px`;
}

function obterTamanhoFonte() {
  const salvo = localStorage.getItem(CHAVE_FONTE);
  const numero = Number.parseInt(salvo, 10);

  if (Number.isNaN(numero)) {
    return TAMANHO_PADRAO;
  }

  return Math.min(Math.max(numero, TAMANHO_MIN), TAMANHO_MAX);
}

function salvarTamanhoFonte(valor) {
  localStorage.setItem(CHAVE_FONTE, String(valor));
  aplicarTamanhoFonte(valor);
}

function diminuirFonte() {
  const atual = obterTamanhoFonte();
  if (atual > TAMANHO_MIN) {
    salvarTamanhoFonte(atual - 1);
  }
}

function aumentarFonte() {
  const atual = obterTamanhoFonte();
  if (atual < TAMANHO_MAX) {
    salvarTamanhoFonte(atual + 1);
  }
}

function resetarFonte() {
  salvarTamanhoFonte(TAMANHO_PADRAO);
}

/* =========================
   MENU MOBILE
========================= */
function alternarMenuMobile() {
  if (!menuMobile) return;

  const aberto = menuMobile.classList.toggle("ativo");
  btnAbrirMenu?.setAttribute("aria-expanded", aberto ? "true" : "false");
}

function fecharMenuMobile() {
  if (!menuMobile) return;

  menuMobile.classList.remove("ativo");
  btnAbrirMenu?.setAttribute("aria-expanded", "false");
}

/* =========================
   DESTAQUE VISUAL
========================= */
function limparDestaques() {
  document.querySelectorAll(".is-highlighted").forEach((elemento) => {
    elemento.classList.remove("is-highlighted");
  });
}

function destacarElemento(elemento) {
  if (!elemento) return;

  limparDestaques();
  elemento.classList.add("is-highlighted");

  setTimeout(() => {
    elemento.classList.remove("is-highlighted");
  }, 2200);
}

/* =========================
   BUSCA
========================= */
function obterItensDeBusca() {
  return [
    ...document.querySelectorAll("section[data-keywords]"),
    ...document.querySelectorAll(".search-item[data-keywords]")
  ];
}

function pesquisarConteudo() {
  if (!campoBusca) return;

  const termo = campoBusca.value.trim().toLowerCase();
  if (!termo) {
    alert("Digite um termo para pesquisar.");
    return;
  }

  const itens = obterItensDeBusca();

  const encontrado = itens.find((item) => {
    const palavras = (item.dataset.keywords || "").toLowerCase();
    const texto = (item.textContent || "").toLowerCase();
    return palavras.includes(termo) || texto.includes(termo);
  });

  if (encontrado) {
    encontrado.scrollIntoView({ behavior: "smooth", block: "center" });
    destacarElemento(encontrado);
    return;
  }

  alert("Nenhum conteúdo encontrado para essa busca.");
}

/* =========================
   FORMULÁRIO
========================= */
function enviarFormularioPorEmail(event) {
  event.preventDefault();

  const nome = document.getElementById("nome")?.value.trim() || "";
  const email = document.getElementById("email")?.value.trim() || "";
  const mensagem = document.getElementById("mensagem")?.value.trim() || "";

  if (!nome || !email || !mensagem) {
    if (mensagemForm) {
      mensagemForm.textContent = "Preencha nome, e-mail e mensagem.";
    }
    return;
  }

  const destino = "elosaudeconexao@gmail.com";
  const assunto = encodeURIComponent(`Sugestão para o Elo Saúde - ${nome}`);
  const corpo = encodeURIComponent(
    `Nome: ${nome}\n` +
    `E-mail: ${email}\n\n` +
    `Mensagem:\n${mensagem}`
  );

  if (mensagemForm) {
    mensagemForm.textContent = "Abrindo seu aplicativo de e-mail...";
  }

  window.location.href = `mailto:${destino}?subject=${assunto}&body=${corpo}`;
}

/* =========================
   CARDS DE TEMAS
========================= */
function iniciarTemaCards() {
  const botoes = document.querySelectorAll(".btn-ver-mais");

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      const card = botao.closest(".topic-card");
      const extra = card?.querySelector(".topic-extra");

      if (!extra) return;

      extra.classList.toggle("ativo");
      botao.textContent = extra.classList.contains("ativo") ? "Ver menos" : "Ver mais";
    });
  });
}

/* =========================
   FALLBACK DE IMAGENS
========================= */
function criarImagemFallback(texto) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4f8cff"/>
          <stop offset="55%" stop-color="#9a6bff"/>
          <stop offset="100%" stop-color="#ff89c9"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)"/>
      <circle cx="980" cy="120" r="100" fill="rgba(255,255,255,0.12)"/>
      <circle cx="180" cy="660" r="140" fill="rgba(255,255,255,0.10)"/>
      <text x="600" y="390" text-anchor="middle" fill="white" font-size="48" font-family="Arial, sans-serif" font-weight="700">
        ${texto}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function iniciarFallbackImagens() {
  const imagens = document.querySelectorAll("img[data-fallback-text]");

  imagens.forEach((imagem) => {
    imagem.addEventListener("error", () => {
      if (imagem.dataset.fallbackApplied === "true") return;

      imagem.dataset.fallbackApplied = "true";
      imagem.src = criarImagemFallback(imagem.dataset.fallbackText || "Elo Saúde");
    });
  });
}

/* =========================
   EVENTOS GERAIS
========================= */
document.addEventListener("DOMContentLoaded", () => {
  aplicarTamanhoFonte(obterTamanhoFonte());

  if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
  }

  iniciarTemaCards();
  iniciarFallbackImagens();

  btnAbrirMenu?.addEventListener("click", alternarMenuMobile);
  btnDiminuirFonte?.addEventListener("click", diminuirFonte);
  btnAumentarFonte?.addEventListener("click", aumentarFonte);
  btnResetarFonte?.addEventListener("click", resetarFonte);
  btnPesquisar?.addEventListener("click", pesquisarConteudo);
  formSugestoes?.addEventListener("submit", enviarFormularioPorEmail);

  campoBusca?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      pesquisarConteudo();
    }
  });

  menuMobile?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fecharMenuMobile);
  });

  document.addEventListener("click", (event) => {
    const clicouNoMenu = menuMobile?.contains(event.target);
    const clicouNoBotao = btnAbrirMenu?.contains(event.target);

    if (!clicouNoMenu && !clicouNoBotao) {
      fecharMenuMobile();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      fecharMenuMobile();
    }
  });
});