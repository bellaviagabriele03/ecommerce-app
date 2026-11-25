# 🛒 ShopNova: E-commerce in React

> Un e-commerce completo (dimostrativo) costruito con **React** e **Supabase**: catalogo con ricerca/filtri, carrello e wishlist persistenti, checkout multi-step e area utente con autenticazione e storico ordini.

🔗 **Demo live:** [https://ecommerce-gabriele.vercel.app/](https://ecommerce-gabriele.vercel.app/)
📂 **Codice:** [https://github.com/bellaviagabriele03/ecommerce-app](https://github.com/bellaviagabriele03/ecommerce-app)

---

## 📖 Descrizione

**ShopNova** è un negozio online fittizio realizzato per mettere in pratica un flusso e-commerce reale, dalla scoperta del prodotto fino alla conferma dell'ordine. Nessun pagamento reale viene effettuato: i dati di pagamento sono simulati.

Il progetto nasce con l'obiettivo di affrontare problemi concreti dello sviluppo front-end: gestione dello stato globale, form complessi con validazione, rotte protette, integrazione con un backend reale, performance e accessibilità. Il design segue un mockup Figma dedicato (palette, tipografia e componenti nel kit UI incluso in `src/assets/mockup`).

## ✨ Funzionalità

- 🛍️ **Catalogo prodotti** con pagina di dettaglio per ogni articolo
- 🔍 **Ricerca in tempo reale** (con debounce), **filtri** per categoria, prezzo, valutazione e disponibilità, e **ordinamento**
- 🔗 **Filtri e paginazione salvati nell'URL**: ogni ricerca è condivisibile tramite link
- 🛒 **Carrello globale** (`useReducer` + Context) con modifica delle quantità e persistenza su `localStorage`
- ❤️ **Wishlist** dei prodotti preferiti, persistente
- 💳 **Checkout in 3 step** (spedizione → pagamento → riepilogo) con validazione React Hook Form + Zod e codice sconto
- 🔐 **Registrazione e login** via Supabase Auth, con rotte protette per profilo e storico ordini
- 📦 **Storico ordini** salvato su Postgres (Supabase), con Row Level Security: ogni utente legge solo i propri ordini
- 🌍 **Bilingue EN/IT** con selettore paese in navbar: cambia lingua su tutto il sito e adatta il form di spedizione (CAP a 5 cifre e Provincia per l'Italia, ZIP e State per gli USA)
- 🔔 **Notifiche toast** (carrello, wishlist) e **messaggio temporaneo** per il codice sconto, più **skeleton loader** al posto degli spinner
- 📱 **Design responsive mobile-first** (menu a scomparsa su mobile), con transizioni di pagina leggere (Framer Motion)
- ♿ **Accessibilità**: aria-label, navigazione da tastiera, contrasti del tema scuro pensati per la leggibilità
- ⚡ **Performance**: route in lazy loading (`React.lazy`/`Suspense`), immagini con `loading="lazy"`
- ✅ **Test automatici** (Vitest + Testing Library) e **CI** (GitHub Actions) su ogni push

## 🧰 Tecnologie utilizzate

| Ambito | Strumenti |
|---|---|
| Front-end | React 19, Vite, JavaScript (ES6+) |
| Stile | Tailwind CSS v4 |
| Routing | React Router v8 |
| Gestione stato | Context API, `useReducer` |
| Form e validazione | React Hook Form, Zod |
| Animazioni | Framer Motion |
| Backend e autenticazione | Supabase (Postgres + Auth, Row Level Security) |
| Test | Vitest, React Testing Library |
| CI/CD | GitHub Actions, Vercel |

## 🚀 Avvio in locale

```bash
# 1. Clona il repository
git clone https://github.com/bellaviagabriele03/ecommerce-app.git

# 2. Entra nella cartella
cd ecommerce-app

# 3. Installa le dipendenze
npm install

# 4. Crea il file delle variabili d'ambiente
cp .env.example .env
# poi inserisci URL e anon key del tuo progetto Supabase (Project Settings → API)

# 5. Avvia il server di sviluppo
npm run dev
```

Altri comandi utili:

```bash
npm run build   # build di produzione
npm run test    # esegue i test
npm run lint    # controlla il codice
```

Senza un progetto Supabase collegato, il sito funziona comunque (catalogo, carrello, wishlist, checkout): solo login/registrazione/storico ordini restano disattivati.

## 👤 Account demo

Per provare l'app senza registrarti:

- **Email:** `demo@shopnova.store`
- **Password:** `ShopNova2026!`

Codice sconto da provare al checkout: `WELCOME10`

## 🗂️ Struttura del progetto

```
src/
├── components/   # componenti riutilizzabili (Navbar, ProductCard, FormField...)
├── pages/        # pagine dell'applicazione (incluse account/ e checkout/)
├── context/      # stato globale (carrello, wishlist, auth, toast)
├── hooks/        # custom hooks (useCart, useAuth, useDebounce...)
├── services/     # API locale dei prodotti, client Supabase, storico ordini
└── utils/        # funzioni di supporto (formatPrice...)
```

## 🧠 Sfide affrontate

- **Stato del carrello:** gestito con `useReducer` e Context per mantenere la logica prevedibile e testabile, con persistenza su `localStorage` tramite un hook `useLocalStorage` riutilizzabile anche per la wishlist.
- **Filtri condivisibili:** sincronizzazione di categoria, prezzo, rating, ricerca, ordinamento e pagina con i parametri dell'URL, così il browser e i link restano coerenti.
- **Checkout multi-step:** validazione per ogni step con Zod e React Hook Form, condividendo i dati tra gli step con il contesto delle rotte annidate di React Router, evitando di perdere le informazioni inserite tra un passaggio e l'altro.
- **Checkout guest vs. account:** il mockup mostrava un checkout accessibile senza login (con un link "Log in" opzionale); l'ordine viene comunque salvato su Supabase solo se l'utente è autenticato, altrimenti resta visibile solo nella pagina di conferma.
- **Permessi del database:** Row Level Security da sola non basta su Supabase se la tabella è creata da SQL Editor — serve anche una `GRANT` esplicita ad `authenticated` perché Postgres valuti le policy.

## 🔮 Possibili miglioramenti futuri

- Pagamenti reali in modalità test con Stripe
- Pannello admin per gestire i prodotti
- Recensioni degli utenti
- Sincronizzazione di carrello e wishlist su Supabase (oggi solo `localStorage`)
- Foto prodotto reali al posto dei placeholder generici attuali

## 📬 Contatti

**Gabriele Bellavia**
💼 [LinkedIn](https://www.linkedin.com/in/gabriele-bellavia-7052233b4/?isSelfProfile=true) · ✉️ bellaviagabriele03@gmail.com

---

⭐ Se il progetto ti è piaciuto, lascia una stella al repository!
