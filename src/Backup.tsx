import { useState } from 'react';
import { backup, backupConfigured, changedSince, lastBackup, signIn, signedIn } from './cloud';
import type { Order } from './orders';

type Status = { kind: 'idle' } | { kind: 'busy' } | { kind: 'ok'; text: string } | { kind: 'error'; text: string };

const time = (t: number) => new Date(t).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });

const withTimeout = <T,>(p: Promise<T>, ms: number) =>
  Promise.race([p, new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);

const message = (e: unknown) => {
  const code = (e as { code?: string })?.code ?? (e as Error)?.message ?? '';
  if (/invalid-credential|wrong-password|user-not-found|invalid-email/.test(code)) return 'Wrong email or password.';
  if (/permission-denied/.test(code)) return 'This login may not back up. Check the Firestore rules.';
  return 'No internet? Orders are safe here. Try again later.';
};

export default function Backup({ orders, deleted, onDone }: { orders: Order[]; deleted: string[]; onDone: (deleted: string[]) => void }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [login, setLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, refresh] = useState(0);

  const last = lastBackup();
  const pending = changedSince(orders, last).length + deleted.length;

  const run = async () => {
    setStatus({ kind: 'busy' });
    try {
      if (!(await withTimeout(signedIn(), 15000))) {
        setStatus({ kind: 'idle' });
        setLogin(true);
        return;
      }
      const r = await withTimeout(backup(orders, deleted), 30000);
      onDone(r.deleted);
      setStatus({ kind: 'ok', text: r.sent || r.deleted.length ? `✓ ${r.sent} orders backed up` : '✓ Already backed up' });
      refresh((n) => n + 1);
    } catch (e) {
      setStatus({ kind: 'error', text: message(e) });
    }
  };

  const submitLogin = async () => {
    setStatus({ kind: 'busy' });
    try {
      await withTimeout(signIn(email.trim(), password), 15000);
      setLogin(false);
      setPassword('');
      await run();
    } catch (e) {
      setStatus({ kind: 'error', text: message(e) });
    }
  };

  const tap = () => {
    if (!backupConfigured) {
      setStatus({ kind: 'error', text: 'Backup is not set up yet (Firebase config missing).' });
      return;
    }
    if (status.kind !== 'busy') run();
  };

  const sub =
    status.kind === 'busy'
      ? 'Backing up…'
      : pending > 0
        ? `${pending} not backed up`
        : last
          ? `✓ ${time(last)}`
          : 'Never';

  return (
    <>
      <button className={`backup ${pending > 0 ? 'pending' : ''}`} onClick={tap} disabled={status.kind === 'busy'}>
        ☁ Backup <small>{sub}</small>
      </button>

      {(status.kind === 'ok' || status.kind === 'error') && !login && (
        <button className={`toast ${status.kind}`} onClick={() => setStatus({ kind: 'idle' })}>
          {status.text}
        </button>
      )}

      {login && (
        <div className="sheet" onClick={() => setLogin(false)}>
          <form
            className="login"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              submitLogin();
            }}
          >
            <h2>Sign in for backup</h2>
            <p className="hint">Once on this iPad. The café's Firebase login.</p>
            <input type="email" autoComplete="username" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {status.kind === 'error' && <p className="login-error">{status.text}</p>}
            <div className="login-actions">
              <button type="button" onClick={() => setLogin(false)}>
                Cancel
              </button>
              <button type="submit" className="go" disabled={status.kind === 'busy' || !email || !password}>
                {status.kind === 'busy' ? 'Signing in…' : 'Sign in & back up'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
