# 🚴 MyDeli — Tracker Kuriera Rowerowego

Kompletna aplikacja PWA do śledzenia jazd delivery dla kurierów rowerowych.
Śledź zarobki, kilometry, czas pracy i analizuj statystyki.

## ✨ Funkcjonalności

- **📅 Kalendarz** — wizualny przegląd jazd z kolorami wg zarobków
- **➕ Dodawanie jazd** — formularz z auto-kalkulacją stawki godzinowej
- **📊 Statystyki** — wykresy, porównania miesięczne, cele
- **🔥 Real-time** — synchronizacja danych w czasie rzeczywistym (Firebase)
- **📱 PWA** — instalowalna na telefonie jak natywna aplikacja
- **🌙 Dark/Light mode** — przełączanie motywu
- **📥 Export CSV** — eksport danych do pliku CSV
- **🔐 Autentykacja** — Google OAuth + email/hasło

## 🛠 Stack technologiczny

| Warstwa | Technologia |
|---|---|
| Frontend | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Backend | Firebase Firestore |
| Auth | Firebase Authentication |
| State | Zustand |
| Wykresy | Recharts |
| Ikony | Lucide React |
| Routing | React Router v6 |
| PWA | vite-plugin-pwa |

## 🚀 Uruchomienie

### Wymagania
- Node.js 18+
- npm 9+

### Instalacja i uruchomienie

```bash
# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:5173`

### Build produkcyjny

```bash
npm run build
npm run preview
```

## 📁 Struktura projektu

```
src/
├── components/
│   ├── Calendar/          # Komponenty kalendarza
│   ├── Forms/             # Formularze (dodawanie jazd)
│   ├── Stats/             # Komponenty statystyk
│   └── Layout/            # Layout i nawigacja
├── pages/                 # Strony aplikacji
├── hooks/                 # Custom hooks (useAuth, useRides, useStats)
├── lib/                   # Firebase config, utilities
├── store/                 # Zustand store
└── types/                 # TypeScript interfaces
```

## 🔒 Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## 📱 Instalacja PWA

1. Otwórz aplikację w Chrome na telefonie
2. Kliknij "Dodaj do ekranu głównego"
3. Aplikacja zainstaluje się jak natywna

## 📄 Licencja

© 2026 MyDeli — Wszystkie prawa zastrzeżone.
