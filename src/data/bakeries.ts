const bakeries = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [103.849688, 1.285187] as [number, number],
      },
      properties: {
        id: 1,
        title: 'Kayser',
        description: 'Pain ok!',
        rate: 4.3,
      },
    },
  ],
};

export default bakeries;
