const btnDiminuir = document.getElementById("diminuir-fonte");
const btnPadrao = document.getElementById("fonte-padrao");
const btnAumentar = document.getElementById("aumentar-fonte");
const btnLerTudo = document.getElementById("ler-tudo");
const btnParar = document.getElementById("parar-leitura");
const botoesTopico = document.querySelectorAll(".ouvir-topico");

const TAMANHO_PADRAO = 16;
const TAMANHO_MINIMO = 14;
const TAMANHO_MAXIMO = 22;
const CHAVE_FONTE = "fonte-noticia";

let tamanhoAtual = Number.parseInt(localStorage.getItem(CHAVE_FONTE), 10) || TAMANHO_PADRAO;

function limitarValor(valor, minimo, maximo) {
  return Math.min(Math.max(valor, minimo), maximo);
}

function aplicarFonte() {
  tamanhoAtual = limitarValor(tamanhoAtual, TAMANHO_MINIMO, TAMANHO_MAXIMO);
  document.documentElement.style.fontSize = `${tamanhoAtual}px`;
  localStorage.setItem(CHAVE_FONTE, String(tamanhoAtual));
}

function aumentarFonte() {
  if (tamanhoAtual < TAMANHO_MAXIMO) {
    tamanhoAtual += 1;
    aplicarFonte();
  }
}

function diminuirFonte() {
  if (tamanhoAtual > TAMANHO_MINIMO) {
    tamanhoAtual -= 1;
    aplicarFonte();
  }
}

function resetarFonte() {
  tamanhoAtual = TAMANHO_PADRAO;
  aplicarFonte();
}

function speechDisponivel() {
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

function pararLeitura() {
  if (!speechDisponivel()) return;
  window.speechSynthesis.cancel();
}

function limparTexto(texto) {
  return texto
    .replace(/\s+/g, " ")
    .replace(/\.\s*\./g, ".")
    .trim();
}

function obterTextoDoElemento(elemento) {
  if (!elemento) return "";

  const partes = elemento.querySelectorAll("h1, h2, h3, p, li");
  const textos = [];

  partes.forEach((parte) => {
    const conteudo = parte.innerText.trim();
    if (conteudo) {
      textos.push(conteudo);
    }
  });

  return limparTexto(textos.join(". "));
}

function obterVozPTBR() {
  if (!speechDisponivel()) return null;

  const vozes = window.speechSynthesis.getVoices();

  return (
    vozes.find((voz) => voz.lang === "pt-BR") ||
    vozes.find((voz) => voz.lang.toLowerCase().startsWith("pt")) ||
    null
  );
}

function lerTexto(texto) {
  if (!speechDisponivel() || !texto) return;

  pararLeitura();

  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = "pt-BR";
  fala.rate = 0.95;
  fala.pitch = 1;

  const voz = obterVozPTBR();
  if (voz) {
    fala.voice = voz;
  }

  window.speechSynthesis.speak(fala);
}

function lerTudo() {
  const materia = document.getElementById("materiaCompleta");
  const texto = obterTextoDoElemento(materia);
  lerTexto(texto);
}

function configurarLeituraPorTopico() {
  botoesTopico.forEach((botao) => {
    botao.addEventListener("click", () => {
      const secao = botao.closest(".bloco-noticia, .bloco-extra");
      const texto = obterTextoDoElemento(secao);
      lerTexto(texto);
    });
  });
}

function configurarBotoes() {
  btnAumentar?.addEventListener("click", aumentarFonte);
  btnDiminuir?.addEventListener("click", diminuirFonte);
  btnPadrao?.addEventListener("click", resetarFonte);
  btnLerTudo?.addEventListener("click", lerTudo);
  btnParar?.addEventListener("click", pararLeitura);
}

function iniciarVozes() {
  if (!speechDisponivel()) return;

  window.speechSynthesis.getVoices();

  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

window.addEventListener("beforeunload", () => {
  pararLeitura();
});

aplicarFonte();
configurarBotoes();
configurarLeituraPorTopico();
iniciarVozes();