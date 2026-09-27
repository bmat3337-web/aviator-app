import { useEffect, useMemo, useState } from 'react';
import type { IGameProvider } from '../domain/IGameProvider';
import type { GameSnapshot, SlotId } from '../domain/game';
import type { EnvironmentId } from './Atmosphere';
import { Atmosphere } from './Atmosphere';
import { flightIntensityFromSnapshot } from './atmosphereController';
import './aviator.css';

type BetUI = { stake: number; autoBet: boolean; autoCashOut: number | null };
const DEMO_BALANCE = 1247.5;
const HISTORY_SEED = [12.48, 1.32, 3.21, 1.05, 8.14, 2.36, 1.18, 4.72, 1.0];

function stateLabel(state: string) {
  switch (state) {
    case 'WAITING':
    case 'PREPARING':
    case 'BETTING_CLOSED': return 'PREPARING';
    case 'BETTING_OPEN': return 'BETTING OPEN';
    case 'FLYING': return 'FLYING';
    case 'CRASH': return 'FLEW AWAY';
    case 'RESULT': return 'ROUND ENDED';
    case 'NEXT_ROUND': return 'NEXT ROUND';
    default: return state.replaceAll('_', ' ');
  }
}


type UIState = { stake: number; autoBet: boolean; autoCashOut: number | null };
const DEMO_BALANCE = 1247.5;
const HISTORY_SEED = [3.34, 12.48, 1.32, 3.21, 1.18, 2.64, 1.07, 5.42, 1.44, 7.16];

function roundLabel(state: string) {
  switch (state) {
    case 'CRASH': return 'FLEW AWAY';
    case 'FLYING': return 'FLYING';
    case 'BETTING_OPEN': return 'BETTING OPEN';
    case 'RESULT': return 'ROUND ENDED';
    default: return state.replaceAll('_', ' ');
  }
}

function BetCard({ id, slot, ui, round, setUI, place, cash }: {
  id: SlotId; slot: GameSnapshot['bets'][SlotId]; ui: UIState; round: GameSnapshot['round'];
  setUI: (patch: Partial<UIState>) => void; place: () => void; cash: () => void;
}) {
  const live = slot.state === 'BET_PLACED' || slot.state === 'ACTIVE';
  const terminal = ['CASHED_OUT', 'CRASHED', 'SETTLED'].includes(slot.state);
  const locked = live || terminal;
  const canPlace = round.state === 'BETTING_OPEN' && slot.state === 'IDLE';
  const canCash = round.state === 'FLYING' && live;
  const name = id === 'BET1' ? 'BET 1' : 'BET 2';
  const adjustStake = (delta: number) => setUI({ stake: Math.max(1, Math.min(5000, ui.stake + delta)) });
  const adjustCash = (delta: number) => setUI({ autoCashOut: Math.max(1.05, Math.min(100, Number(((ui.autoCashOut ?? 2) + delta).toFixed(2)))) });
  return (
    <section className={'cockpit-bet ' + (id === 'BET1' ? 'bet-one' : 'bet-two') + (live ? ' is-live' : '')} aria-label={name}>
      <div className="cockpit-bet-head"><span className="bet-name">{name}</span><span className="bet-mode-label">{ui.autoBet ? 'AUTO' : 'BET'}</span></div>
      <div className="cockpit-controls">
        <div className="control-group">
          <label>STAKE</label>
          <div className="stake-stepper">
            <button type="button" disabled={locked} onClick={() => adjustStake(-1)}>−</button>
            <input aria-label={name + ' stake'} type="number" min="1" max="5000" value={ui.stake} disabled={locked} onChange={(e) => setUI({ stake: Math.max(1, Math.min(5000, Number(e.target.value) || 1)) })} />
            <button type="button" disabled={locked} onClick={() => adjustStake(1)}>+</button>
          </div>
        </div>
        <label className={'auto-bet-control ' + (ui.autoBet ? 'enabled' : '')}>
          <span className="auto-copy"><strong>AUTO BET</strong><small>{ui.autoBet ? 'ON' : 'OFF'}</small></span>
          <input type="checkbox" checked={ui.autoBet} disabled={live} onChange={(e) => setUI({ autoBet: e.target.checked, autoCashOut: e.target.checked ? (ui.autoCashOut ?? 2) : null })} />
          <span className="switch-track"><span /></span>
        </label>
      </div>
      {ui.autoBet && (
        <div className="auto-config">
          <div className="control-group">
            <div className="field-topline">
              <label>AUTO C/O</label>
              <button type="button" className={'auto-cashout-toggle ' + (ui.autoCashOut !== null ? 'enabled' : '')} disabled={live} onClick={() => setUI({ autoCashOut: ui.autoCashOut === null ? 2 : null })}>{ui.autoCashOut !== null ? 'ON' : 'OFF'}</button>
            </div>
            <div className="stake-stepper">
              <button type="button" disabled={live || ui.autoCashOut === null} onClick={() => adjustCash(-0.1)}>−</button>
              <input aria-label={name + ' auto cash out'} type="number" step=".1" min="1.05" max="100" value={ui.autoCashOut ?? ''} placeholder="2.00" disabled={live || ui.autoCashOut === null} onChange={(e) => setUI({ autoCashOut: Math.max(1.05, Math.min(100, Number(e.target.value) || 2)) })} />
              <button type="button" disabled={live || ui.autoCashOut === null} onClick={() => adjustCash(0.1)}>+</button>
            </div>
          </div>
        </div>
      )}
      <div className="cockpit-quick">{[1,5,10,20,5000].map((value) => <button key={value} type="button" disabled={locked} className={ui.stake === value ? 'selected' : ''} onClick={() => setUI({ stake: value })}>{value === 5000 ? 'MAX' : value}</button>)}</div>
      <button className="primary-bet-action cockpit-action" type="button" disabled={!canPlace && !canCash} onClick={canCash ? cash : place}>
        <span className="action-plane">▶</span><span>{canCash ? 'CASH OUT' : canPlace ? name : ui.autoBet ? name + ' · NEXT ROUND' : name} · {'$' + ui.stake.toFixed(2)}</span>
      </button>
      <div className="bet-status"><span><i />{live ? 'BET PLACED · ACTIVE' : terminal ? roundLabel(slot.state) : 'READY TO BET'}</span></div>
    </section>
  );
}

export function AviatorProductionApp({ provider, environment = 'above-clouds' }: { provider: IGameProvider; environment?: EnvironmentId }) {
  const [snapshot, setSnapshot] = useState(provider.snapshot());
  const [ui, setUI] = useState<Record<SlotId, UIState>>({ BET1: { stake: 1, autoBet: false, autoCashOut: null }, BET2: { stake: 1, autoBet: false, autoCashOut: null } });
  const [history, setHistory] = useState<number[]>([]);
  const [theme, setTheme] = useState<EnvironmentId>(environment);
  useEffect(() => provider.subscribe(setSnapshot), [provider]);
  useEffect(() => {
    if (snapshot.round.state === 'RESULT' || snapshot.round.state === 'CRASH') {
      const value = snapshot.round.multiplier;
      if (value > 0) setHistory((current) => current[0] === value ? current : [value, ...current].slice(0, 20));
    }
  }, [snapshot.round.state, snapshot.round.multiplier]);
  const patch = (id: SlotId, value: Partial<UIState>) => setUI((current) => ({ ...current, [id]: { ...current[id], ...value } }));
  const place = (id: SlotId) => provider.placeBet({ slot: id, stake: ui[id].stake, autoBet: ui[id].autoBet, autoCashOut: ui[id].autoCashOut });
  const cash = (id: SlotId) => { try { provider.cashOut(id); } catch { /* provider owns authoritative state */ } };
  const progress = Math.min(1, Math.max(0, (snapshot.round.multiplier - 1) / 9));
  const aircraftX = 73 + progress * 17;
  const aircraftY = 24 - Math.pow(progress, 1.35) * 15;
  const mergedHistory = useMemo(() => [...history, ...HISTORY_SEED].filter((value, index, values) => values.indexOf(value) === index).slice(0, 12), [history]);
  return (
    <div className="aviator-shell">
      <header className="aviator-header">
        <button className="menu-button header-menu" type="button" aria-label="Open menu">☰</button>
        <div className="header-brand"><span className="brand-lockup"><strong>AVIATOR</strong></span><span className="brand-tagline">FLY BEYOND LIMITS</span></div>
        <div className="header-actions"><div className="header-balance"><span>▣</span><strong>{'DEMO · $' + DEMO_BALANCE.toFixed(2)}</strong></div><button className="deposit-button" type="button" aria-label="Open menu">☰</button></div>
      </header>

      <aside className="desktop-rail left-rail">
        <div className="rail-title">LIVE ROUND</div><div className="rail-subtitle">Round #{snapshot.round.id}</div><div className="rail-status">{roundLabel(snapshot.round.state)}</div>
        <div className="rail-history">{mergedHistory.slice(0,8).map((value,index)=><div key={index}><span className="history-pill">{value.toFixed(2)}x</span><small>round</small></div>)}</div>
      </aside>

      <section className="panel flight" aria-label="Live flight cockpit">
        <div className="flight-status-row"><span className="flight-live"><i /> LIVE</span><span className="flight-round">ROUND #{snapshot.round.id}</span><span className="flight-players">{snapshot.round.playerCount.toLocaleString()} ONLINE</span></div>
        <div className="flight-scene"><Atmosphere environment={theme} intensity={flightIntensityFromSnapshot(snapshot)} /></div>
        <svg className="flight-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path className="flight-path-line" d="M 5 88 Q 23 85 39 72 T 60 50 T 78 28 T 95 8" /></svg>
        <div className="aircraft" style={{ left: aircraftX + '%', top: aircraftY + '%' }} aria-hidden="true"><svg viewBox="0 0 96 48"><path d="M6 27C18 26 31 24 43 20L68 5C72 3 76 4 73 9L63 21L87 24C92 25 93 28 88 30L61 32L49 43C46 46 42 45 44 40L48 32L25 34L15 41C12 43 9 41 11 37L17 32L7 31C2 31 2 28 6 27Z" fill="currentColor" /></svg></div>
        <div className="flight-copy"><div className="multiplier">{snapshot.round.multiplier.toFixed(2)}x</div><div className="flight-message">{roundLabel(snapshot.round.state)}</div></div>
        <div className="cockpit-history" aria-label="Round History"><span className="history-label">ROUND HISTORY</span><div className="recent-row">{mergedHistory.map((value,index)=><span key={index} className={'recent-chip ' + (value >= 2 ? 'positive' : 'negative')}>{value.toFixed(2)}x</span>)}</div></div>
      </section>

      <aside className="desktop-rail right-rail">
        <div className="rail-title">LIVE PLAYERS <strong>{snapshot.round.playerCount.toLocaleString()}</strong></div>
        <div className="player-list"><div>Provider feed <span>LIVE</span></div><div>Player identities <span>PRIVATE</span></div><div>Settlement <span>ACTIVE</span></div></div>
        <div className="stats-box"><div>Players <strong>{snapshot.round.playerCount.toLocaleString()}</strong></div><div>Round <strong>LIVE</strong></div></div>
      </aside>

      <section className="bet-workspace">
        <div className="bet-grid">
          <BetCard id="BET1" slot={snapshot.bets.BET1} ui={ui.BET1} round={snapshot.round} setUI={(value) => patch('BET1', value)} place={() => place('BET1')} cash={() => cash('BET1')} />
          <BetCard id="BET2" slot={snapshot.bets.BET2} ui={ui.BET2} round={snapshot.round} setUI={(value) => patch('BET2', value)} place={() => place('BET2')} cash={() => cash('BET2')} />
        </div>
        <div className="daily-challenge"><span className="challenge-icon">◇</span><div><strong>DAILY CHALLENGE</strong><small>Stratosphere Ace · 3 / 5 complete · demo reward</small></div><span className="challenge-time">LIVE</span><span className="chevron">›</span></div>
        <div className="session-stats"><div><strong>♙</strong><span>{snapshot.round.playerCount.toLocaleString()}<small>Players</small></span></div><div><strong>◉</strong><span>LIVE<small>Round</small></span></div><div><strong>◷</strong><span>DEMO<small>Mode</small></span></div></div>
        <div className="utility-grid"><button type="button">◈<span>How to Play</span></button><button type="button">▤<span>Game Rules</span></button><button type="button">♢<span>Game Limits</span></button><button type="button" onClick={() => setTheme(theme === 'above-clouds' ? 'sunset' : 'above-clouds')}>◇<span>Flight Theme</span></button></div>
      </section>

      <nav className="mobile-nav" aria-label="Primary navigation"><button type="button" className="active">✈<span>Play</span></button><button type="button">◇<span>Challenges</span></button><button type="button">◉<span>Social</span></button><button type="button">◷<span>History</span></button><button type="button">▣<span>Wallet</span></button></nav>
    </div>
  );
}
