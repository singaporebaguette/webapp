import { Store } from 'src/data';

export const storesToMapFeatures = (stores: Store[]) => {
  const features = stores.map((r) => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: [r.coordinates?.lat, r?.coordinates?.lng] as [number, number],
    },
    properties: r as any,
  }));

  return features;
};
