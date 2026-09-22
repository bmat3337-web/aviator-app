import { SimulatorProvider } from './domain/simulator';
import { FlightScreen } from './app/FlightScreen';
import { AviatorProductionApp } from './ui/AviatorProductionApp';

const provider = new SimulatorProvider('AVIATOR-DEMO-001', 0);
const root = document.getElementById('app');
if (!root) throw new Error('AVIATOR application root was not found');

const appRoot = AviatorProductionApp as unknown as (args: {provider: typeof provider}) => HTMLElement;
root.appendChild(appRoot({ provider }));

provider.start();
const timer = window.setInterval(() => {
  provider.advance();
  if (provider.snapshot().round.state === 'RESULT') provider.advance();
}, 350);
window.addEventListener('beforeunload', () => {
  window.clearInterval(timer);
  provider.stop();
});
