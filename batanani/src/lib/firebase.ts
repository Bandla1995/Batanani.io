// Firebase config and helpers
export type HybridResult = {
	prompt: string;
	aiResponse: string;
	translated: string;
	summary: string;
};

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Minimal Firebase initialization used by the app.
// Prefer putting real values in .env.local (NEXT_PUBLIC_FIREBASE_*)
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Initialize app (safe to call on server; Firebase checks internally)
export const firebaseApp = initializeApp(firebaseConfig);

// Common services
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export async function savePrompt(userId: string, prompt: string) {
	await setDoc(doc(db, 'prompts', userId), { prompt, timestamp: Date.now() });
}

export async function saveResult(userId: string, result: HybridResult) {
	await setDoc(doc(db, 'results', userId), {
		...result,
		timestamp: Date.now(),
	});
}
