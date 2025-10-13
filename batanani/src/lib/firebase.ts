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

const firebaseConfig = {
	apiKey: 'AIzaSyCI8BXVzEJW6q4OIk3EHZ1QFVYQNFtFtDE',
	authDomain: 'batanani-a5118.firebaseapp.com',
	projectId: 'batanani-a5118',
	storageBucket: 'batanani-a5118.firebasestorage.app',
	messagingSenderId: '562344078415',
	appId: '1:562344078415:web:997cdb2ee3619dbd0c0e3a',
	measurementId: 'G-BFWYZ1LM56',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function savePrompt(userId: string, prompt: string) {
	await setDoc(doc(db, 'prompts', userId), { prompt, timestamp: Date.now() });
}

export async function saveResult(userId: string, result: HybridResult) {
	await setDoc(doc(db, 'results', userId), {
		...result,
		timestamp: Date.now(),
	});
}
