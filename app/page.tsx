'use client';

import { useEffect, useState } from 'react';
import { SimulatorProvider } from '../src/domain/simulator';
import { AviatorProductionApp } from '../src/ui/AviatorProductionApp';

export default function Page() {
  const [provider] = useState(() => new SimulatorProvider('AVIATOR-DEMO-001', 0));

  useEffect(() => {
    provider.start();
    const timer = window.setInterval(() => {
      provider.advance();
      if (provider.snapshot().round.state === 'RESULT') provider.advance();
    }, 350);

    return () => {
      window.clearInterval(timer);
      provider.stop();
    };
  }, [provider]);

  return <AviatorProductionApp provider={provider} />;
}
