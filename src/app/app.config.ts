import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';
//import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [/*provideNativeDateAdapter(),*/ provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
  provideFirebaseApp(() => initializeApp({ "projectId": "rikaso", 
    "appId": "1:1023143787977:web:f8f3ebe24eb17a6678fc18", 
    //"databaseURL": "https://angular-4e797-default-rtdb.firebaseio.com", 
    "storageBucket": "rikaso.firebasestorage.app", 
    "apiKey": "A", 
    "authDomain": "rikaso.firebaseapp.com", 
    "messagingSenderId": "1023143787977" })), 
    provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()), provideStorage(() => getStorage())]
};
