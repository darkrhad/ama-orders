// Backup to Cloud Firestore, only when the Backup button is tapped.
// The app never needs the internet: orders live on the device, this copies them.
// Firebase loads on the first backup, so the app starts without it.

import type { Order } from './orders';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const backupConfigured = Boolean(config.apiKey && config.projectId);

const LAST_KEY = 'ama-orders-last-backup';

export function lastBackup(): number {
  try {
    return Number(localStorage.getItem(LAST_KEY)) || 0;
  } catch {
    return 0;
  }
}

export const changedSince = (orders: Order[], since: number) =>
  orders.filter((o) => (o.updatedAt ?? o.createdAt) > since);

let firebase: Promise<typeof import('./firebase')> | null = null;
const load = () => (firebase ??= import('./firebase'));

export async function signedIn(): Promise<boolean> {
  if (!backupConfigured) return false;
  const f = await load();
  return f.signedIn(config);
}

export async function signIn(email: string, password: string) {
  const f = await load();
  await f.signIn(config, email, password);
}

// Uploads what changed since the last backup and removes deleted orders.
export async function backup(orders: Order[], deleted: string[]) {
  const started = Date.now();
  const changed = changedSince(orders, lastBackup());
  const f = await load();
  await f.upload(config, changed, deleted);
  try {
    localStorage.setItem(LAST_KEY, String(started));
  } catch {
    // the next backup just sends a little more
  }
  return { sent: changed.length, deleted };
}
