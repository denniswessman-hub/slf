import { STEPS, RESULTS, REASONS, SOURCES, FAQ, REVIEWED, nextStep } from './data.js';

const icons = {
  route:'<path d="M7 5h8a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h8"/><circle cx="6" cy="5" r="2"/><path d="m14 18 3 3-3 3"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 2-2.5 2-2.5 4M12 17h.01"/>',
  book:'<path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Zm0 0v14"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/>',
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  back:'<path d="M20 12H4m6-6-6 6 6 6"/>',
  external:'<path d="M13 4h7v7m0-7L10 14M9 4H4v16h16v-5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  pen:'<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14Zm0 0 5-1"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-14 4h3m4 0h3"/>',
  file:'<path d="M13 3H5v18h14V9Zm0 0v6h6M8 13h8m-8 4h6"/>',
  phonecall:'<path d="m8 3 2 5-3 2c2 4 3 5 7 7l2-3 5 2c0 4-2 6-5 5C9 19 5 15 3 8 2 5 4 3 8 3Zm7 0a7 7 0 0 1 6 6m-6-2a3 3 0 0 1 2 2"/>',
  phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 18h4"/>',
  reset:'<path d="M3 10a9 9 0 1 1 1 8M3 4v6h6"/>',
  print:'<path d="M7 8V3h10v5M7 17H3V8h18v9h-4M7 14h10v7H7Zm10-3h1"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
  shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Zm-4 9 3 3 5-6"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.info}</svg>`;
const main = document.querySelector('#main');
const labels = {guide:'Vägledning',overview:'Snabböversikt',faq:'Frågor & svar',sources:'Källor & fördjupning'};
let active = 'guide';
let current = null;
let reason = null;
let history = [];
let checked = new Set();
let overview = 'fg';
let installEvent;
let toastTimer;
document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });

const sourceLinks = ids => `<div class="source-links">${ids.map(id=>`<a href="${SOURCES[id].url}" target="_blank" rel="noopener noreferrer">${SOURCES[id].label}${icon('external')}</a>`).join('')}</div>`;
const pageHeading = (tag,title,text) => `<div class="page-heading"><span class="eyebrow">${tag}</span><h1 tabindex="-1">${title}</h1><p>${text}</p></div>`;
const note = (text, title='Bra att ha med sig') => `<div class="note">${icon('info')}<div><b>${title}</b><p>${text}</p></div></div>`;
const routeCards = () => `<div class="route-cards">${['fg','tgdResult','ordinary'].map(id=>{const r=RESULTS[id];return `<button class="route-card ${r.tone}" data-overview="${id}"><span class="card-top"><span class="route-icon">${icon(r.icon)}</span><span class="route-code">SPÅR ${r.code}</span></span><h3>${r.label}</h3><p>${r.short}</p><span class="card-bottom">Se momenten ${icon('arrow')}</span></button>`;}).join('')}</div>`;

function home() {
  return `<section class="home-hero"><div class="hero-copy"><span class="eyebrow"><span class="small-line"></span> FRÅN INGRIPANDE TILL NÄSTA STEG</span><h1 tabindex="-1">Rätt väg.<br><span>Ett steg i taget.</span></h1><p>Förhandsgodkännande, tillgänglighetsdelgivning eller ordinarie handläggning?<br>Vi tar det i rätt ordning.</p><button class="button primary" data-action="start">Starta vägledning ${icon('arrow')}</button><div class="hero-meta"><span>${icon('clock')} Cirka 1 minut</span><span>${icon('lock')} Inga personuppgifter</span></div></div><div class="hero-map" aria-label="Guiden går från förutsättningar via FU-beslut till en checklista"><div class="map-heading"><span class="status-dot"></span> EN TYDLIG VÄG FRAMÅT<span>01—03</span></div><div class="map-route"><div class="map-node"><span class="map-number">01</span><div><small>BÖRJA HÄR</small><b>Kontrollera läget</b><span>Personen · brottet · utredningen</span></div>${icon('check')}</div><div class="map-node"><span class="map-number">02</span><div><small>STÄM AV</small><b>Välj rätt spår</b><span>Med stöd av JB / FU-ledare</span></div>${icon('route')}</div><div class="map-node active-node"><span class="map-number">03</span><div><small>GÅ VIDARE</small><b>Få din checklista</b><span>Konkreta moment, i rätt ordning</span></div>${icon('arrow')}</div></div><div class="map-foot">Mindre att hålla i huvudet. Mer överblick.</div></div></section><section class="home-paths"><div class="section-heading"><div><span class="eyebrow">ÖVERBLICK</span><h2>Tre vägar. Samma noggrannhet.</h2></div><a class="text-link" href="#overview">Jämför spåren ${icon('arrow')}</a></div>${routeCards()}</section><div class="bottom-tip">${icon('file')}<p><b>Durtvå följer med i alla spår.</b> SLF ändrar handläggningen – anmälan och dokumentationen behövs fortfarande.</p><a href="#faq" aria-label="Läs mer om Durtvå">${icon('arrow')}</a></div>`;
}

function stepper(stage) {
  return `<ol class="stepper" aria-label="Guidens delar">${['Förutsättningar','Vägval & beslut','Din checklista'].map((label,i)=>`<li class="${i===stage?'current':i<stage?'complete':''}" ${i===stage?'aria-current="step"':''}><span>${i<stage?icon('check'):i+1}</span>${label}</li>`).join('')}</ol>`;
}

function question() {
  const s=STEPS[current];
  return `<div class="flow-toolbar"><button class="text-button" data-action="back">${icon('back')} Tillbaka</button><button class="text-button" data-action="reset">${icon('reset')} Börja om</button></div>${stepper(s.stage)}<div class="wizard-layout"><section class="question-card"><div class="question-top"><span class="eyebrow">FRÅGA ${String(history.length+1).padStart(2,'0')}</span><span class="mini-label">${s.stage===0?'Kontrollera läget':'Stäm av och välj väg'}</span></div><h1 tabindex="-1">${s.title}</h1><p class="question-lead">${s.lead}</p><div class="options">${s.options.map((o,i)=>`<button class="option" data-answer="${i}"><span class="option-radio"></span><span><b>${o.label}</b><small>${o.hint}</small></span>${icon('arrow')}</button>`).join('')}</div><details class="help-details"><summary>${icon('help')} Varför frågar vi detta?<span>+</span></summary><div><p>${s.help}</p>${sourceLinks(s.sources)}</div></details></section><aside class="flow-aside"><span class="eyebrow">DIN VÄG HITTILLS</span>${history.length?`<ol class="answer-trail">${history.map((h,i)=>`<li><span>${icon('check')}</span><button data-edit="${i}" title="Ändra svar"><small>${STEPS[h.id].title}</small><b>${STEPS[h.id].options[h.option].label}</b></button></li>`).join('')}</ol>`:`<p>Här samlas dina vägval.<br>Du kan alltid gå tillbaka.</p>`}<div class="aside-tip">${icon('compass')}<p>Osäker? Välj det.<br>Guiden hjälper dig att hitta vad som behöver stämmas av.</p></div></aside></div>`;
}

function checklist(r, interactive=true) {
  return `<div class="checklist">${r.checklist.map(([title,text],i)=>interactive?`<label class="check-row ${checked.has(i)?'is-checked':''}"><input type="checkbox" data-check="${i}" ${checked.has(i)?'checked':''}><span class="check-box">${icon('check')}</span><span><b>${title}</b><small>${text}</small></span></label>`:`<div class="check-row read-only"><span class="list-number">${i+1}</span><span><b>${title}</b><small>${text}</small></span></div>`).join('')}</div>`;
}

function result() {
  const r=RESULTS[current];
  return `<div class="flow-toolbar"><button class="text-button" data-action="back">${icon('back')} Ändra senaste svar</button><div class="toolbar-actions"><button class="text-button" data-action="print">${icon('print')} Skriv ut</button><button class="text-button" data-action="reset">${icon('reset')} Ny vägledning</button></div></div>${stepper(2)}<div class="result-heading ${r.tone}"><div class="result-symbol">${icon(r.icon)}</div><div><span class="eyebrow">${current==='consult'?'NÄSTA STEG':'SPÅR '+r.code+' · UTIFRÅN DINA SVAR'}</span><h1 tabindex="-1">${r.title}</h1><p>${r.intro}</p></div></div>${reason?note(REASONS[reason],'Ditt vägval'):''}<div class="result-layout"><section class="checklist-card"><div class="section-heading"><h2>${current==='consult'?'Inför avstämningen':'Gör så här'}</h2><span class="check-count" id="check-count">${checked.size} av ${r.checklist.length} markerade</span></div><div class="check-progress"><span id="check-progress" style="width:${checked.size/r.checklist.length*100}%"></span></div>${checklist(r)}<p class="completion-text" id="completion-text" role="status">${checked.size===r.checklist.length?'Checklistan är genomgången. Avrapportera och stäm av enligt direktiven.':'Bocka av som minnesstöd. Markeringarna sparas inte när sidan laddas om.'}</p></section><aside class="result-aside">${note(r.note,current==='consult'?'Fortsätt efter besked':'Kom ihåg')}<details class="help-details"><summary>${icon('book')} Rättsligt stöd<span>+</span></summary><div>${sourceLinks(r.sources)}</div></details></aside></div><details class="help-details decision-history"><summary>${icon('route')} Visa mina vägval (${history.length})<span>+</span></summary><div><ol>${history.map(h=>`<li><b>${STEPS[h.id].title}</b><br>${STEPS[h.id].options[h.option].label}</li>`).join('')}</ol></div></details>`;
}

function overviewPage() {
  const r=RESULTS[overview];
  return `${pageHeading('SNABBÖVERSIKT','Ha koll på skillnaden.','Öppna ett spår för att se momenten. Använd vägledningen för att bedöma förutsättningarna.')}<div class="route-tabs" role="group" aria-label="Välj spår">${['fg','tgdResult','ordinary'].map(id=>`<button class="${id===overview?'selected':''}" aria-pressed="${id===overview}" data-tab="${id}"><span>${RESULTS[id].code}</span>${RESULTS[id].label}</button>`).join('')}</div><section class="overview-panel"><div class="overview-title ${r.tone}"><span class="route-icon">${icon(r.icon)}</span><div><span class="eyebrow">SPÅR ${r.code}</span><h2>${r.label}</h2></div></div>${checklist(r,false)}${note(r.note)}<details class="help-details"><summary>${icon('book')} Rättsligt stöd<span>+</span></summary><div>${sourceLinks(r.sources)}</div></details></section><div class="overview-cta"><p><b>Vilket spår passar?</b> Låt vägledningen ta dig igenom frågorna.</p><button class="button primary" data-action="guide">Öppna vägledningen ${icon('arrow')}</button></div>`;
}

function faqPage() {
  return `${pageHeading('FRÅGOR & SVAR','Det du undrar. Kort förklarat.','Vanliga situationer som lätt skapar osäkerhet.')}<div class="faq-list">${FAQ.map(([q,a,s],i)=>`<details><summary><span class="faq-number">${String(i+1).padStart(2,'0')}</span><h2>${q}</h2><span class="plus">+</span></summary><div class="faq-content"><p>${a}</p>${sourceLinks(s)}</div></details>`).join('')}</div>`;
}

function sourcesPage() {
  return `${pageHeading('KÄLLOR & FÖRDJUPNING','Läs vidare när du behöver.','Korta steg i guiden. Rättskällor och kursmaterial ett klick bort.')}<div class="review-banner">${icon('shield')}<div><b>Källkontrollerad 12 november 2026</b><p>Lagtext går före äldre utbildningsmaterial. Lokala rutiner och blanketter behöver alltid kontrolleras i tjänsten.</p></div></div><div class="source-grid">${Object.entries(SOURCES).map(([id,s])=>`<a class="source-card" href="${s.url}" target="_blank" rel="noopener noreferrer"><span class="eyebrow">${id==='canvas'?'KURSMATERIAL · INLOGGNING':id==='rb'||id==='sfk'||id==='dl'?'LAG & FÖRORDNING':'MYNDIGHETSKÄLLA'}</span><h2>${s.label} ${icon('external')}</h2><p>${s.note}</p></a>`).join('')}</div><section class="about-box"><h2>Om SLF</h2><p>Ett fristående studiestöd för polisstudenter och repetition. Bygger på kursens frågeställningar och offentliga rättskällor. Appen ersätter inte behöriga beslut eller polisens aktuella metodstöd.</p><p><b>Inga ärendeuppgifter.</b> Dina val finns bara i minnet under besöket. Ingen inloggning, analysmätning eller överföring av svar. GitHub Pages hanterar vanliga webbserveranrop; externa källor öppnas hos respektive utgivare.</p><details class="help-details"><summary>Avgränsning & alternativ till guidens huvudflöde<span>+</span></summary><div><p>Guiden avser ett typiskt ingripande med en vuxen misstänkt. TGD kan användas utanför SLF och för fler mottagare eller handlingar än dem som behandlas här. Förhandsgodkännande och TGD-information kan också kombineras efter FU-ledarens bedömning. Ordningsbot och andra särskilda förfaranden ligger utanför guidens omfattning.</p><p>Canvas-FAQ:n är daterad september 2023. Uppgiften om kopia av förhandsgodkännande har förtydligats med 6 § strafföreläggandekungörelsen. Appen återpublicerar inte kursens dokument eller personuppgifter från övningsdomen.</p></div></details><div class="about-actions"><a class="text-link" href="https://github.com/denniswessman-hub/slf" target="_blank" rel="noopener noreferrer">Källkod på GitHub ${icon('external')}</a><button class="text-button" data-action="update">${icon('reset')} Sök efter appuppdatering</button></div><p class="muted tiny">Version 1.0.0 · Källgranskning ${REVIEWED} · En appuppdatering är inte en automatisk kontroll av lagändringar.</p></section>`;
}

function render(focus=false) {
  document.querySelectorAll('[data-nav]').forEach(a=>{const match=a.dataset.nav===active;a.classList.toggle('active',match);if(match)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  document.querySelector('#page-label').textContent=labels[active];
  main.innerHTML=active==='guide'?(current?(STEPS[current]?question():result()):home()):active==='overview'?overviewPage():active==='faq'?faqPage():sourcesPage();
  // All content above is from the fixed, reviewed data module, never user input.
  if(focus){window.scrollTo({top:0,behavior:'instant'});main.querySelector('h1')?.focus({preventScroll:true});}
}
function navigate(page){ if(location.hash==='#'+page){active=page;render(true);}else location.hash=page; }
function start(){current='age';reason=null;history=[];checked.clear();render(true);}
function back(){const last=history.pop();current=last?.id||null;reason=null;checked.clear();render(true);}
function notify(message){const t=document.querySelector('#toast');clearTimeout(toastTimer);t.textContent=message;t.hidden=false;toastTimer=setTimeout(()=>{t.hidden=true;},5000);}

main.addEventListener('click', async event=>{
  const target=event.target.closest('button'); if(!target)return;
  if(target.dataset.answer!==undefined){const option=Number(target.dataset.answer);const next=nextStep(current,option);history.push({id:current,option});current=next.id;reason=next.reason;checked.clear();render(true);return;}
  if(target.dataset.edit!==undefined){const idx=Number(target.dataset.edit);current=history[idx].id;history=history.slice(0,idx);reason=null;checked.clear();render(true);return;}
  if(target.dataset.overview){overview=target.dataset.overview;navigate('overview');return;}
  if(target.dataset.tab){overview=target.dataset.tab;render();main.querySelector(`[data-tab="${overview}"]`)?.focus();return;}
  switch(target.dataset.action){
    case 'start':start();break;
    case 'back':back();break;
    case 'guide':navigate('guide');break;
    case 'reset':current=null;reason=null;history=[];checked.clear();render(true);break;
    case 'print':window.print();break;
    case 'update':{
      if(!navigator.onLine){notify('Du är offline. Anslut till internet för att söka efter uppdateringar.');break;}
      try{const registration=await navigator.serviceWorker?.getRegistration();if(registration){await registration.update();notify('Kontrollen är klar. Ladda om sidan för att hämta senaste appversionen. Dina markeringar nollställs då.');}else notify('Ladda om sidan för att hämta senaste appversionen.');}catch{notify('Kunde inte kontrollera uppdateringar. Försök igen med internetanslutning.');}
      break;
    }
  }
});
main.addEventListener('change',event=>{
  const box=event.target;if(!box.matches('[data-check]'))return;
  const idx=Number(box.dataset.check);box.checked?checked.add(idx):checked.delete(idx);box.closest('.check-row').classList.toggle('is-checked',box.checked);
  const total=RESULTS[current].checklist.length;
  document.querySelector('#check-count').textContent=`${checked.size} av ${total} markerade`;
  document.querySelector('#check-progress').style.width=`${checked.size/total*100}%`;
  document.querySelector('#completion-text').textContent=checked.size===total?'Checklistan är genomgången. Avrapportera och stäm av enligt direktiven.':'Bocka av som minnesstöd. Markeringarna sparas inte när sidan laddas om.';
});
function readRoute(){active=Object.hasOwn(labels,location.hash.slice(1))?location.hash.slice(1):'guide';render(true);}
window.addEventListener('hashchange',readRoute);
document.querySelector('#install-button').addEventListener('click',()=>document.querySelector('#install-dialog').showModal());
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installEvent=event;document.querySelector('#native-install').hidden=false;});
document.querySelector('#native-install').addEventListener('click',async()=>{if(!installEvent)return;await installEvent.prompt();installEvent=null;document.querySelector('#native-install').hidden=true;});
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
active=Object.hasOwn(labels,location.hash.slice(1))?location.hash.slice(1):'guide';render();

