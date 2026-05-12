import { useState, useEffect } from 'react';

function getNetworkType() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) return 'unknown';

  const downlink = conn.downlink;
  const effectiveType = conn.effectiveType;

  if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
  if (downlink > 10) return 'fast';
  if (downlink > 1) return 'medium';
  return 'slow';
}

export default function useNetworkType() {
  const [networkType, setNetworkType] = useState(getNetworkType);

  useEffect(() => {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return;

    const handler = () => setNetworkType(getNetworkType());
    conn.addEventListener('change', handler);
    return () => conn.removeEventListener('change', handler);
  }, []);

  return networkType;
}
