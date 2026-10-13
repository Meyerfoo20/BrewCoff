# BrewCoff

## Bidragsöversikt

Öppna `contributors.html` direkt i webbläsaren, eller kör `npm run dev` och besök
`/contributors.html` på adressen som Vite visar.

Sidan visar antal personer, commits per person och commit-meddelanden med ändrade
filer. Klicka på en person för att filtrera eller sök efter en ändring.
Statistiken gäller GitHub-projektets huvudgren och inkluderar merge-commits.
Personer grupperas efter författarnamn i Git-historiken.

Kör `npm run contributors` för att hämta den senaste historiken från GitHub och
uppdatera sidan. Det kräver Git, Node.js och nätverksåtkomst. Sidan är därefter
fristående och fungerar även offline. Layouten finns i
`scripts/contributors.template.html`.

## Betalning (Stripe Test Mode)

Kassan går via vår Express-backend i `server/`. Se [server/README.md](server/README.md) för hur
man startar den och vilka testkort man kan använda.
