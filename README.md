# dlaczegozyc.pl - MVP Skeleton

Repo zawiera szkielet techniczny i infrastrukturę developerską pod MVP.
Na tym etapie celowo nie ma logiki biznesowej modułów.

## Stos
- Node.js
- Express
- EJS
- Tailwind CSS (miejsce pod integrację)
- PostgreSQL
- Docker + Docker Compose

## Struktura
Kluczowe katalogi:
- `src/` - aplikacja i warstwy techniczne
- `src/views/` - layouty, partiale i placeholdery ekranów
- `src/db/` - migracje, seedy i SQL
- `scripts/db/` - skrypty uruchamiania migracji i seedów
- `docker/` - pliki pomocnicze dla kontenerów
- `docs/` - dokumentacja produktu, UI i techniki

Punkt wejścia do dokumentacji:
- `docs/README.md`

Aktualny stan skeletonu:
- `docs/tech/IMPLEMENTATION_STATUS.md`

## Konfiguracja środowiska
1. Skopiuj `.env.example` do `.env`.
2. Uzupełnij wartości:
   - `SESSION_SECRET`
   - `POSTGRES_PASSWORD`
   - `DATABASE_URL`
   - `ADMIN_SEED_LOGIN`
   - `ADMIN_SEED_PASSWORD`
   - dane SMTP (`SMTP_*`) zgodnie ze środowiskiem.

`ADMIN_SEED_*` oraz `SMTP_*` są obecnie przygotowane jako infrastructural placeholders.

## Uruchomienie lokalne (bez Dockera)
1. Zainstaluj zależności:
   - `npm install`
2. Uruchom bazę PostgreSQL lokalnie i ustaw `DATABASE_URL` w `.env`.
3. Uruchom migracje i seed (placeholdery):
   - `npm run db:migrate`
   - `npm run db:seed`
4. Start aplikacji:
   - `npm run dev`

Aplikacja domyślnie działa na `http://localhost:3000`.

## Uruchomienie Docker Compose
1. Upewnij się, że masz `.env` (na bazie `.env.example`) lub użyj wartości domyślnych z `docker-compose.yml`.
2. Start:
   - `docker compose up --build`
3. Aplikacja:
   - `http://localhost:3000`
4. SMTP UI (Mailpit):
   - `http://localhost:8025`

## Co jest celowo puste
- logika biznesowa kontrolerów i serwisów,
- właściwe walidacje payloadów,
- finalna implementacja CSRF,
- właściwe migracje i seedy danych MVP,
- finalna integracja builda Tailwind CSS.

Te elementy mają być uzupełniane w kolejnych krokach implementacji.

