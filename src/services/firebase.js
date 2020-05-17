import * as firebase from 'firebase/app';
import 'firebase/analytics';

import firebaseConfig from 'src/config/firebaseConfig';

firebase.initializeApp(firebaseConfig);
firebase.analytics();
