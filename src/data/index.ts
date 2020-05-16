import data from './singapore-baguette.json';

export type Coordinates = {
  lat: number;
  lng: number;
};

export enum Feature {
  EatIn = 'eat-in',
  Delivery = 'delivery',
}

export type Store = {
  id: string;

  /*
  "createdate": {
    "_seconds": 1589378711,
    "_nanoseconds": 592000000
  },
  "lastupdate": {
    "_seconds": 1589378711,
    "_nanoseconds": 592000000
  },
  */

  description: string;
  title: string;

  coordinates: Coordinates;
  mark: number;
  approved: number;

  // "createdby": "aksels.ledins@gmail.com",

  features: Feature[];

  price: number;

  // "updatedby": "aksels.ledins@gmail.com"
};

export default data as Store[];
