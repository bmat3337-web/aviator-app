import { AviatorProductionApp } from '../src/ui/AviatorProductionApp';
import { SimulatorProvider } from '../src/domain/simulator';

const provider = new SimulatorProvider('AVIATOR-DEMO-001', 0);

export default function Page() {
  return <AviatorProductionApp provider={provider} />;
}
