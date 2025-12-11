import { useEffect, useState } from 'react';
import { Smartphone, CheckCircle } from 'lucide-react';

export function PWAStatus() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);
    
    // Check if installed
    if (standalone || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }
  }, []);

  if (!isInstalled) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-green-900">
          App installed successfully!
        </p>
        <p className="text-xs text-green-700">
          Running in standalone mode
        </p>
      </div>
      <Smartphone className="w-5 h-5 text-green-600" />
    </div>
  );
}
