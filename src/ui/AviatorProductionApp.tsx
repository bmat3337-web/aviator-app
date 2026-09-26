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

function BetCard({ id, slot, ui, round, setUI, place, cash }: {
  id: SlotId;
  slot: GameSnapshot['bets'][SlotId];
  ui: BetUI;
  round: GameSnapshot['round'];
  setUI: (patch: Partial<BetUI>) => void;
  place: () => void;
  cash: () => void;
}) {
  const live = slot.state === 'BET_PLACED' || slot.state === 'ACTIVE';
  const terminal = ['CASHED_OUT', 'CRASHED', 'SETTLED'].includes(slot.state);
  const locked = live || terminal;
  const canPlace = round.state === 'BETTING_OPEN' && slot.state === 'IDLE';
  const canCash = round.state === 'FLYING' && live;
  const name = id === 'BET1' ? 'BET 1' : 'BET 2';
  const accent = id === 'BET1' ? 'gold' : 'cyan';

  const adjustStake = (delta: number) =>
    setUI({ stake: Math.max(1, Math.min(5000, ui.stake + delta)) });

  const adjustCash = (delta: number) =>
    setUI({
      autoCashOut: Math.max(
        1.05,
        Math.min(100, Number(((ui.autoCashOut ?? 2) + delta).toFixed(2))),
      ),
    });

  return (
    <section className={`cockpit-bet bet-${accent} ${live ? 'is-live' : ''}`} aria-label={name}>
      <div className="bet-topline">
        <div className="bet-field">
          <label>STAKE</label>
          <div className="stepper">
            <button type="button" disabled={locked} onClick={() => adjustStake(-1)}>−</button>
            <input
              aria-label={`${name} stake`}
              type="number"
              min="1"
              max="5000"
              value={ui.stake}
              disabled={locked}
              onChange={(e) =>
                setUI({ stake: Math.max(1, Math.min(5000, Number(e.target.value) || 1)) })
              }
            />
            <button type="button" disabled={locked} onClick={() => adjustStake(1)}>+</button>
          </div>
        </div>

        <label className={`auto-bet top-auto-bet ${ui.autoBet ? 'on' : ''}`}>
          <span className="auto-copy"><strong>AUTO BET</strong></span>
          <input
            type="checkbox"
            checked={ui.autoBet}
            disabled={live}
            onChange={(e) => setUI({ autoBet: e.target.checked })}
          />
          <span className="switch"><i /></span>
        </label>

        <div className="bet-field">
          <div className="field-topline">
            <label>AUTO C/O</label>
            <button
              type="button"
              className={`mini-toggle ${ui.autoCashOut !== null ? 'on' : ''}`}
              disabled={live}
              aria-pressed={ui.autoCashOut !== null}
              onClick={() =>
                setUI({ autoCashOut: ui.autoCashOut === null ? 2 : null })
              }
            >
              {ui.autoCashOut !== null ? 'ON' : 'OFF'}
            </button>
          </div>
          <div className="stepper">
            <button
              type="button"
              disabled={live || ui.autoCashOut === null}
              onClick={() => adjustCash(-0.1)}
            >−</button>
            <input
              aria-label={`${name} auto cash out`}
              type="number"
              step="0.1"
              min="1.05"
              max="100"
              value={ui.autoCashOut ?? ''}
              placeholder="2.00"
              disabled={live || ui.autoCashOut === null}
              onChange={(e) =>
                setUI({
                  autoCashOut: Math.max(
                    1.05,
                    Math.min(100, Number(e.target.value) || 2),
                  ),
                })
              }
            />
            <button
              type="button"
              disabled={live || ui.autoCashOut === null}
              onClick={() => adjustCash(0.1)}
            >+</button>
          </div>
        </div>
      </div>

      <div className="presets">
        {[1, 5, 10, 20, 5000].map((value) => (
          <button
            key={value}
            type="button"
            disabled={locked}
            className={ui.stake === value ? 'selected' : ''}
            onClick={() => setUI({ stake: value })}
          >
            {value === 5000 ? 'MAX' : value}
          </button>
        ))}
      </div>

      <button
        className="bet-action"
        type="button"
        disabled={!canPlace && !canCash}
        onClick={canCash ? cash : place}
      >
        <span>▶ &nbsp;{canCash ? 'CASH OUT' : canPlace ? name : ui.autoBet ? `${name} · NEXT ROUND` : name}</span>
        <b>${ui.stake.toFixed(2)}</b>
      </button>

      <div className="bet-status">
        <span>
          <i />
          {live ? 'BET PLACED · ACTIVE' : terminal ? stateLabel(slot.state) : 'Ready to bet'}
        </span>
        <strong>DEMO BALANCE ${DEMO_BALANCE.toFixed(2)}</strong>
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
  const [ui, setUI] = useState<Record<SlotId, BetUI>>({
    BET1: { stake: 1, autoBet: false, autoCashOut: 2 },
    BET2: { stake: 1, autoBet: false, autoCashOut: 2 },
  });
  const [history, setHistory] = useState<number[]>([]);
  const [theme, setTheme] = useState<EnvironmentId>(environment);

  useEffect(() => provider.subscribe(setSnapshot), [provider]);

  useEffect(() => {
    if (snapshot.round.state === 'RESULT' || snapshot.round.state === 'CRASH') {
      const value = snapshot.round.multiplier;
      if (value > 0) {
        setHistory((current) =>
          current[0] === value ? current : [value, ...current].slice(0, 20),
        );
      }
    }
  }, [snapshot.round.state, snapshot.round.multiplier]);

  const patch = (id: SlotId, value: Partial<BetUI>) =>
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
      // Demo provider can reject a cash-out outside the active flight state.
    }
  };

  const progress = Math.min(1, Math.max(0, (snapshot.round.multiplier - 1) / 9));
  const aircraftX = 9 + progress * 77;
  const aircraftY = 78 - Math.pow(progress, 1.45) * 58;

  const compactHistory = useMemo(() => {
    const merged = [...history, ...HISTORY_SEED];
    return merged.filter((value, index, values) => values.indexOf(value) === index).slice(0, 12);
  }, [history]);

  return (
    <div className="aviator-shell">
      <header className="aviator-header">
        <div className="brand">
          <strong>AVIATOR</strong>
          <span>FLY BEYOND LIMITS</span>
        </div>

        <div className="demo-wallet" aria-label="Demo balance">
          <span>▣</span>
          <strong>DEMO · ${DEMO_BALANCE.toFixed(2)}</strong>
        </div>

        <div className="header-tools">
          <button className="icon-button" type="button" aria-label="Theme">◐</button>
          <button className="icon-button settings" type="button" aria-label="Settings">⚙</button>
          <span className="demo-badge">DEMO</span>
        </div>
        <button className="icon-button menu" type="button" aria-label="Open menu">☰</button>
      </header>

      <main className="play-column">
        <section className="live-flight" aria-label="Live flight cockpit">
          <div className="flight-context">
            <span className="live-badge"><i /> LIVE</span>
            <span>ROUND #{snapshot.round.id}</span>
            <span className="context-spacer" />
            <span>{snapshot.round.playerCount.toLocaleString()} ONLINE</span>
          </div>

          <div className="flight-scene">
            <Atmosphere
              environment={theme}
              intensity={flightIntensityFromSnapshot(snapshot)}
            />
            <div
              className="aircraft"
              style={{ left: `${aircraftX}%`, top: `${aircraftY}%` }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 96 48">
                <path
                  d="M6 27C18 26 31 24 43 20L68 5C72 3 76 4 73 9L63 21L87 24C92 25 93 28 88 30L61 32L49 43C46 46 42 45 44 40L48 32L25 34L15 41C12 43 9 41 11 37L17 32L7 31C2 31 2 28 6 27Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="flight-readout">
              <strong>{snapshot.round.multiplier.toFixed(2)}x</strong>
              <span>{stateLabel(snapshot.round.state)}</span>
            </div>
            <div className="flight-horizon" />
            <svg className="trajectory" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path d="M7 82 Q24 80 39 68 T61 46 T77 28 T92 12" className="trajectory-glow" />
              <path d="M7 82 Q24 80 39 68 T61 46 T77 28 T92 12" className="trajectory-line" />
            </svg>
          </div>
        </section>

        <section className="recent-multipliers" aria-label="Recent multipliers">
          <div className="recent-heading"><strong>RECENT</strong><span>HISTORY</span></div>
          <div className="recent-scroll">
            {compactHistory.map((value, index) => (
              <span key={`${value}-${index}`} className={value >= 2 ? 'high' : 'low'}>
                {value.toFixed(2)}x
              </span>
            ))}
          </div>
        </section>

        <section className="bet-grid" aria-label="Bet controls">
          <BetCard
            id="BET1"
            slot={snapshot.bets.BET1}
            ui={ui.BET1}
            round={snapshot.round}
            setUI={(value) => patch('BET1', value)}
            place={() => place('BET1')}
            cash={() => cash('BET1')}
          />
          <BetCard
            id="BET2"
            slot={snapshot.bets.BET2}
            ui={ui.BET2}
            round={snapshot.round}
            setUI={(value) => patch('BET2', value)}
            place={() => place('BET2')}
            cash={() => cash('BET2')}
          />
        </section>

        <section className="secondary-grid">
          <article className="secondary-card challenge">
            <span className="secondary-kicker">DAILY CHALLENGE</span>
            <strong>STRATOSPHERE ACE</strong>
            <small>3 / 5 complete · demo reward</small>
            <div className="progress"><i /></div>
          </article>

          <article className="secondary-card">
            <span className="secondary-kicker">LIVE STATISTICS</span>
            <div className="stat-grid">
              <b>{snapshot.round.playerCount.toLocaleString()}<small>Players Online</small></b>
              <b>LIVE<small>Round</small></b>
              <b>—<small>Highest</small></b>
              <b>—<small>Average</small></b>
            </div>
          </article>

          <article className="secondary-card">
            <span className="secondary-kicker">DYNAMIC THEMES</span>
            <div className="theme-list">
              {([
                ['Sunrise', 'sunrise'],
                ['Daytime', 'day'],
                ['Sunset', 'sunset'],
                ['Night', 'night'],
                ['Storm', 'storm'],
                ['Above Clouds', 'above-clouds'],
                ['Runway', 'runway'],
                ['Cycle', 'cycle'],
              ] as Array<[string, EnvironmentId]>).map(([label, value]) => (
                <button
                  key={value}
                  type="button"
                  className={theme === value ? 'selected' : ''}
                  onClick={() => setTheme(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </article>

          <article className="secondary-card">
            <span className="secondary-kicker">SESSION HISTORY</span>
            <div className="session-list">
              {compactHistory.slice(0, 5).map((value, index) => (
                <div key={`${value}-${index}`}>
                  <span>#{index}</span>
                  <strong>{value.toFixed(2)}x</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="secondary-card probably-fair">
            <span className="secondary-kicker">PROBABLY FAIR</span>
            <strong>DEMO SIMULATION</strong>
            <small>Verification presentation only. No real-money settlement is enabled in this UI.</small>
          </article>

          <article className="secondary-card fly-beyond">
            <span className="secondary-kicker">FLY BEYOND LIMITS</span>
            <strong>ONE GAME. ONE FLIGHT.</strong>
            <small>Explore challenges, social, history, wallet and settings.</small>
          </article>
        </section>
      </main>

      <nav className="bottom-nav" aria-label="Primary navigation">
        {[
          ['PLAY', '✈'],
          ['CHALLENGES', '◇'],
          ['SOCIAL', '◉'],
          ['HISTORY', '◷'],
          ['WALLET', '▣'],
        ].map(([label, icon], index) => (
          <button key={label} className={index === 0 ? 'active' : ''} type="button">
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
