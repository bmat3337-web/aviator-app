import { useEffect, useState } from 'react';
import type { IGameProvider } from '../domain/IGameProvider';
import type { GameSnapshot, SlotId } from '../domain/game';
import type { EnvironmentId } from './Atmosphere';
import { Atmosphere } from './Atmosphere';
import { flightIntensityFromSnapshot } from './atmosphereController';
import './aviator.css';

type UIState = {
  stake: number;
  autoBet: boolean;
  autoCashOut: number | null;
  mode: 'BET' | 'AUTO';
};

function roundLabel(state: string) {
  return state === 'CRASH' ? 'CRASHED' : state.replaceAll('_', ' ');
}

const DEMO_BALANCE = 1000;

function BetCard({
  id,
  slot,
  ui,
  round,
  setUI,
  place,
  cash,
}: {
  id: SlotId;
  slot: GameSnapshot['bets'][SlotId];
  ui: UIState;
  round: GameSnapshot['round'];
  setUI: (patch: Partial<UIState>) => void;
  place: () => void;
  cash: () => void;
}) {
  const active = slot.state === 'BET_PLACED' || slot.state === 'ACTIVE';
  const canPlace = round.state === 'BETTING_OPEN' && slot.state === 'IDLE';
  const canCash = round.state === 'FLYING' && active;
  const locked = active || slot.state === 'CASHED_OUT' || slot.state === 'CRASHED' || slot.state === 'SETTLED';
  const action = canCash ? 'CASH OUT' : ui.autoBet && !canPlace ? 'BET (NEXT ROUND)' : (id === 'BET1' ? 'BET 1' : 'BET 2');
  return (
    <section className={'bet-card cockpit-bet ' + (id === 'BET1' ? 'bet-one' : 'bet-two') + (active ? ' is-live' : '')}>
      <div className="cockpit-bet-head">
        <span className="bet-name">{id === 'BET1' ? 'Bet 1' : 'Bet 2'}</span>
      </div>

      <div className="cockpit-controls">
        <div className="control-group">
          <label>Stake</label>
          <div className="stake-stepper">
            <button type="button" disabled={locked} onClick={() => setUI({ stake: Math.max(1, ui.stake - 10) })}>−</button>
            <input type="number" min="1" max="5000" value={ui.stake} disabled={locked}
              onChange={(e) => setUI({ stake: Math.max(1, Math.min(5000, Number(e.target.value) || 1)) })}/>
            <button type="button" disabled={locked} onClick={() => setUI({ stake: Math.min(5000, ui.stake + 10) })}>+</button>
          </div>
          <div className="quick-stakes cockpit-quick">
            {[1, 5, 10, 50].map((value) => (
              <button key={value} type="button" disabled={locked} className={ui.stake === value ? 'selected' : ''} onClick={() => setUI({ stake: value })}>{value}</button>
            ))}
            <button type="button" disabled={locked} className={ui.stake >= 5000 ? 'selected' : ''} onClick={() => setUI({ stake: 5000 })}>MAX</button>
          </div>
        </div>

        <div className="control-group auto-cashout-group">
          <div className="auto-cashout-head">
            <label htmlFor={id + '-auto-cashout'}>Auto Cashout</label>
          </div>
          <div className="stake-stepper">
            <button type="button" disabled={active || ui.autoCashOut === null}
              onClick={() => setUI({ autoCashOut: Math.max(1.05, Number(((ui.autoCashOut ?? 2) - 0.1).toFixed(2))) })}>−</button>
            <input type="number" step=".1" min="1.05" max="100" id={id + '-auto-cashout'} value={ui.autoCashOut ?? ''} placeholder="2.00" aria-label={id + ' auto cashout multiplier'}
              disabled={active || ui.autoCashOut === null}
              onChange={(e) => setUI({ autoCashOut: Math.max(1.05, Math.min(100, Number(e.target.value) || 2)) })}/>
            <button type="button" disabled={active || ui.autoCashOut === null}
              onClick={() => setUI({ autoCashOut: Math.min(100, Number(((ui.autoCashOut ?? 2) + 0.1).toFixed(2))) })}>+</button>
          </div>
          <button
            type="button"
            className={'auto-cashout-button ' + (ui.autoCashOut !== null ? 'enabled' : '')}
            disabled={active}
            aria-pressed={ui.autoCashOut !== null}
            onClick={() => setUI({ autoCashOut: ui.autoCashOut === null ? 2 : null })}
          >
            Auto Cashout {ui.autoCashOut !== null ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <div className="cockpit-action-row">
        <label className={'auto-bet-control ' + (ui.autoBet ? 'enabled' : '')}>
          <span className="auto-badge">A</span>
          <span className="auto-copy"><strong>Auto</strong><small>{ui.autoBet ? 'ON · NEXT ROUND' : 'OFF'}</small></span>
          <input type="checkbox" checked={ui.autoBet} disabled={active} onChange={(e) => setUI({ autoBet: e.target.checked })}/>
          <span className="switch-track"><span /></span>
        </label>
        <button className="primary-bet-action cockpit-action" type="button" disabled={!canPlace && !canCash} onClick={canCash ? cash : place}>
          <span className="action-plane">✈</span><span>{action}</span>
        </button>
      </div>
    </section>
  );
}

export function AviatorProductionApp({
  provider,
  environment = 'above-clouds',
}: {
  provider: IGameProvider;
  environment?: EnvironmentId;
}) {
  const [snapshot, setSnapshot] = useState(provider.snapshot());
  const [ui, setUI] = useState<Record<SlotId, UIState>>({
    BET1: { stake: 10, autoBet: false, autoCashOut: 2, mode: 'BET' },
    BET2: { stake: 25, autoBet: false, autoCashOut: 3, mode: 'BET' },
  });
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => provider.subscribe(setSnapshot), [provider]);

  useEffect(() => {
    if (snapshot.round.state === 'RESULT' || snapshot.round.state === 'CRASH') {
      const multiplier = snapshot.round.multiplier;
      if (multiplier > 0) setHistory((current) => current[0] === multiplier ? current : [multiplier, ...current].slice(0, 12));
    }
  }, [snapshot.round.state, snapshot.round.multiplier]);

  const patch = (id: SlotId, value: Partial<UIState>) =>
    setUI((current) => ({ ...current, [id]: { ...current[id], ...value } }));

  const place = (id: SlotId) =>
    provider.placeBet({
      slot: id,
      stake: ui[id].stake,
      autoBet: ui[id].autoBet,
      autoCashOut: ui[id].autoCashOut,
    });

  const cash = (id: SlotId) => {
    try {
      provider.cashOut(id);
    } catch {
      // Provider controls the authoritative cash-out state.
    }
  };

  const progress = Math.min(1, Math.max(0, (snapshot.round.multiplier - 1) / 9));
  const aircraftX = 10 + progress * 80;
  const aircraftY = 82 - Math.pow(progress, 1.55) * 64;
  const pathD = 'M 8 82 Q 24 80 38 68 T 60 46 T 76 28 T 90 14';

  return (
    <div className="aviator-shell">
      <header className="aviator-header">
        <button className="menu-button header-menu" type="button" aria-label="Open menu">☰</button>
        <div className="header-brand aviator-brand">
          <span className="brand-lockup"><b className="brand-mark">✈</b><strong>AVIATOR</strong></span>
          <small>FLY BEYOND LIMITS</small>
        </div>
        <div className="header-actions">
          <button className="theme-button" type="button" aria-label="Toggle appearance">☼</button>
          <div className="header-balance"><span>DEMO</span><strong>$1,000.00</strong></div>
          <button className="deposit-button" type="button" aria-label="Open menu">☰</button>
        </div>
      </header>

      <aside className="desktop-rail left-rail">
        <div className="rail-title">● Live Round</div>
        <div className="rail-subtitle">● Round #{snapshot.round.id}</div>
        <div className="rail-status">{roundLabel(snapshot.round.state)}</div>
        <div className="rail-history">
          {history.length ? history.map((value, index) => (
            <div key={index}><span className="history-pill">{value.toFixed(2)}x</span><small>recent</small></div>
          )) : <div className="rail-empty">Completed provider rounds will appear here.</div>}
        </div>
        <button className="rail-link" type="button">Full History →</button>
      </aside>

      <section className="panel flight">
        <div className="flight-status-row">
          <span className="flight-live"><i /> LIVE</span>
          <span className="flight-round">Round #{snapshot.round.id}</span>
          <span className="flight-players">♟ {snapshot.round.playerCount.toLocaleString()}</span>
          <span className="flight-quality">▮▮▮ Good</span>
        </div>
        <div className="flight-scene">
          <Atmosphere environment={environment} intensity={flightIntensityFromSnapshot(snapshot)} />
          <div className="reference-stars" />
          <div className="reference-mountains" />
          <div className="reference-runway" />
        </div>
        <div className="flight-axis" aria-hidden="true">
          <span>5.0x</span><span>4.0x</span><span>3.0x</span><span>2.0x</span><span>1.0x</span>
        </div>
        <svg className="flight-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path className="flight-path-fill" d={pathD + ' L 90 100 L 8 100 Z'} />
          <path className="flight-path-line" d={pathD} />
        </svg>
        <div className="aircraft" style={{ left: aircraftX + '%' , top: aircraftY + '%' }} aria-hidden="true">
          <svg viewBox="0 0 96 48"><path d="M6 27 C18 26 31 24 43 20 L68 5 C72 3 76 4 73 9 L63 21 L87 24 C92 25 93 28 88 30 L61 32 L49 43 C46 46 42 45 44 40 L48 32 L25 34 L15 41 C12 43 9 41 11 37 L17 32 L7 31 C2 31 2 28 6 27Z" fill="currentColor" /></svg>
        </div>
        <div className="flight-copy">
          <div className="multiplier" aria-live="polite">{snapshot.round.multiplier.toFixed(2)}x</div>
          <div className="flight-message">{snapshot.round.state === 'FLYING' ? 'Keep it going...' : roundLabel(snapshot.round.state)}</div>
        </div>
      </section>

      <aside className="desktop-rail right-rail">
        <div className="rail-title">● Live Players <strong>{snapshot.round.playerCount.toLocaleString()}</strong></div>
        <div className="player-list">
          <div>Provider player feed <span>LIVE</span></div>
          <div>Player identities <span>PRIVATE</span></div>
          <div>Settlement feed <span>ACTIVE</span></div>
        </div>
        <div className="stats-box">
          <div>♙ Players <strong>{snapshot.round.playerCount.toLocaleString()}</strong></div>
          <div>♜ Total Bets <strong>Provider</strong></div>
          <div>⌁ Highest <strong>Provider</strong></div>
          <div>⌁ Lowest <strong>Provider</strong></div>
        </div>
      </aside>

      <section className="bet-workspace">
        <div className="recent-multipliers mobile-first-recent">
          <div className="section-heading"><strong>Recent Multipliers</strong><button type="button">All Rounds →</button></div>
          <div className="recent-row">{history.slice(0, 8).map((value, index) => <span key={index} className={'recent-chip ' + (value >= 2 ? 'positive' : 'negative')}>{value.toFixed(2)}x</span>)}</div>
        </div>

        <div className="bet-grid">
          <BetCard id="BET1" slot={snapshot.bets.BET1} ui={ui.BET1} round={snapshot.round} setUI={(value) => patch('BET1', value)} place={() => place('BET1')} cash={() => cash('BET1')} />
          <BetCard id="BET2" slot={snapshot.bets.BET2} ui={ui.BET2} round={snapshot.round} setUI={(value) => patch('BET2', value)} place={() => place('BET2')} cash={() => cash('BET2')} />
        </div>

        <section className="flight-room">
          <div className="flight-room-head">
            <div><span className="room-live-dot" /> <strong>LIVE FLIGHT ROOM</strong> <small>SIMULATION</small></div>
            <span className="room-online">♙ {snapshot.round.playerCount.toLocaleString()} online</span>
          </div>
          <div className="room-tabs"><button className="active" type="button">All Bets</button><button type="button">My Bets</button><button type="button">Top Wins</button></div>
          <div className="room-table-head"><span>PILOT / USER</span><span>BET STAKE</span><span>CASH OUT</span></div>
          <div className="room-row"><span>Provider feed</span><span>—</span><strong>LIVE</strong></div>
          <div className="room-row"><span>Player identities</span><span>PRIVATE</span><strong>—</strong></div>
          <div className="room-stats"><span>Today's Peak <b>Provider</b></span><span>Total Bets <b>Provider</b></span><span>Theoretical RTP <b>Provider</b></span></div>
        </section>

        <section className="round-ledger">
          <div className="ledger-head"><strong>◷ ROUND LEDGER</strong><span>SIMULATION</span></div>
          <div className="ledger-current"><span>CURRENT FLIGHT <b>#{snapshot.round.id}</b></span><span>STATUS <b>{roundLabel(snapshot.round.state)}</b></span></div>
          <div className="ledger-row"><span>Round #{snapshot.round.id}</span><strong>{snapshot.round.multiplier.toFixed(2)}x</strong></div>
          <button type="button" className="ledger-proof">♢ Full History &amp; Proofs</button>
        </section>

        <div className="daily-challenge">
          <div className="challenge-icon">🏆</div>
          <div className="challenge-main"><strong>DAILY FLIGHT CHALLENGE</strong><p>Climb the leaderboard. Win rewards.</p><span>Stratosphere Ace (3/5 Complete)</span><div className="challenge-progress"><i /></div></div>
          <span className="challenge-time">◷ Resets in 06h 42m</span><span className="chevron">→</span>
        </div>

        <div className="utility-grid">
          <button type="button"><span>?</span><b>How to Play</b><small>Flight mechanics...</small></button>
          <button type="button"><span>▤</span><b>Game Rules</b><small>Multiplier logic &amp; ...</small></button>
          <button type="button"><span>⚙</span><b>Game Limits</b><small>Min $1.00 · Max ...</small></button>
          <button type="button"><span>♢</span><b>Probably Fair</b><small>Cryptographic verification</small></button>
        </div>

        <footer className="aviator-footer">
          <strong>AVIATOR — ONE GAME. ONE FLIGHT. ONE PREMIUM EXPERIENCE.</strong>
          <span>FLY BEYOND LIMITS • Standalone Simulation Interface &amp; Presentation Prototype</span>
        </footer>
      </section>

      <nav className="mobile-nav" aria-label="Primary navigation">
        <button type="button" className="active">✈<span>Flight</span></button>
        <button type="button">🏆<span>Challenge</span></button>
        <button type="button">▢<span>Social</span></button>
        <button type="button">◷<span>History</span></button>
        <button type="button">♙<span>Profile</span></button>
      </nav>

      <footer className="trust-strip">
        <span>⌾ Secure <small>Provider-controlled funds</small></span>
        <span>♢ Fair <small>Auditable game state</small></span>
        <span>◎ Global <small>Play anytime, anywhere</small></span>
        <span>♡ Responsible <small>Play with control</small></span>
      </footer>
    </div>
  );
}
