# ama coffee · Orders

Tap-to-order app for the iPad at the counter. Works with no internet: orders
are saved on the device. **☁ Backup** copies new and changed orders to Cloud
Firestore, only when tapped.

- Menu and prices: `src/menu.ts` (RSD).
- `npm run dev` → http://localhost:5300 (also on the Wi-Fi address, for the iPad).
- Offline start needs the https site (service worker, `public/sw.js`); the dev server has none.

## Backup setup (once)

1. https://console.firebase.google.com → **Add project**.
2. **Build → Firestore Database → Create database** (production mode, region `eur3` or a Europe one).
3. **Build → Authentication → Get started → Email/Password → Enable**; then **Users → Add user**:
   the café login (email + password).
4. **Firestore → Rules**: paste `firestore.rules` (it allows only the café user's UID) → **Publish**.
5. **Project settings → Your apps → Web (`</>`)** → register an app → copy the config into
   `.env.local` (names in `.env.example`), and on Vercel as environment variables.
6. On the iPad: tap **☁ Backup**, sign in once with the café login.

Backups land in Firestore as `orders/{id}`, one document per order. Deleting an order
here deletes it from the backup at the next backup.
