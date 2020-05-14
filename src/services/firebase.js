import * as firebase from 'firebase/app';
import 'firebase/firestore';

import firebaseConfig from '../firebaseConfig';

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export const getStores = () => {
  return db.collection('stores');
};
