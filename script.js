const workout=[
 {name:'Activación + movilidad',rounds:1,items:[
  ['Skipping suave',120,1,'Eleva las rodillas alternas con suavidad y mantén el tronco erguido.'],
  ['Jumping jacks',30,2,'Abre y cierra brazos y piernas de forma coordinada.'],
  ['Círculos hombros + cadera',0,3,'Realiza círculos amplios y controlados, sin forzar el rango.'],
  ['Rotaciones torácicas',0,4,'Gira el tronco suavemente manteniendo estable la pelvis.'],
  ['Sentadillas lentas',0,5,'Lleva la cadera atrás y baja manteniendo las rodillas alineadas.'],
  ['Plancha frontal',30,6,'Mantén el cuerpo alineado y el abdomen activo.'],
  ['Plancha lateral izquierda',30,7,'Apoya el antebrazo izquierdo y mantén la cadera elevada.'],
  ['Plancha lateral derecha',30,8,'Apoya el antebrazo derecho y mantén la cadera elevada.'] ]},
 {name:'Bloque aeróbico continuo',rounds:3,items:[
  ['Comba / Skipping',60,9,'Salta de forma ligera y mantén un ritmo constante.'],
  ['Sentadillas aire (20)',0,5,'Completa 20 repeticiones con control.'],
  ['Flexiones (15)',0,10,'Mantén el cuerpo alineado durante las 15 repeticiones.'],
  ['Mountain climbers',60,11,'Lleva las rodillas alternas hacia el pecho sin elevar demasiado la cadera.'],
  ['Zancadas (20)',0,12,'Alterna las piernas y controla la bajada.'],
  ['Jumping jacks',60,2,'Mantén un ritmo regular y aterriza suavemente.'] ]},
 {name:'Bloque específico nadador',rounds:3,items:[
  ['Plancha antebrazos',30,13,'Apoya los antebrazos y mantén cabeza, espalda y cadera alineadas.'],
  ['Superman (20)',0,14,'Eleva suavemente brazos y piernas sin forzar la zona lumbar.'],
  ['Elevaciones hombro banda (20)',0,15,'Eleva los brazos con control manteniendo tensión en la banda.'],
  ['Remo con banda (15/15)',0,16,'Lleva los codos atrás y junta suavemente las escápulas.'],
  ['Hollow body hold',30,17,'Mantén el abdomen firme y la zona lumbar apoyada.'] ]},
 {name:'Vuelta a la calma',rounds:1,items:[['Estiramientos + respiración',300,18,'Estira sin rebotes y acompaña con respiraciones lentas.']]}
];
let bi=0,ei=0,round=1,remaining=0,interval=null,running=false,paused=false,started=false,startedAt=0,totalElapsed=0;
const $=id=>document.getElementById(id);const all=()=>workout.reduce((a,b)=>a+b.items.length*b.rounds,0);
const flat=[];workout.forEach((b,bx)=>{for(let r=1;r<=b.rounds;r++)b.items.forEach((it,ix)=>flat.push({bx,r,ix,it}))});
function current(){return workout[bi].items[ei]}
function globalIndex(){let n=0;for(let b=0;b<bi;b++)n+=workout[b].items.length*workout[b].rounds;n+=(round-1)*workout[bi].items.length+ei;return n}
function fmt(s){return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`}
function render(){const b=workout[bi],it=current(),idx=globalIndex(),total=all();$('blockName').textContent=b.name;$('roundLabel').textContent=`Vuelta ${round} de ${b.rounds}`;$('exerciseName').textContent=it[0];$('exerciseHint').textContent=it[3];$('exerciseNumber').textContent=`EJERCICIO ${idx+1} DE ${total}`;$('exerciseKind').textContent=it[1]?'TIEMPO':'REPETICIONES';$('exerciseImage').src=`assets/ex-${String(it[2]).padStart(2,'0')}.webp`;$('exerciseImage').alt=`Demostración ilustrada: ${it[0]}`;$('visualCaption').textContent=it[0];$('time').textContent=it[1]?fmt(remaining||it[1]):'REPS';$('timerLabel').textContent=it[1]?'RESTANTE':'SIGUIENTE';$('progressText').textContent=it[1]?(running?'Entrenamiento en curso':'Listo para empezar'):'Completa las repeticiones y pulsa siguiente';let nxt=flat[idx+1];$('nextText').textContent=nxt?`Siguiente: ${nxt.it[0]}`:'Último ejercicio';$('progressBar').style.width=`${idx/total*100}%`;updateRing(it[1]?remaining/it[1]:1);$('start').disabled=running;$('pause').disabled=!running;$('pause').textContent=paused?'▶ Reanudar':'Ⅱ Pausa';$('blockList').innerHTML=workout.map((x,i)=>`<div class="block-item ${i===bi?'active':''}"><span class="block-number">${i+1}</span><div><b>${x.name}</b><small>${x.items.length} ejercicios · ${x.rounds} ${x.rounds===1?'vuelta':'vueltas'}</small></div></div>`).join('');$('exerciseStrip').innerHTML=flat.slice(Math.max(0,idx-2),Math.min(total,idx+10)).map((x,j)=>`<div class="strip-card ${x.bx===bi&&x.ix===ei&&x.r===round?'current':''}"><img loading="lazy" src="assets/ex-${String(x.it[2]).padStart(2,'0')}.webp" alt=""><div>${x.it[0]}<small>Bloque ${x.bx+1} · vuelta ${x.r}</small></div></div>`).join('')}
function updateRing(r){let deg=Math.max(0,Math.min(1,r))*360;$('timerRing').style.background=`conic-gradient(var(--cyan) ${deg}deg,#23436d ${deg}deg)`}
function start(){if(!started){started=true;remaining=current()[1]||0}running=true;paused=false;if(current()[1]&& !interval)interval=setInterval(tick,1000);render()}
function tick(){if(!running||paused)return;remaining=Math.max(0,remaining-1);$('time').textContent=fmt(remaining);updateRing(remaining/current()[1]);if(remaining<=3&&remaining>0)beep(750,100);if(remaining===0){beep(1100,260);next()}}
function next(){const continueSession=running&&!paused;clearInterval(interval);interval=null;let b=workout[bi];ei++;if(ei>=b.items.length){ei=0;round++;if(round>b.rounds){bi++;round=1;if(bi>=workout.length){finish();return}}}remaining=current()[1]||0;started=continueSession;running=continueSession;paused=false;if(continueSession&&current()[1])interval=setInterval(tick,1000);render()}
function pause(){if(!running)return;paused=!paused;render()}
function reset(){clearInterval(interval);interval=null;bi=0;ei=0;round=1;remaining=0;running=false;paused=false;started=false;render()}
function finish(){clearInterval(interval);interval=null;running=false;$('blockName').textContent='¡Sesión completada!';$('exerciseName').textContent='Buen trabajo';$('exerciseHint').textContent='Has terminado todos los bloques de tu rutina.';$('time').textContent='✓';$('timerLabel').textContent='COMPLETADO';$('progressBar').style.width='100%';updateRing(1);$('start').disabled=true;$('pause').disabled=true;beep(1200,350)}
function beep(f,d){try{let c=new(window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=f;g.gain.setValueAtTime(.15,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d/1000);o.start();o.stop(c.currentTime+d/1000);o.onended=()=>c.close()}catch(e){}}
$('start').addEventListener('click',start);$('next').addEventListener('click',next);$('pause').addEventListener('click',pause);$('reset').addEventListener('click',reset);render();
let installPrompt;$('installBtn').addEventListener('click',async()=>{if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('installBtn').classList.add('hidden')}});window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('installBtn').classList.remove('hidden')});if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
