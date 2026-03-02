export const pushDataLayer = (data: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    const w = window as unknown as { dataLayer: object[] };

    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(data);
  }
};
