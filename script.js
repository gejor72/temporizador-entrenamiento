const entrenamiento = [
  {
    nombre: "Activación + movilidad",
    vueltas: 1,
    ejercicios: [
      { nombre: "Skipping suave", tiempo: 120 },
      { nombre: "Jumping jacks", tiempo: 30 },
      { nombre: "Círculos hombros + cadera", reps: true },
      { nombre: "Rotaciones torácicas", reps: true },
      { nombre: "Sentadillas lentas", reps: true },
      { nombre: "Plancha frontal", tiempo: 30 },
      { nombre: "Plancha lateral izquierda", tiempo: 30 },
      { nombre: "Plancha lateral derecha", tiempo: 30 }
    ]
  },
  {
    nombre: "Bloque aeróbico continuo",
    vueltas: 3,
    ejercicios: [
      { nombre: "Comba / Skipping", tiempo: 60 },
      { nombre: "Sentadillas aire (20)", reps: true },
      { nombre: "Flexiones (15)", reps: true },
      { nombre: "Mountain climbers", tiempo: 60 },
      { nombre: "Zancadas (20)", reps: true },
      { nombre: "Jumping jacks", tiempo: 60 }
    ]
  },
  {
    nombre: "Bloque específico nadador",
    vueltas: 3,
    ejercicios: [
      { nombre: "Plancha antebrazos", tiempo: 30 },
      { nombre: "Superman (20)", reps: true },
      { nombre: "Elevaciones hombro banda (20)", reps: true },
      { nombre: "Remo con banda (15/15)", reps: true },
      { nombre: "Hollow body hold", tiempo: 30 }
    ]
  },
  {
    nombre: "Vuelta a la calma",
    vueltas: 1,
    ejercicios: [
      { nombre: "Estiramientos + respiración", tiempo: 300 }
    ]
  }
];

let bloqueIndex = 0;
let ejercicioIndex = 0;
let vueltaActual = 1;
let tiempoRestante = 0;
let intervalo = null;
let pausado = false;

const bloqueEl = document.getElementById("bloque");
const vueltaEl = document.getElementById("vuelta");
const ejercicioEl = document.getElementById("ejercicio");
const tiempoEl = document.getElementById("tiempo");

document.getElementById("start").onclick = iniciar;
document.getElementById("next").onclick = siguienteEjercicio;
document.getElementById("pause").onclick = pausar;

function iniciar() {
  document.getElementById("start").disabled = true;
  document.getElementById("pause").disabled = false;
  cargarEjercicio();
}

function cargarEjercicio() {
  const bloque = entrenamiento[bloqueIndex];
  const ejercicio = bloque.ejercicios[ejercicioIndex];

  bloqueEl.textContent = bloque.nombre;
  vueltaEl.textContent = `Vuelta ${vueltaActual} de ${bloque.vueltas}`;
  ejercicioEl.textContent = ejercicio.nombre;

  clearInterval(intervalo);

  if (ejercicio.tiempo) {
    document.getElementById("next").disabled = false;
    tiempoRestante = ejercicio.tiempo;
    actualizarTiempo();
    intervalo = setInterval(cuentaAtras, 1000);
  } else {
    tiempoEl.textContent = "Reps";
    document.getElementById("next").disabled = false;
  }
}

function cuentaAtras() {
  if (!pausado) {
    tiempoRestante--;

    // Pitidos 3, 2, 1
    if (tiempoRestante === 3 || tiempoRestante === 2 || tiempoRestante === 1) {
      beep(800, 150);
    }

    // Pitido final (0)
    if (tiempoRestante === 0) {
      beep(1200, 300);
    }

    actualizarTiempo();

    if (tiempoRestante <= 0) {
      siguienteEjercicio();
    }
  }
}

function actualizarTiempo() {
  const min = Math.floor(tiempoRestante / 60);
  const sec = tiempoRestante % 60;
  tiempoEl.textContent = `${min}:${sec.toString().padStart(2, "0")}`;
}

function siguienteEjercicio() {
  clearInterval(intervalo);
    
  ejercicioIndex++;
  const bloque = entrenamiento[bloqueIndex];

  if (ejercicioIndex >= bloque.ejercicios.length) {
    ejercicioIndex = 0;
    vueltaActual++;

    if (vueltaActual > bloque.vueltas) {
      bloqueIndex++;
      vueltaActual = 1;

      if (bloqueIndex >= entrenamiento.length) {
        finalizar();
        return;
      }
    }
  }
  cargarEjercicio();
}

function pausar() {
  pausado = !pausado;
  document.getElementById("pause").textContent =
    pausado ? "▶ Reanudar" : "⏸ Pausa";
}

function finalizar() {
  clearInterval(intervalo);
  bloqueEl.textContent = "Sesión completada 🎉";
  ejercicioEl.textContent = "Buen trabajo";
  vueltaEl.textContent = "";
  tiempoEl.textContent = "✔";
}

function beep(frecuencia = 800, duracion = 200) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  oscillator.frequency.value = frecuencia;
  oscillator.type = "sine";

  oscillator.start();
  gain.gain.setValueAtTime(1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + duracion / 1000
  );

  oscillator.stop(audioCtx.currentTime + duracion / 1000);
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}