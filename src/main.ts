import { createRoot } from 'react-dom/client';
import { SimulatorProvider } from './domain/simulator';
import { AviatorProductionApp } from './ui/AviatorProductionApp';

const provider = new SimulatorProvider('AVIATOR-DEMO-001', 0);
const root = document.getElementById('app');
if (!root) throw new Error('AVIATOR application root was not found');

createRoot(root).render(<AviatorProductionApp provider={provider} />);

provider.start();
const timer = window.setInterval(() => {
  provider.advance();
  if (provider.snapshot().round.state === 'RESULT') provider.advance();
}, 350);
window.addEventListener('beforeunload', () => {
  window.clearInterval(timer);
  provider.stop();
});
