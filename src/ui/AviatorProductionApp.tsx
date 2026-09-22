import { useEffect, useState } from 'react';
import type { IGameProvider } from '../domain/IGameProvider';
import type { GameSnapshot, SlotId } from '../domain/game';
import './aviator.css';
import { Atmosphere } from './Atmosphere';
import { flightIntensityFromSnapshot } from './atmosphereController';

type UIState = { stake:number; autoBet:boolean; autoCashOut:number|null };

function label(s:string){return s==='CRASH'?'CRASHED':s.replaceAll('_',' ');}

function BetCard(p:{
 id:SlotId; slot:GameSnapshot['bets'][SlotId]; ui:UIState; round:GameSnapshot['round'];
 setUI:(x:Partial<UIState>)=>void; place:()=>void; cash:()=>void;
}) {
 const active=p.slot.state==='ACTIVE'||p.slot.state==='BET_PLACED';
 const canPlace=p.round.state==='BETTING_OPEN'&&p.slot.state==='IDLE';
 const canCash=p.round.state==='FLYING'&&active;
 const locked=active||p.slot.state==='CASHED_OUT'||p.slot.state==='CRASHED'||p.slot.state==='SETTLED';
 const displayedPayout=p.slot.payout>0?p.slot.payout:p.ui.stake*(p.ui.autoCashOut??2);
 let action=label(p.slot.state);
 if(canPlace) action='PLACE BET';
 if(canCash) action='CASH OUT';
 return <section className={'bet '+(p.id==='BET1'?'gold':'cyan')+(active?' active':'')}>
  <header><b>{p.id==='BET1'?'BET 1':'BET 2'}</b><span>{active?'LIVE':'EST '+displayedPayout.toFixed(2)}</span></header>
  <div className="controls">
   <div><label>STAKE</label><div className="step">
    <button disabled={locked} onClick={()=>p.setUI({stake:Math.max(1,p.ui.stake-10)})}>−</button>
    <input type="number" min="1" max="5000" value={p.ui.stake} disabled={locked} onChange={e=>p.setUI({stake:Math.max(1,Math.min(5000,Number(e.target.value)||1))})}/>
    <button disabled={locked} onClick={()=>p.setUI({stake:Math.min(5000,p.ui.stake+10)})}>+</button>
   </div></div>
   <div><label><button className="toggle" disabled={active} onClick={()=>p.setUI({autoCashOut:p.ui.autoCashOut===null?2:null})}>AUTO CASH OUT</button></label>
    <div className="step"><button disabled={active||p.ui.autoCashOut===null} onClick={()=>p.setUI({autoCashOut:Math.max(1.05,Number(((p.ui.autoCashOut??2)-.1).toFixed(2)))})}>−</button>
    <input type="number" step=".1" min="1.05" max="100" value={p.ui.autoCashOut??''} placeholder="2.00" disabled={active||p.ui.autoCashOut===null} onChange={e=>p.setUI({autoCashOut:Math.max(1.05,Math.min(100,Number(e.target.value)||2))})}/>
    <button disabled={active||p.ui.autoCashOut===null} onClick={()=>p.setUI({autoCashOut:Math.min(100,Number(((p.ui.autoCashOut??2)+.1).toFixed(2)))})}>+</button></div>
   </div>
  </div>
  <div className="quick">{[10,50,100,500].map(v=><button key={v} disabled={locked} onClick={()=>p.setUI({stake:v})}>{v}</button>)}<button disabled={locked} onClick={()=>p.setUI({stake:5000})}>MAX</button></div>
  <footer><label><input type="checkbox" checked={p.ui.autoBet} disabled={active} onChange={e=>p.setUI({autoBet:e.target.checked})}/> AUTO BET</label>
  <button className="action" disabled={!canPlace&&!canCash} onClick={canCash?p.cash:p.place}>{action}</button></footer>
 </section>;
}

export function AviatorProductionApp({provider}:{provider:IGameProvider}){
 const [snapshot,setSnapshot]=useState(provider.snapshot());
 const [ui,setUI]=useState<Record<SlotId,UIState>>({
  BET1:{stake:10,autoBet:false,autoCashOut:null},
  BET2:{stake:20,autoBet:false,autoCashOut:null}
 });
 const [history,setHistory]=useState<number[]>([]);
 const patch=(id:SlotId,x:Partial<UIState>)=>setUI(v=>({...v,[id]:{...v[id],...x}}));
 useEffect(()=>provider.subscribe(setSnapshot),[provider]);

 useEffect(()=>{
  if(snapshot.round.state==='RESULT'||snapshot.round.state==='CRASH'){
   const m=snapshot.round.multiplier;
   if(m>0)setHistory(h=>h[0]===m?h:[m,...h].slice(0,12));
  }
 },[snapshot.round.state,snapshot.round.multiplier]);

 const place=(id:SlotId)=>provider.placeBet({slot:id,stake:ui[id].stake,autoBet:ui[id].autoBet,autoCashOut:ui[id].autoCashOut});
 const cash=(id:SlotId)=>{try{provider.cashOut(id)}catch{}};
 const progress=Math.min(1,Math.max(0,(snapshot.round.multiplier-1)/9));
 const x=8+progress*76;
 const y=88-Math.pow(progress,.78)*68;

 return <div className="aviator">
  <header><strong>✈ AVIATOR <em>PRO</em></strong><nav>PLAY　 CHALLENGE　 HISTORY　 SOCIAL</nav><span>DEMO PROVIDER</span></header>
  <main>
   <aside><b>● LIVE ROUND</b><strong>#{snapshot.round.id}</strong><span>{label(snapshot.round.state)}</span>
    <div className="live-count">{snapshot.round.playerCount.toLocaleString()}</div><b>ONLINE</b>
    {history.length?history.map((v,i)=><i key={i}>{v.toFixed(2)}x</i>):<div className="history-empty">ROUND HISTORY WILL APPEAR FROM COMPLETED PROVIDER ROUNDS.</div>}
   </aside>
   <section className="center">
    <div className="flight"><Atmosphere environment="above-clouds" intensity={flightIntensityFromSnapshot(snapshot)} /><div className="telemetry">● LIVE FLIGHT · ROUND #{snapshot.round.id}<span>{snapshot.round.playerCount.toLocaleString()} ONLINE</span></div>
     <div className="stage"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M8 88Q25 82 40 70T62 48T78 30T92 14L92 100L8 100Z"/><path className="line" d="M8 88Q25 82 40 70T62 48T78 30T92 14"/></svg>
      <div className="plane" style={{left:x+'%',top:y+'%'}}>✈</div><div className="state">{label(snapshot.round.state)}</div><div className="mult">{snapshot.round.multiplier.toFixed(2)}x</div>
     </div>
    </div>
    <div className="bets">
     <BetCard id="BET1" slot={snapshot.bets.BET1} ui={ui.BET1} round={snapshot.round} setUI={x=>patch('BET1',x)} place={()=>place('BET1')} cash={()=>cash('BET1')}/>
     <BetCard id="BET2" slot={snapshot.bets.BET2} ui={ui.BET2} round={snapshot.round} setUI={x=>patch('BET2',x)} place={()=>place('BET2')} cash={()=>cash('BET2')}/>
    </div>
   </section>
   <aside><b>● LIVE PLAYERS</b><div className="live-count">{snapshot.round.playerCount.toLocaleString()}</div><b>PROVIDER COUNT</b>
    <div className="player">Player data is supplied by the active game provider.</div>
    <div className="player">No synthetic player identities are displayed.</div>
   </aside>
  </main>
  <footer>⌾ Secure　 ♢ Fair　 ◎ Global　 ♡ Responsible　 ·　 UI transfer / provider-driven demo</footer>
 </div>;
}
