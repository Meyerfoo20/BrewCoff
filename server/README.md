# BrewCoff server (Express + Stripe Test Mode)

Flöde: **React → Express (`/api/checkout`) → Stripe Checkout → tillbaka till sidan → Express kontrollerar betalningen → order sparas i Firestore**

## Kom igång (en gång)

1. Skapa ett gratis konto på https://dashboard.stripe.com och slå på **Test mode**.
2. Developers → API keys → kopiera **Secret key** (`sk_test_...`).
3. Kopiera `.env.example` till `.env` i den här mappen och klistra in nyckeln.
   `.env` ligger i `.gitignore` – den får aldrig pushas till GitHub.
4. `cd server` → `npm install`

## Köra lokalt (två terminaler)

```
cd server && npm run dev      # backend på http://localhost:4242
npm run dev                   # frontend (i projektroten)
```

Vite skickar alla `/api`-anrop vidare till servern (se `vite.config.js`).

## Testkort

| Kort | Resultat |
|---|---|
| `4242 4242 4242 4242` | Lyckad betalning |
| `4000 0000 0000 9995` | Nekas (otillräckligt saldo) |
| `4000 0025 0000 3155` | Kräver 3D Secure |

Valfritt framtida datum, valfri CVC och valfritt postnummer. Betalningarna syns i Stripe Dashboard → Payments.

## Endpoints

- `POST /api/checkout` – body `{ items: [{ id, qty }] }` → `{ url }` till Stripes betalsida.
  Priserna hämtas från Firestore på servern; klientens priser används aldrig.
- `GET /api/checkout/:sessionId` – kontrollerar att betalningen gick igenom, returnerar rader, total och kvittolänk.

## Publicering (Render – allt i en tjänst)

Express serverar både API:t och den byggda React-appen (`dist/`), så hela sidan har en adress.

1. render.com → logga in med GitHub → **New → Web Service** → välj repot `BrewCoff`.
2. Inställningar:
   - Branch: `main` (eller den gren ni publicerar från)
   - Root Directory: *(tomt)*
   - Build Command: `npm run render-build`
   - Start Command: `npm start`
   - Instance type: **Free**
3. Environment → lägg till `STRIPE_SECRET_KEY` = test-nyckeln. (Adressen hittar servern själv via `RENDER_EXTERNAL_URL`.)
4. Deploy. Sidan hamnar på `https://<namn>.onrender.com`. Varje push till grenen publicerar om automatiskt.
5. Firebase Console → Authentication → Settings → **Authorized domains** → lägg till `<namn>.onrender.com`, annars fungerar inte inloggningen.

Obs: gratisservern somnar efter ~15 min utan besök och tar upp till en minut att vakna.
Öppna sidan en stund innan ni demar.
