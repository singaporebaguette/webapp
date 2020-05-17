import data from './singapore-baguette.json';

export type Coordinates = {
  lat: number;
  lng: number;
};

/*
  { id: 1, name: 'Delivery' },
  { id: 2, name: 'Eat-in' },
  { id: 3, name: 'Croissant' },
  { id: 4, name: 'Pain au chocolat' },
*/
export enum Feature {
  Delivery = 1,
  EatIn,
  Croissant,
  PainAuChocolat,
}

/*
  { id: 1, name: 'Approved' },
  { id: 2, name: 'Decent' },
  { id: 3, name: 'Emergency Only' },
  { id: 4, name: 'Not approved' },
*/
export enum ApprovedLevel {
  Approved = 1,
  Decent,
  EmergencyOnly,
  NotApproved,
}

export type Store = {
  id: string;

  /*
  "createdate": {
    "_seconds": 1589687473,
    "_nanoseconds": 797000000
  },
   */

  pluscode: string;
  approvedLevel: ApprovedLevel;

  title: string;
  description: string;

  address: string;
  link: string;
  features: Feature[];

  /*
  "lastupdate": {
    "_seconds": 1589687473,
    "_nanoseconds": 797000000
  },
  */

  coordinates: Coordinates;

  'google-rating': number;
  'internal-rating': number;
  hasBaguette: boolean;
};

export default data as Store[];
