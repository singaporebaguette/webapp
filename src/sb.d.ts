export enum BaguetteFilter {
  HasBaguette,
  NoBaguette,
  Both,
}

export type Filters = {
  byRating: number[];
  byBaguette: BaguetteFilter;
};

export enum Mode {
  Light = 'light',
  Dark = 'dark',
}
