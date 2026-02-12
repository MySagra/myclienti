# MySagra Customer App 🍕

[![Build and Push Docker Image](https://github.com/mysagra/myclienti/actions/workflows/publish.yml/badge.svg)](https://github.com/mysagra/myclienti/actions/workflows/publish.yml)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

Un'applicazione web moderna e responsive per la gestione degli ordini dei clienti durante sagre ed eventi. Costruita con Next.js 16 e React 19, offre un'esperienza utente fluida per la navigazione del menu, la gestione del carrello e l'invio degli ordini.

## ✨ Funzionalità

- 🍽️ **Menu Interattivo** - Navigazione per categorie con immagini e dettagli dei prodotti
- 🛒 **Carrello Dinamico** - Gestione ordini in tempo reale con drawer laterale
- 📱 **Design Responsive** - Ottimizzato per dispositivi mobili e desktop
- 🎨 **UI Moderna** - Interfaccia pulita con TailwindCSS e Radix UI
- 🔄 **Aggiornamenti Real-time** - Sincronizzazione stato con React Query
- ✅ **Validazione** - Form e dati validati con Zod e React Hook Form
- 🐳 **Docker Ready** - Deploy semplificato con Docker e Docker Compose

## 🚀 Prerequisiti

- **Node.js** 20.x o superiore
- **pnpm** 9.x o superiore (consigliato) oppure npm/yarn
- **Docker** e **Docker Compose** (opzionale, per deploy containerizzato)

## 📦 Installazione

### Installazione Locale

1. **Clona il repository**
   ```bash
   git clone https://github.com/mysagra/myclienti.git
   cd myclienti
   ```

2. **Installa le dipendenze**
   ```bash
   pnpm install
   ```

3. **Configura le variabili d'ambiente**
   ```bash
   cp .env.template .env.local
   ```
   
   Modifica `.env.local` con i tuoi valori:
   ```env
   MYSAGRA_API_URL=https://your-api-url.com
   ```

4. **Avvia il server di sviluppo**
   ```bash
   pnpm dev
   ```

5. **Apri il browser** su [http://localhost:3000](http://localhost:3000)

### Installazione con Docker

1. **Clona il repository** (se non l'hai già fatto)
   ```bash
   git clone https://github.com/mysagra/myclienti.git
   cd myclienti
   ```

2. **Configura le variabili d'ambiente**
   
   Crea un file `.env` nella root del progetto:
   ```env
   MYSAGRA_API_URL=https://your-api-url.com
   ```

3. **Avvia con Docker Compose**
   ```bash
   docker compose up -d
   ```

4. **Accedi all'applicazione** su [http://localhost:3030](http://localhost:3030)

## ⚙️ Configurazione

### Variabili d'Ambiente

| Variabile | Descrizione | Richiesta | Default |
|-----------|-------------|-----------|---------|
| `MYSAGRA_API_URL` | URL del backend API MySagra | Sì | - |
| `NODE_ENV` | Ambiente di esecuzione | No | `production` |

### Build di Produzione

```bash
# Build locale
pnpm build
pnpm start

# Build Docker
docker build -t mysagra-customer-app .
docker run -p 3000:3000 -e MYSAGRA_API_URL=https://api.example.com mysagra-customer-app
```

## 🛠️ Tech Stack

### Core
- **[Next.js 16](https://nextjs.org/)** - Framework React con App Router
- **[React 19](https://react.dev/)** - Libreria UI
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### UI & Styling
- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Componenti accessibili headless
- **[Lucide React](https://lucide.dev/)** - Icone moderne
- **[Vaul](https://vaul.emilkowal.ski/)** - Drawer componenti
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### State Management & Data Fetching
- **[TanStack Query](https://tanstack.com/query/)** - Server state management
- **React Context** - Client state management

### Form & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - Schema validation

### DevOps
- **[Docker](https://www.docker.com/)** - Containerization
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD
- **[GitHub Container Registry](https://ghcr.io)** - Docker image hosting

## 📁 Struttura del Progetto

```
myclienti/
├── app/                      # Next.js App Router
│   ├── (login)/             # Gruppo route login
│   ├── api/                 # API Routes
│   │   ├── orders/          # Gestione ordini
│   │   └── proxy/uploads/   # Proxy immagini
│   ├── cart/                # Pagina carrello
│   ├── confirmation/        # Conferma ordine
│   ├── menu/                # Menu e categorie
│   └── layout.tsx           # Layout root
├── components/              # Componenti React riutilizzabili
│   └── ui/                  # Componenti UI base
├── context/                 # React Context providers
├── schemas/                 # Zod validation schemas
├── services/                # Servizi API
├── lib/                     # Utility functions
└── public/                  # Static assets
```

## 🔧 Comandi Disponibili

```bash
# Sviluppo
pnpm dev          # Avvia dev server
pnpm build        # Build production
pnpm start        # Avvia production server
pnpm lint         # Linting con ESLint

# Docker
docker compose up -d              # Avvia containers
docker compose down               # Ferma containers
docker compose up -d --build      # Rebuild e avvia
docker compose logs -f myclienti  # Visualizza log
```

## 🚢 Deploy

### GitHub Container Registry

Il progetto è configurato con GitHub Actions per il deploy automatico su GitHub Container Registry ad ogni release.

1. **Configura il secret** `MYSAGRA_API_URL` nelle impostazioni del repository
2. **Crea una release** per triggerare la build automatica
3. **Pull dell'immagine**:
   ```bash
   docker pull ghcr.io/mysagra/mysagra-myclienti:latest
   ```

### Deploy Manuale

```bash
# Login a GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Build e push
docker build -t ghcr.io/mysagra/mysagra-myclienti:latest .
docker push ghcr.io/mysagra/mysagra-myclienti:latest
```

## 🤝 Contribuire

I contributi sono benvenuti! Segui questi passi:

1. Fai un fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Committa le tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Pusha sul branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è rilasciato sotto licenza **GNU General Public License v3.0**. Vedi il file [LICENSE](LICENSE) per maggiori dettagli.

## 📧 Contatti

Per domande, suggerimenti o supporto, apri una [issue](https://github.com/mysagra/myclienti/issues) su GitHub.

---

Sviluppato con ❤️ per MySagra
