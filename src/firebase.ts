// Loaded only when backing up (see cloud.ts).
import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getFirestore, writeBatch } from 'firebase/firestore/lite';
import type { Order } from './orders';

const app = (config: FirebaseOptions) => (getApps().length ? getApp() : initializeApp(config));

export async function signedIn(config: FirebaseOptions) {
  const auth = getAuth(app(config));
  await auth.authStateReady();
  return auth.currentUser !== null;
}

export async function signIn(config: FirebaseOptions, email: string, password: string) {
  await signInWithEmailAndPassword(getAuth(app(config)), email, password);
}

// One document per order: orders/{id}. Firestore takes 500 writes per batch.
export async function upload(config: FirebaseOptions, orders: Order[], deleted: string[]) {
  const db = getFirestore(app(config));
  const writes = [
    ...orders.map((o) => (b: ReturnType<typeof writeBatch>) => b.set(doc(db, 'orders', o.id), JSON.parse(JSON.stringify(o)))),
    ...deleted.map((id) => (b: ReturnType<typeof writeBatch>) => b.delete(doc(db, 'orders', id))),
  ];
  for (let i = 0; i < writes.length; i += 450) {
    const batch = writeBatch(db);
    writes.slice(i, i + 450).forEach((w) => w(batch));
    await batch.commit();
  }
}
