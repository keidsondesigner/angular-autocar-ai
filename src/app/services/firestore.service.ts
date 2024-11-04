import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  Firestore,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDhmfwRBHAwY-y9pkR8jDuKSBJISH0LsjY',
  authDomain: 'angular-chat-ai.firebaseapp.com',
  projectId: 'angular-chat-ai',
  storageBucket: 'angular-chat-ai.firebasestorage.app',
  messagingSenderId: '406027339034',
  appId: '1:406027339034:web:a1e34ecf64357849ec58a3',
};

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private db: Firestore;

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    const carsCollection = collection(this.db, 'cars');
  }

  async getCarData(): Promise<any[]> {
    try {
      const carsCollection = collection(this.db, 'cars');
      const snapshot = await getDocs(carsCollection);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching car data:', error);
      return [];
    }
  }
}
