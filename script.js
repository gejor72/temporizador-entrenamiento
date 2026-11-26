const entrenamiento = [
 {nombre:"Activación + movilidad",vueltas:1,ejercicios:[{nombre:"Skipping suave",tiempo:120},{nombre:"Jumping jacks",tiempo:30},{nombre:"Círculos hombros + cadera",reps:true},{nombre:"Rotaciones torácicas",reps:true},{nombre:"Sentadillas lentas",reps:true},{nombre:"Plancha frontal",tiempo:30},{nombre:"Plancha lateral izquierda",tiempo:30},{nombre:"Plancha lateral derecha",tiempo:30}]},
 {nombre:"Bloque aeróbico continuo",vueltas:3,ejercicios:[{nombre:"Comba / Skipping",tiempo:60},{nombre:"Sentadillas aire (20)",reps:true},{nombre:"Flexiones (15)",reps:true},{nombre:"Mountain climbers",tiempo:60},{nombre:"Zancadas (20)",reps:true},{nombre:"Jumping jacks",tiempo:60}]},
 {nombre:"Bloque específico nadador",vueltas:3,ejercicios:[{nombre:"Plancha antebrazos",tiempo:30},{nombre:"Superman (20)",reps:true},{nombre:"Elevaciones hombro banda (20)",reps:true},{nombre:"Remo con banda (15/15)",reps:true},{nombre:"Hollow body hold",tiempo:30}]},
 {nombre:"Vuelta a la calma",vueltas:1,ejercicios:[{nombre:"Estiramientos + respiración",tiempo:300}]}
];
let bloqueIndex=0,ejercicioIndex=0,vueltaActual=1,tiempoRestante=0,intervalo=null,pausado=false,iniciado=false;
const $=id=>document.getElementById(id);
const totalEjercicios=entrenamiento.reduce((n,b)=>n+b.ejercicios.length*b.vueltas,0);
const totalSegundos=entrenamiento.reduce((n,b)=>n+b.ejercicios.reduce((m,e)=>m+(e.tiempo||0),0)*b.vueltas,0);
function current(){return entrenamiento[bloqueIndex]?.ejercicios[ejercicioIndex]}
function poseFor(name){let n=name.toLowerCase();if(/jumping|jacks/.test(n))return"jump";if(/skipping|comba|mountain climber/.test(n))return"run";if(/sentadilla|zancada/.test(n))return"squat";if(/plancha|hollow/.test(n))return"plank";if(/remo|elevaciones|flexiones|superman/.test(n))return"row";if(/estir|círculos|rotaciones/.test(n))return"stretch";return"idle"}
function countDone(){let n=0;for(let i=0;i<bloqueIndex;i++)n+=entrenamiento[i].ejercicios.length*entrenamiento[i].vueltas;n+=(vueltaActual-1)*entrenamiento[bloqueIndex].ejercicios.length+ejercicioIndex;return n}
function render(){
 const b=entrenamiento[bloqueIndex],e=current();$("block-number").textContent=`BLOQUE ${bloqueIndex+1} · ${b.nombre.toUpperCase()}`;$("vuelta").textContent=`Vuelta ${vueltaActual} de ${b.vueltas}`;$("ejercicio").textContent=e.nombre;
 $("hint").textContent=e.tiempo?"Mantén un ritmo constante y controla la respiración.":"Completa las repeticiones indicadas y pulsa siguiente.";
 $("tiempo").textContent=e.tiempo?format(tiempoRestante):"REPS";$("timer-caption").textContent=e.tiempo?"TIEMPO RESTANTE":"A TU RITMO";
 $("state-label").textContent=pausado?"EN PAUSA":e.tiempo?"EN MOVIMIENTO":"REPETICIONES";$("figure").setAttribute("class",`figure pose-${poseFor(e.nombre)}`);
 const done=countDone();$("progress-text").textContent=`${b.nombre.toUpperCase()}`;$("progress-count").textContent=`${done+1} / ${totalEjercicios}`;$("progress-bar").style.width=`${done/totalEjercicios*100}%`;
 const pct=e.tiempo?Math.max(0,tiempoRestante/e.tiempo):1;const deg=(1-pct)*360;$("timer-ring").style.background=`conic-gradient(var(--mint) ${deg}deg,#334158 ${deg}deg)`;
 $("next").disabled=false;$("pause").disabled=false;$("status").textContent=pausado?"SESIÓN EN PAUSA":"ENTRENAMIENTO EN CURSO";
}
function format(s){return `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`}
function iniciar(){if(!iniciado){iniciado=true;$("start").disabled=true;$("start").innerHTML="✓ <span>Sesión iniciada</span>";render();}if(pausado){pausado=false;}clearInterval(intervalo);if(current().tiempo)intervalo=setInterval(tick,1000);$("pause").textContent="Ⅱ";render()}
function tick(){if(pausado)return;tiempoRestante=Math.max(0,tiempoRestante-1);if(tiempoRestante<=3&&tiempoRestante>0)beep(700,100);render();if(tiempoRestante===0){beep(1100,220);siguienteEjercicio()}}
function cargar(){clearInterval(intervalo);let e=current();tiempoRestante=e.tiempo||0;render();if(iniciado&&!pausado&&e.tiempo)intervalo=setInterval(tick,1000)}
function siguienteEjercicio(){clearInterval(intervalo);ejercicioIndex++;let b=entrenamiento[bloqueIndex];if(ejercicioIndex>=b.ejercicios.length){ejercicioIndex=0;vueltaActual++;if(vueltaActual>b.vueltas){bloqueIndex++;vueltaActual=1;if(bloqueIndex>=entrenamiento.length){finalizar();return}}}cargar()}
function pausar(){if(!iniciado)return;pausado=!pausado;$("pause").textContent=pausado?"▶":"Ⅱ";clearInterval(intervalo);if(!pausado&&current().tiempo)intervalo=setInterval(tick,1000);render()}
function finalizar(){clearInterval(intervalo);$("block-number").textContent="ENTRENAMIENTO COMPLETADO";$("vuelta").textContent="";$("ejercicio").textContent="¡Sesión completada!";$("hint").textContent="Buen trabajo. Has terminado tu rutina."; $("tiempo").textContent="✓";$("timer-caption").textContent="OBJETIVO CUMPLIDO";$("state-label").textContent="COMPLETADO";$("figure").className="figure pose-stretch";$("progress-bar").style.width="100%";$("progress-count").textContent=`${totalEjercicios} / ${totalEjercicios}`;$("status").textContent="SESIÓN COMPLETADA";$("pause").disabled=true;$("next").disabled=true;$("start").disabled=false;$("start").innerHTML="↻ <span>Volver a empezar</span>";$("start").onclick=()=>location.reload()}
function beep(freq,duration){try{let ctx=new(window.AudioContext||window.webkitAudioContext)(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);osc.frequency.value=freq;gain.gain.setValueAtTime(.35,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration/1000);osc.start();osc.stop(ctx.currentTime+duration/1000);osc.onended=()=>ctx.close()}catch(e){}}
$("start").onclick=iniciar;$("next").onclick=()=>{if(iniciado)siguienteEjercicio()};$("pause").onclick=pausar;
$("pause").disabled=true;$("next").disabled=true;$("progress-count").textContent=`0 / ${totalEjercicios}`;
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
