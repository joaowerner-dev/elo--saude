const contador = document.getElementById("contador");

if (contador) {
  const destino = "pages/home.html";
  const parametros = new URLSearchParams(window.location.search);
  const voltouManual = parametros.get("voltar");

  if (!voltouManual) {
    const tempoTotal = 5;
    let tempoRestante = tempoTotal;

    contador.textContent = `Abrindo página principal em ${tempoRestante} segundos...`;

    const intervalo = setInterval(() => {
      tempoRestante--;

      if (tempoRestante > 0) {
        contador.textContent = `Abrindo página principal em ${tempoRestante} segundos...`;
      } else {
        contador.textContent = "Abrindo página principal...";
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalo);
      window.location.href = destino;
    }, tempoTotal * 1000);
  } else {
    contador.textContent = "Você voltou para a tela inicial.";
  }
}