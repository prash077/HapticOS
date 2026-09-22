'use strict';
const $ = (selector) => document.querySelector(selector);
const modes = {
 alerts: ['01 / IMPORTANT ALERTS', 'Know what matters.', 'Tap a sample event to explore its vibration pattern.'],
 navigation: ['02 / WALKING GUIDANCE', 'Follow the feeling.', 'Try distinct rhythms for each turn on a sample walk.'],
 finder: ['03 / OBJECT FINDER', 'Find it through touch.', 'Pan toward a visible bottle and watch the cue change.']
};
let mode = 'alerts';
let routeStep = 0;
let angle = 10;
let targetVisible = true;
let currentSignal = null;
let animationTimer;
const samples = [
 { source:'SHOPPING', time:'Now', title:'A sale can wait.', message:'Today only: 20% off selected items.', status:'No priority cue', pattern:'Quiet', rhythm:[], detail:'A promotional message stays quiet in this example. It does not interrupt the current task.', reasoning:'Routine information can wait.', why:'The planned app will use available notification text and your rules to decide which messages deserve attention.' },
 { source:'MESSAGES', time:'Now', title:'Your ride has arrived.', message:'I’m at the pickup point. Can you come outside?', status:'Check your phone', pattern:'Two short pulses', rhythm:[24,24], detail:'Two short pulses prompt you to check a time sensitive message. The vibration signals its category, not its full text.', reasoning:'A useful cue, without reading aloud.', why:'This is a scripted example of a priority decision. No AI model is running in this prototype.' },
 { source:'PHONE', time:'Incoming', title:'An incoming call.', message:'A distinct rhythm for a supported call event.', status:'Call attention', pattern:'One sustained pulse', rhythm:[72], detail:'A longer pulse distinguishes the incoming call from a message. It does not claim to know why someone is calling.', reasoning:'Recognise the event by its rhythm.', why:'Actual call support will depend on Android permissions and the integration tested during the build.' }
];
const route = [
 {title:'Start your walk',instruction:'Head toward the next junction.',signal:'Walking route ready',pattern:'No turn cue yet',rhythm:[], x:95,y:210},
 {title:'Turn right',instruction:'At the junction, follow the path right.',signal:'Right turn',pattern:'Two short pulses',rhythm:[24,24], x:95,y:125},
 {title:'Turn left',instruction:'Turn left onto the path toward the café.',signal:'Left turn',pattern:'Three short pulses',rhythm:[24,24,24], x:255,y:125},
 {title:'You’ve arrived',instruction:'Your sample route ends at the café.',signal:'Destination reached',pattern:'One sustained pulse',rhythm:[72], x:255,y:55}
];
function waveform(rhythm) {
 return Array.from({length:37},(_,i)=>{
 const total = rhythm.reduce((sum, duration) => sum + duration + 20, 0);
 const position = (i / 36) * total;
 let cursor = 10;
 let height = 5;
 for (const duration of rhythm) {
  if (position >= cursor && position <= cursor + duration) height = 24 + Math.sin(((position - cursor) / duration) * Math.PI) * 38;
  cursor += duration + 20;
 }
 return `<span style="--i:${i};--height:${height}px"></span>`;
 }).join('');
}
function signalPanel() {return `<section class="output" aria-label="Visual haptic preview"><div class="output-top"><span>HAPTIC PREVIEW</span><span>VISUAL ONLY</span></div><div class="output-main"><p class="eyebrow">SIGNAL MEANING</p><div id="signal-status" class="signal-status"></div><div class="wave" id="wave" aria-hidden="true"></div><h3 id="signal-pattern"></h3><p id="signal-detail"></p></div><div class="output-bottom"><span>Illustrative patterns</span><button class="replay" id="replay">↻ Replay</button></div></section>`;}
function setSignal(status,pattern,rhythm,detail,animate=true){
 currentSignal={status,pattern,rhythm,detail};
 $('#signal-status').textContent=status;$('#signal-pattern').textContent=pattern;$('#signal-detail').textContent=detail;
 const wave=$('#wave'); wave.innerHTML=waveform(rhythm);wave.className='wave '+(rhythm.length?(animate?'playing':'rest'):'');
 $('#replay').disabled=!rhythm.length;
 clearTimeout(animationTimer);if(animate&&rhythm.length)animationTimer=setTimeout(()=>wave.classList.replace('playing','rest'),2400);
 $('#announcement').textContent=status+'. '+pattern;
}
function bindReplay(){$('#replay').addEventListener('click',()=>{const s=currentSignal;setSignal(s.status,s.pattern,s.rhythm,s.detail);});}
function explanation(title,copy){return `<details class="explanation"><summary>${title}</summary><p>${copy}</p></details>`;}
function renderAlerts(){
 $('#view').innerHTML=`<div class="demo-grid"><section><div class="section-top"><h3>Choose a moment</h3><span class="step-label">3 sample events</span></div>${samples.map((s,i)=>`<button class="sample" data-sample="${i}" aria-pressed="false"><span class="sample-top"><span>${s.source}</span><span>${s.time}</span></span><strong>${s.title}</strong><p>${s.message}</p></button>`).join('')}<div id="reasoning"></div></section>${signalPanel()}</div>`;
 function choose(i,animate=true){const s=samples[i];document.querySelectorAll('[data-sample]').forEach(b=>{const chosen=Number(b.dataset.sample)===i;b.classList.toggle('selected',chosen);b.setAttribute('aria-pressed',String(chosen));});setSignal(s.status,s.pattern,s.rhythm,s.detail,animate);$('#reasoning').innerHTML=explanation(s.reasoning,s.why);}
 document.querySelectorAll('[data-sample]').forEach(b=>b.addEventListener('click',()=>choose(Number(b.dataset.sample))));bindReplay();choose(1,false);
}
function renderNavigation(){
 routeStep=0;
 $('#view').innerHTML=`<div class="demo-grid"><section><div class="section-top"><h3>A walk to the café</h3><span class="step-label">Sample route</span></div><div class="map"><span class="map-tag">ROUTE SIMULATION</span><svg viewBox="0 0 360 260" role="img" aria-label="Illustrative walking route with two turns"><path d="M0 55H360M0 125H360M0 210H360M95 0V260M255 0V260" fill="none" stroke="#fff" stroke-width="24"/><path d="M95 210V125H255V55" fill="none" stroke="#1d2818" stroke-width="4" stroke-linejoin="round" stroke-dasharray="6 5"/><circle cx="255" cy="55" r="7" fill="#121514"/><text x="271" y="60" font-size="13" fill="#121514">Café</text><circle id="position" cx="95" cy="210" r="9" fill="#d8fc65" stroke="#121514" stroke-width="3"/><text x="111" y="230" font-size="12" fill="#626963">Start</text></svg></div><div class="route-detail"><div><strong id="route-title"></strong><br><small id="route-instruction"></small></div><span class="step-label" id="route-count"></span></div><div class="progress" aria-hidden="true">${route.map(()=>'<span></span>').join('')}</div><div class="actions"><button class="primary" id="next-step">Next step →</button><button class="secondary" id="reset-route">Restart</button></div>${explanation('A rhythm means a direction.','The phone does not physically vibrate to the left or right. Users learn different rhythms for each turn. This demo does not provide real navigation.')}</section>${signalPanel()}</div>`;
 function update(){const s=route[routeStep];$('#route-title').textContent=s.title;$('#route-instruction').textContent=s.instruction;$('#route-count').textContent=`${routeStep+1} / 4`;$('#position').setAttribute('cx',s.x);$('#position').setAttribute('cy',s.y);document.querySelectorAll('.progress span').forEach((e,i)=>e.classList.toggle('done',i<=routeStep));$('#next-step').disabled=routeStep===3;$('#next-step').textContent=routeStep===3?'Walk complete':'Next step →';$('#reset-route').disabled=routeStep===0;setSignal(s.signal,s.pattern,s.rhythm,'Sample route events trigger the visual cue. In the Android app, route and location data would supply these events.');}
 $('#next-step').addEventListener('click',()=>{routeStep=Math.min(3,routeStep+1);update();});$('#reset-route').addEventListener('click',()=>{routeStep=0;update();});bindReplay();update();
}
function renderFinder(){
 angle=10;targetVisible=true;
 $('#view').innerHTML=`<div class="demo-grid"><section><div class="section-top"><h3>Find a bottle</h3><span class="step-label">Simulated camera field</span></div><div class="finder-field" role="img" aria-label="Simulated camera alignment diagram"><span class="field-label">TARGET: BOTTLE</span><div class="crosshair"></div><div class="target" id="target"><span>Bottle</span></div><span class="field-note" id="field-note">Move the target into the centre circle</span></div><div class="range-row"><label for="aim"><span>Pan the simulated camera</span><span id="alignment">Searching</span></label><input id="aim" type="range" min="0" max="100" value="10"><div class="range-ends"><span>Left</span><span>Centre</span><span>Right</span></div></div><div class="actions"><button class="primary" id="centre-target">Centre the bottle</button><button class="secondary" id="hide-target">Hide target</button></div>${explanation('Only what the camera can see.','A hidden bottle under a bed cannot be detected. Cues describe camera alignment, not distance or a safe path to the object.')}</section>${signalPanel()}</div>`;
 function update(animate=true){const distance=Math.abs(angle-50);$('#target').style.left=`${50+(50-angle)*.65}%`;$('#target').hidden=!targetVisible;$('#hide-target').textContent=targetVisible?'Hide target':'Show target';$('#centre-target').disabled=!targetVisible;$('#aim').disabled=!targetVisible;
 let s;if(!targetVisible)s=['Target lost','Distinct loss cue',[12,40,12],'The target has disappeared from view. The previous alignment cue stops.'];else if(distance<=6)s=['Bottle centred','Steady confirmation',[60],'The bottle is aligned with the centre of the simulated camera view. This does not indicate distance.'];else if(distance<=22)s=['Getting aligned','Quicker pulses',[34,34,34],'The target is moving toward the centre. A changing rhythm helps guide camera orientation.'];else s=['Target off centre','Spaced pulses',[16,16],'The bottle is visible but off centre. Move the slider toward the middle to explore the cue.'];$('#alignment').textContent=!targetVisible?'Not visible':distance<=6?'Centred':distance<=22?'Nearly aligned':'Off centre';$('#field-note').textContent=targetVisible?'Move the target into the centre circle':'Target unavailable in this view';setSignal(...s,animate);}
 $('#aim').addEventListener('input',e=>{angle=Number(e.target.value);update(false);});$('#centre-target').addEventListener('click',()=>{angle=50;$('#aim').value=50;update();});$('#hide-target').addEventListener('click',()=>{targetVisible=!targetVisible;update();});bindReplay();update(false);
}
function navigate(next){mode=Object.hasOwn(modes,next)?next:'alerts';$('#main').scrollTop=0;clearTimeout(animationTimer);const [eyebrow,title,intro]=modes[mode];$('#eyebrow').textContent=eyebrow;$('#title').textContent=title;$('#intro').textContent=intro;document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===mode);if(b.dataset.view===mode)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});({alerts:renderAlerts,navigation:renderNavigation,finder:renderFinder})[mode]();}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{location.hash=b.dataset.view;}));window.addEventListener('hashchange',()=>navigate(location.hash.slice(1)));
$('#about').addEventListener('click',()=>$('#about-dialog').showModal());$('#close-about').addEventListener('click',()=>$('#about-dialog').close());$('#return-demo').addEventListener('click',()=>$('#about-dialog').close());
navigate(location.hash.slice(1));
