import { useEffect, useState } from 'react';

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted'|'dismissed' }> };

export default function usePWAInstall() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => setInstalled(true);

    window.addEventListener('beforeinstallprompt', onBIP);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBIP);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const canInstall = !!deferred && !installed;

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice; // opcional, pode checar outcome
    // após o prompt, alguns navegadores “consomem” o evento
    // então escondemos o botão
    setDeferred(null);
  };

  return { canInstall, install, installed };
}
