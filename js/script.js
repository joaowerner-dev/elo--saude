const destino = "./pages/home.html";
const tempoTotal = 5;

let tempoRestante = tempoTotal;

const contador = document.getElementById("contador");
const progresso = document.getElementById("progresso");
const fraseDinamica = document.getElementById("fraseDinamica");
const barra = document.querySelector(".barra-carregamento");

const frases = [
  "Preparando um espaço especial para você...",
  "Carregando conteúdos com carinho e informação...",
  "Organizando cada detalhe do Elo Saúde...",
  "Quase tudo pronto para sua experiência..."
];

let indiceFrase = 0;

function atualizarFrase() {
  if (!fraseDinamica) return;

  fraseDinamica.style.opacity = "0";

  setTimeout(() => {
    fraseDinamica.textContent = frases[indiceFrase];
    fraseDinamica.style.opacity = "1";
    indiceFrase = (indiceFrase + 1) % frases.length;
  }, 180);
}

function atualizarTela() {
  if (contador) {
    contador.textContent = `Abrindo página principal em ${tempoRestante} segundo${tempoRestante === 1 ? "" : "s"}...`;
  }

  if (progresso) {
    const porcentagem = ((tempoTotal - tempoRestante) / tempoTotal) * 100;
    progresso.style.width = `${porcentagem}%`;
  }

  if (barra) {
    const porcentagem = ((tempoTotal - tempoRestante) / tempoTotal) * 100;
    barra.setAttribute("aria-valuenow", Math.max(0, Math.min(100, porcentagem)));
  }
}

atualizarTela();
atualizarFrase();

const trocaFrase = setInterval(() => {
  atualizarFrase();
}, 1600);

const intervalo = setInterval(() => {
  tempoRestante--;

  if (tempoRestante >= 0) {
    atualizarTela();
  }

  if (tempoRestante < 0) {
    clearInterval(intervalo);
    clearInterval(trocaFrase);
    window.location.href = destino;
  }
}, 1000);