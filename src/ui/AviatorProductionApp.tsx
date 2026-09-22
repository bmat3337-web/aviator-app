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
  const canPlace = round.state === 'BETTING_OPEN' && slot.state === 'IDLE';
  const canCash = round.state === 'FLYING' && (slot.state === 'BET_PLACED' || slot.state === 'ACTIVE');
  const locked = !canPlace && !canCash;
  const action = canCash ? 'CASH OUT' : canPlace ? 'PLACE BET' : roundLabel(slot.state);

  return (
    <section className={'bet-card ' + (canPlace || canCash ? 'is-active' : '')}>
      <div className="bet-head">
        <div>
          <span className={'bet-name ' + (id === 'BET1' ? 'gold-text' : 'cyan-text')}>
            {id === 'BET1' ? 'Bet 1' : 'Bet 2'}
          </span>
          <span className="bet-state">{roundLabel(slot.state)}</span>
        </div>
        <label className="toggle-label">
          <span>Auto Cash Out</span>
          <input
            type="checkbox"
            checked={ui.autoCashOut !== null}
            disabled={canCash}
            onChange={(e) => setUI({ autoCashOut: e.target.checked ? 2 : null })}
          />
        </label>
      </div>

      <div className="bet-mode" role="tablist" aria-label={id + ' mode'}>
        <button type="button" className={ui.mode === 'BET' ? 'selected' : ''} disabled={canCash} onClick={() => setUI({ mode: 'BET', autoBet: false })}>Bet</button>
        <button type="button" className={ui.mode === 'AUTO' ? 'selected' : ''} disabled={canCash} onClick={() => setUI({ mode: 'AUTO', autoBet: true })}>Auto</button>
      </div>

      <div className="stake-control">
        <button type="button" disabled={locked} aria-label="Decrease stake" onClick={() => setUI({ stake: Math.max(10, ui.stake - 10) })}>−</button>
        <output>{ui.stake.toFixed(2)}</output>
        <button type="button" disabled={locked} aria-label="Increase stake" onClick={() => setUI({ stake: Math.min(5000, ui.stake + 10) })}>+</button>
      </div>

      <div className="quick-stakes">
        {[10, 50, 100, 500].map((value) => (
          <button key={value} type="button" disabled={locked} onClick={() => setUI({ stake: value })}>{value}</button>
        ))}
      </div>

      <label className="auto-cash-field">
        <span>Auto Cash Out</span>
        <input
          type="number"
          step=".1"
          min="1.05"
          max="100"
          value={ui.autoCashOut ?? ''}
          placeholder="2.00"
          inputMode="decimal"
          disabled={ui.autoCashOut === null || canCash}
          onChange={(e) => {
            const value = Number(e.target.value);
            setUI({ autoCashOut: Number.isFinite(value) && value >= 1.05 ? Math.min(100, value) : 1.05 });
          }}
        />
      </label>

      <label className="auto-bet-field">
        <input
          type="checkbox"
          checked={ui.autoBet}
          disabled={canCash}
          onChange={(e) => setUI({ autoBet: e.target.checked, mode: e.target.checked ? 'AUTO' : 'BET' })}
        />
        <span>Auto Bet</span>
      </label>

      <button className="primary-bet-action" type="button" disabled={locked} onClick={canCash ? cash : place}>
        {action}
      </button>
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
    BET1: { stake: 10, autoBet: false, autoCashOut: null, mode: 'BET' },
    BET2: { stake: 20, autoBet: false, autoCashOut: null, mode: 'BET' },
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
        <button className="menu-button" type="button" aria-label="Open menu">☰</button>
        <div className="header-brand">
          <span>✈ AVIATOR <em>PRO</em></span>
          <small>ONE GAME. ONE FLIGHT. ONE PREMIUM EXPERIENCE.</small>
        </div>
        <div className="header-actions">
          <div className="header-balance">DEMO PROVIDER</div>
          <button className="deposit-button" type="button" aria-label="Provider status">●</button>
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
        <div className="flight-top">
          <div>
            <strong>LIVE FLIGHT</strong>
            <div className="round">ROUND #{snapshot.round.id} · {roundLabel(snapshot.round.state)}</div>
          </div>
          <div className="online">● {snapshot.round.playerCount.toLocaleString()} Online</div>
        </div>

        <div className="next-round">
          <span>ROUND STATE</span>
          <strong>{snapshot.round.state === 'BETTING_OPEN' ? 'OPEN' : snapshot.round.state === 'FLYING' ? 'LIVE' : '—'}</strong>
        </div>

        <div className="flight-scene">
          <Atmosphere environment={environment} intensity={flightIntensityFromSnapshot(snapshot)} />
          <div className="horizon" />
        </div>

        <svg className="flight-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path className="flight-path-fill" d={pathD + ' L 90 100 L 8 100 Z'} />
          <path className="flight-path-line" d={pathD} />
        </svg>

        <div className="aircraft" style={{ left: aircraftX + '%', top: aircraftY + '%' }} aria-hidden="true">
          <svg viewBox="0 0 96 48">
            <path d="M6 27 C18 26 31 24 43 20 L68 5 C72 3 76 4 73 9 L63 21 L87 24 C92 25 93 28 88 30 L61 32 L49 43 C46 46 42 45 44 40 L48 32 L25 34 L15 41 C12 43 9 41 11 37 L17 32 L7 31 C2 31 2 28 6 27Z" fill="currentColor" />
          </svg>
        </div>

        <div className="flight-state">{snapshot.round.state === 'FLYING' ? 'FLYING' : roundLabel(snapshot.round.state)}</div>
        <div className="multiplier" aria-live="polite">{snapshot.round.multiplier.toFixed(2)}x</div>
        <div className="history">
          {history.map((value, index) => <span className="chip" key={index}>{value.toFixed(2)}x</span>)}
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
        <div className="bet-grid">
          <BetCard id="BET1" slot={snapshot.bets.BET1} ui={ui.BET1} round={snapshot.round} setUI={(value) => patch('BET1', value)} place={() => place('BET1')} cash={() => cash('BET1')} />
          <BetCard id="BET2" slot={snapshot.bets.BET2} ui={ui.BET2} round={snapshot.round} setUI={(value) => patch('BET2', value)} place={() => place('BET2')} cash={() => cash('BET2')} />
        </div>

        <div className="daily-challenge">
          <span className="challenge-icon">♜</span>
          <div><strong>DAILY CHALLENGE</strong><small>Climb the leaderboard. Rewards are provider-controlled.</small></div>
          <span className="challenge-time">LIVE</span>
          <span className="chevron">›</span>
        </div>

        <div className="utility-grid">
          <button type="button">◈<span>How to Play</span></button>
          <button type="button">▤<span>Game Rules</span></button>
          <button type="button">♢<span>Game Limits</span></button>
          <button type="button">◇<span>Probably Fair</span></button>
        </div>
      </section>

      <footer className="trust-strip">
        <span>⌾ Secure <small>Provider-controlled funds</small></span>
        <span>♢ Fair <small>Auditable game state</small></span>
        <span>◎ Global <small>Play anytime, anywhere</small></span>
        <span>♡ Responsible <small>Play with control</small></span>
      </footer>
    </div>
  );
}
