# 🛒 ShopNova: E-commerce in React

> Un e-commerce completo (dimostrativo) costruito con **React** e **JavaScript**: catalogo, ricerca e filtri, carrello, checkout multi-step e area utente con autenticazione.

🔗 **Demo live:** [https://ecommerce-gabriele.vercel.app](https://tuo-progetto.vercel.app)
📂 **Codice:** [github.com/tuo-username/ecommerce-app](https://github.com/tuo-username/ecommerce-app)

![Anteprima del progetto](./docs/screenshot-home.png)

---

## 📖 Descrizione

**ShopNova** è un negozio online fittizio realizzato per mettere in pratica un flusso e-commerce reale, dalla scoperta del prodotto fino alla conferma dell'ordine. Nessun pagamento reale viene effettuato: i dati di pagamento sono simulati.

Il progetto nasce con l'obiettivo di affrontare problemi concreti dello sviluppo front-end: gestione dello stato globale, form complessi con validazione, rotte protette, integrazione con un backend, performance e accessibilità.

## ✨ Funzionalità

- 🛍️ **Catalogo prodotti** con pagina di dettaglio per ogni articolo
- 🔍 **Ricerca in tempo reale** (con debounce), **filtri** per categoria, prezzo e valutazione, e **ordinamento**
- 🔗 **Filtri salvati nell'URL**: ogni ricerca è condivisibile tramite link
- 🛒 **Carrello globale** con modifica delle quantità e persistenza dopo il refresh
- ❤️ **Wishlist** dei prodotti preferiti
- 💳 **Checkout in più step** con validazione dei dati e codice sconto
- 🔐 **Registrazione e login**, con rotte protette
- 📦 **Storico ordini** per ogni utente
- 🌙 **Dark mode** e design **responsive** (mobile-first)
- ♿ Attenzione ad **accessibilità** e **performance** (lazy loading, Lighthouse > 90)

## 🧰 Tecnologie utilizzate

| Ambito | Strumenti |
|---|---|
| Front-end | React, Vite, JavaScript (ES6+) |
| Routing | React Router |
| Gestione stato | Context API, `useReducer` |
| Form e validazione | React Hook Form, Zod |
| Stile | CSS Modules |
| Backend e autenticazione | Firebase |
| Test | Vitest, React Testing Library |
| Deploy | Vercel |

## 🚀 Avvio in locale

```bash
# 1. Clona il repository
git clone https://github.com/tuo-username/ecommerce-app.git

# 2. Entra nella cartella
cd ecommerce-app

# 3. Installa le dipendenze
npm install

# 4. Crea il file delle variabili d'ambiente
cp .env.example .env
# poi inserisci le tue chiavi Firebase nel file .env

# 5. Avvia il server di sviluppo
npm run dev
```

Altri comandi utili:

```bash
npm run build   # build di produzione
npm run test    # esegue i test
npm run lint    # controlla il codice
```

## 👤 Account demo

Per provare l'app senza registrarti:

- **Email:** `demo@shopnova.com`
- **Password:** `demo1234`

Codice sconto da provare al checkout: `WELCOME10`

## 🗂️ Struttura del progetto

```
src/
├── components/   # componenti riutilizzabili
├── pages/        # pagine dell'applicazione
├── context/      # stato globale (carrello, auth, wishlist)
├── hooks/        # custom hooks
├── services/     # chiamate API e backend
└── utils/        # funzioni di supporto
```

## 🧠 Sfide affrontate

- **Stato del carrello:** gestito con `useReducer` e Context per mantenere la logica prevedibile e testabile, con persistenza su `localStorage`.
- **Filtri condivisibili:** sincronizzazione dei filtri con i parametri dell'URL, così il browser e i link restano coerenti.
- **Checkout multi-step:** validazione per ogni step con Zod e React Hook Form, evitando di perdere i dati inseriti tra un passaggio e l'altro.
- **Rotte protette:** reindirizzamento degli utenti non autenticati e regole di sicurezza sul database, per far leggere a ciascuno solo i propri ordini.

## 🔮 Possibili miglioramenti futuri

- Pagamenti reali in modalità test con Stripe
- Pannello admin per gestire i prodotti
- Recensioni degli utenti
- Prodotti correlati e raccomandazioni

## 📬 Contatti

**Il tuo nome**
💼 [LinkedIn](https://www.linkedin.com/in/gabriele-bellavia-7052233b4/?isSelfProfile=true) · 🌐 [Portfolio](https://tuo-portfolio.dev) · ✉️ bellaviagabriele03@gmail.com

---

⭐ Se il progetto ti è piaciuto, lascia una stella al repository!
