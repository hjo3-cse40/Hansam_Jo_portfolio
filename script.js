'use strict';
const motionMedia=matchMedia('(prefers-reduced-motion: reduce)');
let motionOff=motionMedia.matches;
const revealAll=()=>document.querySelectorAll('.reveal').forEach((el,i)=>setTimeout(()=>el.classList.add('is-visible'),motionOff?0:i*65));
requestAnimationFrame(revealAll);

const sections=[...document.querySelectorAll('[data-section]')];
const sectionObserver=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!visible)return;
  const key=visible.target.dataset.section;
  document.querySelectorAll('[data-section-link]').forEach(link=>link.getAttribute('data-section-link')===key?link.setAttribute('aria-current','location'):link.removeAttribute('aria-current'));
},{rootMargin:'-15% 0px -55% 0px',threshold:[0,.15,.3,.55]});
sections.forEach(sectionObserver.observe.bind(sectionObserver));

const stageLabels={story:['01 / 04','My Story'],career:['02 / 04','Career'],school:['03 / 04','School'],projects:['04 / 04','Projects']};
const stageObserver=new IntersectionObserver(entries=>{const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;const [number,name]=stageLabels[visible.target.dataset.stage];document.getElementById('mobile-progress-number').textContent=number;document.getElementById('mobile-progress-name').textContent=name},{rootMargin:'-18% 0px -55% 0px',threshold:[0,.15,.35]});
document.querySelectorAll('[data-stage]').forEach(stageObserver.observe.bind(stageObserver));

const docs={
  northline:{name:'Northline Studio',date:'14 August 2026',fee:'$4,800 USD',scope:'a workflow review, a working prototype, and one handoff session',timing:'three weeks from kickoff',lines:{fee:'The fixed fee is $4,800 USD.',scope:'The proposal covers a workflow review, a working prototype, and one handoff session.',timing:'Delivery is estimated at three weeks from kickoff.'}},
  cedar:{name:'Cedar Works',date:'17 August 2026',fee:'$6,200 USD',scope:'a discovery workshop, a prototype, and two training sessions',timing:'two weeks after kickoff',tax:'included',lines:{fee:'The project fee is $6,200 USD.',scope:'The proposal includes a discovery workshop, a prototype, and two training sessions.',timing:'Delivery is planned for two weeks after kickoff.',tax:'Applicable taxes are included in the project fee.'}},
  beacon:{name:'Beacon Lab',date:'19 August 2026',fee:'$3,900 USD',scope:'a workflow audit and recommendations report; implementation is not included',timing:'four weeks after kickoff',lines:{fee:'The fixed fee is $3,900 USD.',scope:'The scope includes a workflow audit and a recommendations report; implementation is not included.',timing:'The report will be delivered four weeks after kickoff.',expenses:'Travel expenses are excluded from the fixed fee.'}}
};
const demo=document.querySelector('.airlock-demo'),form=document.getElementById('query-form'),input=document.getElementById('query-input'),answer=document.getElementById('answer-pane'),trace=document.getElementById('trace-status'),run=form.querySelector('button');
function selectDoc(id,citedKind){
  document.querySelectorAll('[role=tab]').forEach(tab=>{const on=tab.dataset.doc===id;tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1});
  document.querySelectorAll('[data-panel]').forEach(panel=>{panel.hidden=panel.dataset.panel!==id;panel.querySelectorAll('[data-kind]').forEach(line=>line.classList.toggle('is-cited',line.dataset.kind===citedKind))});
}
document.querySelectorAll('[role=tab]').forEach(tab=>{
  tab.addEventListener('click',()=>selectDoc(tab.dataset.doc));
  tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();const tabs=[...document.querySelectorAll('[role=tab]')],i=tabs.indexOf(tab),step=['ArrowRight','ArrowDown'].includes(event.key)?1:-1,next=tabs[(i+step+tabs.length)%tabs.length];selectDoc(next.dataset.doc);next.focus()});
});
function classify(query){
  const q=query.toLowerCase();const id=q.includes('northline')?'northline':q.includes('cedar')?'cedar':q.includes('beacon')?'beacon':null;
  if((q.includes('compare')||q.includes('lowest')||q.includes('cheapest'))&&(q.includes('fee')||q.includes('price')||q.includes('quote')||!id))return{type:'supported',title:'Beacon has the lowest listed base fee.',body:'The proposals list Beacon at $3,900, Northline at $4,800, and Cedar at $6,200. Their scopes differ, so this does not establish best value.',quotes:['northline','cedar','beacon'].map(doc=>({doc,kind:'fee',quote:docs[doc].lines.fee})),label:'Supported by 3 sources'};
  if(id){const d=docs[id];if(q.includes('tax')&&!d.tax)return{type:'refused',title:`${d.name}'s proposal does not say whether tax is included.`,body:`I can’t infer it from another vendor’s proposal or from the listed base fee. Try asking what ${d.name} includes instead.`,doc:id,label:'Not supported by the available source'};
    const kind=q.includes('tax')?'tax':q.includes('include')||q.includes('scope')?'scope':q.includes('week')||q.includes('time')||q.includes('deliver')||q.includes('long')?'timing':'fee';
    const title=kind==='tax'?`${d.name}'s proposal states that applicable taxes are included.`:kind==='scope'?`${d.name} includes ${d.scope}.`:kind==='timing'?`${d.name} lists delivery at ${d.timing}.`:`${d.name}'s listed fixed fee is ${d.fee}.`;
    return{type:'supported',title,body:'The answer is limited to the statement in this synthetic proposal.',doc:id,kind,quote:d.lines[kind],label:'Supported by 1 source'};
  }
  return{type:'refused',title:'I can’t support that from these documents.',body:'Try naming Northline, Cedar, or Beacon and asking about a stated fee, scope, delivery time, or tax.',label:'Not supported by the available sources'};
}
function renderResult(result){
  demo.dataset.airlockState=result.type;trace.textContent=result.type==='supported'?'Trace complete · evidence found':'Trace complete · evidence missing';
  const citations=result.quotes||(result.quote?[{doc:result.doc,kind:result.kind,quote:result.quote}]:[]);
  if(result.doc)selectDoc(result.doc,result.kind);
  answer.innerHTML=`<span class="answer-label">${result.label}</span><h3>${result.title}</h3><p>${result.body}</p>${citations.map(item=>`<div class="citation-result"><blockquote>“${item.quote}”</blockquote><button type="button" data-citation="${item.doc}" data-kind="${item.kind}">Inspect ${docs[item.doc].name} source ↗</button></div>`).join('')}`;
  answer.querySelectorAll('[data-citation]').forEach(button=>button.addEventListener('click',event=>{selectDoc(event.currentTarget.dataset.citation,event.currentTarget.dataset.kind);const excerpt=document.querySelector(`[data-panel="${event.currentTarget.dataset.citation}"] [data-kind="${event.currentTarget.dataset.kind}"]`);if(excerpt){excerpt.tabIndex=-1;excerpt.focus({preventScroll:true});excerpt.scrollIntoView({behavior:motionOff?'auto':'smooth',block:'nearest'})}}));
  run.disabled=false;
}
function runQuery(query){query=query.trim();if(!query)return;demo.dataset.airlockState='checking';trace.textContent='Checking 3 local documents';run.disabled=true;answer.innerHTML='<span class="answer-label">Checking</span><h3>Looking for an answer the sources can support.</h3><p>Exact terms, related language, numbers, and attribution are checked before a response is shown.</p>';const result=classify(query);setTimeout(()=>renderResult(result),motionOff?20:620)}
form.addEventListener('submit',event=>{event.preventDefault();runQuery(input.value)});
document.querySelectorAll('[data-query]').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.query;runQuery(input.value)}));

const flowButton=document.getElementById('flow-toggle'),signal=document.getElementById('signal-square'),pathIds=['path-youtube','path-reddit','path-rss','path-discord','path-dashboard'];let flowTimer=0,flowRunning=true;
function animateSignal(){if(motionOff||!flowRunning||document.hidden)return;const path=document.getElementById(pathIds[Math.floor(Math.random()*pathIds.length)]),length=path.getTotalLength(),start=performance.now();signal.style.opacity='1';function frame(now){const p=Math.min((now-start)/1600,1),pt=path.getPointAtLength(length*p);signal.setAttribute('x',pt.x-3.5);signal.setAttribute('y',pt.y-3.5);if(p<1&&!motionOff&&flowRunning)requestAnimationFrame(frame);else signal.style.opacity='0'}requestAnimationFrame(frame);flowTimer=setTimeout(animateSignal,5500+Math.random()*2200)}
function syncMotion(){document.body.classList.toggle('motion-off',motionOff);flowButton.setAttribute('aria-pressed',String(motionOff||!flowRunning));flowButton.textContent=(motionOff||!flowRunning)?'Motion: off':'Motion: on';clearTimeout(flowTimer);signal.style.opacity='0';if(!motionOff&&flowRunning)flowTimer=setTimeout(animateSignal,1000)}
flowButton.addEventListener('click',()=>{flowRunning=!flowRunning;syncMotion()});motionMedia.addEventListener('change',event=>{motionOff=event.matches;syncMotion()});document.addEventListener('visibilitychange',syncMotion);syncMotion();

const route=document.getElementById('pass-route'),disc=document.getElementById('disc'),play=document.getElementById('play-point'),passCount=document.getElementById('pass-count'),sequence=document.getElementById('sequence-state'),announcement=document.getElementById('point-announcement');let pointFrame=0;
play.addEventListener('click',()=>{cancelAnimationFrame(pointFrame);const length=route.getTotalLength();let start=null;route.style.opacity='1';route.style.strokeDasharray=String(length);route.style.strokeDashoffset=String(length);passCount.textContent='0';sequence.textContent='In play';function step(now){if(start===null)start=now;const progress=motionOff?1:Math.min((now-start)/2200,1),pt=route.getPointAtLength(length*progress);disc.setAttribute('cx',pt.x);disc.setAttribute('cy',pt.y);route.style.strokeDashoffset=String(length*(1-progress));passCount.textContent=String(Math.min(4,Math.floor(progress*4.3)));if(progress<1)pointFrame=requestAnimationFrame(step);else{passCount.textContent='4';sequence.textContent='Complete';play.textContent='Replay point';announcement.textContent='Illustrated point complete: four passes, goal.'}}pointFrame=requestAnimationFrame(step)});
