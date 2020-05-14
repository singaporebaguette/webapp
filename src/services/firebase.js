import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/analytics';

import firebaseConfig from '../firebaseConfig';

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();

export const getStores = () => {
  return db.collection('stores');
};
