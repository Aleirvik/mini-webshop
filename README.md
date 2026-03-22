# Mini Webshop – Enkel frontend‑demo

Dette prosjektet er en liten, fler-sidet nettbutikk bygget med **HTML, CSS, TypeScript, JSON og Vite**.  
Målet har vært å lære praktisk frontend‑utvikling og demonstrere hvordan man kan strukturere en enkel webapplikasjon som henter data dynamisk og bygger UI med DOM‑manipulasjon.

Prosjektet viser:
- lasting og parsing av **JSON-data**
- bruk av **fetch()** for å hente data
- visning av produkter i et grid
- navigasjon med URL-parametere (`?id=1`)
- dynamisk generering av HTML‑innhold med TypeScript
- enkel og ryddig filstruktur
- bruk av **TypeScript‑typer** for trygg datastruktur
- kjøring av prosjekt med **Vite** (dev-server + build)

---

## Funksjonalitet

### ✔ Landingsside  
En enkel forside med bilde, introduksjon og navigasjon.

### ✔ Produktliste (`products.html`)  
Viser produkter hentet fra `products.json` med `fetch()` og generert via DOM.

### ✔ Produktside (`product.html?id=...`)  
Viser detaljer for et enkelt produkt basert på ID i URL-en.

### ✔ Ren og oversiktlig struktur  

mini-webshop/
│
├── index.html
├── products.html
├── product.html
├── products.json
│
├── assets/
│   ├── style.css
│   └── images/
│
└── src/
    ├── main.ts
    ├── products.ts
    ├── product.ts
    └── types.d.ts
