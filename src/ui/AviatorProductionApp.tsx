import {useEffect,useState} from 'react';
import type {IGameProvider} from '../domain/IGameProvider';
import type {GameSnapshot,SlotId} from '../domain/game';
import './aviator.css';

type U={stake:number;autoBet:boolean;autoCashOut:number|null};
const history=[1.23,4.56,1.08,12.64,3.28,1.45,3.92,2.11];
const label=(s:string)=>s==='CRASH'?'CRASHED':s.replaceAll('_',' ');
function Bet(p:{id:SlotId;slot:GameSnapshot['bets'][SlotId];ui:U;round:GameSnapshot['round'];mult:number;balance:number;setUI:(x:Partial<U>)=>void;place:()=>void;cash:()=>void}){
 const active=p.slot.state==='ACTIVE'||p.slot.state==='BET_PLACED'; const locked=active||p.slot.state==='CASHED_OUT'||p.slot.state==='CRASHED';
 let action=label(p.slot.state); if(p.round.state==='FLYING'&&active) action='CASH OUT'; if(p.round.state==='BETTING_OPEN'&&p.slot.state==='IDLE') action='PLACE BET';
 return <section className={'bet '+(p.id==='BET1'?'gold':'cyan')+(active?' active':'')}><header><b>{p.id==='BET1'?'BET 1':'BET 2'}</b><span>{active?'LIVE $'+(p.ui.stake*p.mult).toFixed(2):'EST $'+(p.ui.stake*(p.ui.autoCashOut||2)).toFixed(2)}</span></header>
 <div className="controls"><div><label>STAKE</label><div className="step"><button disabled={locked} onClick={()=>p.setUI({stake:Math.max(1,p.ui.stake-1)})}>−</button><input type="number" value={p.ui.stake} disabled={locked} onChange={e=>p.setUI({stake:Math.max(1,Math.min(1000,+e.target.value||1))})}/><button disabled={locked} onClick={()=>p.setUI({stake:Math.min(1000,p.ui.stake+1)})}>+</button></div></div>
 <div><label><button className="toggle" disabled={active} onClick={()=>p.setUI({autoCashOut:p.ui.autoCashOut===null?2:null})}>AUTO CASH OUT</button></label><div className="step"><button disabled={active||p.ui.autoCashOut===null} onClick={()=>p.setUI({autoCashOut:Math.max(1.05,+((p.ui.autoCashOut||2)-.1).toFixed(2))})}>−</button><input type="number" step=".1" value={p.ui.autoCashOut??''} placeholder="2.00" disabled={active||p.ui.autoCashOut===null} onChange={e=>p.setUI({autoCashOut:Math.max(1.05,+e.target.value||2)})}/><button disabled={active||p.ui.autoCashOut===null} onClick={()=>p.setUI({autoCashOut:Math.min(100,+((p.ui.autoCashOut||2)+.1).toFixed(2))})}>+</button></div></div></div>
 <div className="quick">{[1,5,10,50].map(v=><button key={v} disabled={locked} onClick={()=>p.setUI({stake:v})}>{v}</button>)}<button disabled={locked} onClick={()=>p.setUI({stake:Math.max(1,Math.floor(p.balance))})}>MAX</button></div>
 <footer><label><input type="checkbox" checked={p.ui.autoBet} disabled={active} onChange={e=>p.setUI({autoBet:e.target.checked})}/> AUTO BET</label><button className="action" disabled={p.round.state!=='BETTING_OPEN'&&!(p.round.state==='FLYING'&&active)} onClick={p.round.state==='FLYING'&&active?p.cash:p.place}>{action}</button></footer></section>;
}
export function AviatorProductionApp({provider}:{provider:IGameProvider}){
 const [s,setS]=useState(provider.snapshot()); const [balance,setBalance]=useState(250);
 const [u,setU]=useState<Record<SlotId,U>>({BET1:{stake:10,autoBet:false,autoCashOut:null},BET2:{stake:20,autoBet:false,autoCashOut:null}});
 useEffect(()=>provider.subscribe(setS),[provider]); const patch=(id:SlotId,x:Partial<U>)=>setU(v=>({...v,[id]:{...v[id],...x}}));
 const place=(id:SlotId)=>{const b=u[id];if(s.round.state!=='BETTING_OPEN'||s.bets[id].state!=='IDLE'||b.stake>balance)return;provider.placeBet({slot:id,stake:b.stake,autoBet:b.autoBet,autoCashOut:b.autoCashOut});setBalance(v=>v-b.stake)};
 const cash=(id:SlotId)=>{const r=provider.cashOut(id);setBalance(v=>v+r.payout)};
 const progress=Math.min(1,Math.max(0,(s.round.multiplier-1)/9)),x=8+progress*76,y=88-Math.pow(progress,.78)*68;
 return <div className="aviator"><header><strong>✈ AVIATOR <em>PRO</em></strong><nav>PLAY　 CHALLENGE　 HISTORY　 SOCIAL</nav><span>DEMO ${balance.toFixed(2)} <button onClick={()=>setBalance(v=>v+100)}>+</button></span></header>
 <main><aside><b>● LIVE ROUND</b><strong>#{s.round.id}</strong><span>{label(s.round.state)}</span>{history.map(v=><i key={v}>{v.toFixed(2)}x</i>)}</aside>
 <section className="center"><div className="flight"><div className="telemetry">● LIVE FLIGHT · ROUND #{s.round.id}<span>{s.round.playerCount.toLocaleString()} ONLINE</span></div><div className="stage"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M8 88Q25 82 40 70T62 48T78 30T92 14L92 100L8 100Z"/><path className="line" d="M8 88Q25 82 40 70T62 48T78 30T92 14"/></svg><div className="plane" style={{left:x+'%',top:y+'%'}}>✈</div><div className="state">{label(s.round.state)}</div><div className="mult">{s.round.multiplier.toFixed(2)}x</div></div></div>
 <div className="bets"><Bet id="BET1" slot={s.bets.BET1} ui={u.BET1} round={s.round} mult={s.round.multiplier} balance={balance} setUI={x=>patch('BET1',x)} place={()=>place('BET1')} cash={()=>cash('BET1')}/><Bet id="BET2" slot={s.bets.BET2} ui={u.BET2} round={s.round} mult={s.round.multiplier} balance={balance} setUI={x=>patch('BET2',x)} place={()=>place('BET2')} cash={()=>cash('BET2')}/></div></section>
 <aside><b>● LIVE PLAYERS {s.round.playerCount.toLocaleString()}</b>{['TruWin','ZimLegend','NiaPro','SkyBet','Kuda777','Makanaka'].map((n,i)=><div className="player" key={n}>{n}<span>{[2.14,1.87,0,3.28,1.56,1.56][i]||'—'}{[2.14,1.87,0,3.28,1.56,1.56][i]?'x':''}</span></div>)}</aside></main><footer>⌾ Secure　 ♢ Fair　 ◎ Global　 ♡ Responsible</footer></div>;
}
