// ==========================
// CONTROLE DE FONTE
// ==========================
let tamanhoFonte = 16;

const aumentar = document.getElementById("aumentarFonte");
const diminuir = document.getElementById("diminuirFonte");
const reset = document.getElementById("resetFonte");

// carregar fonte salva
if (localStorage.getItem("fonte")) {
  tamanhoFonte = parseInt(localStorage.getItem("fonte"));
  document.body.style.fontSize = tamanhoFonte + "px";
}

// aumentar
if (aumentar) {
  aumentar.addEventListener("click", () => {
    if (tamanhoFonte < 24) {
      tamanhoFonte += 2;
      document.body.style.fontSize = tamanhoFonte + "px";
      localStorage.setItem("fonte", tamanhoFonte);
    }
  });
}

// diminuir
if (diminuir) {
  diminuir.addEventListener("click", () => {
    if (tamanhoFonte > 12) {
      tamanhoFonte -= 2;
      document.body.style.fontSize = tamanhoFonte + "px";
      localStorage.setItem("fonte", tamanhoFonte);
    }
  });
}

// reset
if (reset) {
  reset.addEventListener("click", () => {
    tamanhoFonte = 16;
    document.body.style.fontSize = "16px";
    localStorage.setItem("fonte", 16);
  });
}

// ==========================
// MENU MOBILE
// ==========================
const abrirMenu = document.getElementById("abrirMenu");
const menuMobile = document.getElementById("menuMobile");

if (abrirMenu && menuMobile) {
  abrirMenu.addEventListener("click", () => {
    const aberto = menuMobile.style.display === "flex";
    menuMobile.style.display = aberto ? "none" : "flex";
  });
}

// ==========================
// LEITURA POR VOZ
// ==========================
const lerPagina = document.getElementById("lerPagina");

if (lerPagina) {
  lerPagina.addEventListener("click", () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const texto = document.body.innerText;
      const fala = new SpeechSynthesisUtterance(texto);
      fala.lang = "pt-BR";

      window.speechSynthesis.speak(fala);
    } else {
      alert("Seu navegador não suporta leitura por voz.");
    }
  });
}

// ==========================
// FORMULÁRIO DE SUGESTÃO
// ==========================
const form = document.getElementById("formSugestoes");
const mensagem = document.getElementById("mensagemForm");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const texto = document.getElementById("mensagem").value.trim();

    // validação simples
    if (!nome || !email || !texto) {
      mensagem.style.color = "red";
      mensagem.textContent = "Preencha todos os campos!";
      return;
    }

    if (!email.includes("@")) {
      mensagem.style.color = "red";
      mensagem.textContent = "Digite um e-mail válido!";
      return;
    }

    // sucesso
    mensagem.style.color = "green";
    mensagem.textContent = "Sugestão enviada com sucesso! 💙";

    form.reset();

    setTimeout(() => {
      mensagem.textContent = "";
    }, 4000);
  });
}

// ==========================
// ANO AUTOMÁTICO
// ==========================
const ano = document.getElementById("anoAtual");
if (ano) {
  ano.textContent = new Date().getFullYear();
}
const cardsTemas = document.querySelectorAll("#listaTemas .tema-card");
const botoesPagina = document.querySelectorAll(".btn-pagina");

const itensPorPagina = 4;
let paginaAtual = 1;

function mostrarPagina(pagina) {
  paginaAtual = pagina;

  const inicio = (pagina - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  cardsTemas.forEach((card, index) => {
    if (index >= inicio && index < fim) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });

  botoesPagina.forEach((botao) => {
    botao.classList.remove("ativo");
  });

  const botaoAtivo = document.querySelector(`.btn-pagina[data-pagina="${pagina}"]`);
  if (botaoAtivo) {
    botaoAtivo.classList.add("ativo");
  }
}

botoesPagina.forEach((botao) => {
  botao.addEventListener("click", () => {
    const pagina = parseInt(botao.getAttribute("data-pagina"));
    mostrarPagina(pagina);
  });
});

mostrarPagina(1);