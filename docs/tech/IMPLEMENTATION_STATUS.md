# IMPLEMENTATION_STATUS

## Cel dokumentu
Ten plik opisuje aktualny stan repo po wygenerowaniu skeletonu MVP.
Ma rozdzielać:
- decyzje docelowe,
- aktualny kod,
- luki implementacyjne.

## Status ogólny
Repo jest na etapie:
- gotowego szkieletu technicznego,
- uporządkowanej dokumentacji,
- podstawowej infrastruktury developerskiej,
- placeholderów dla większości modułów biznesowych.

To nie jest jeszcze działająca implementacja MVP.

## Co jest już realnie w repo

### Struktura aplikacji
Istnieją katalogi i pliki:
- `src/config/`
- `src/routes/`
- `src/controllers/`
- `src/services/`
- `src/repositories/`
- `src/middleware/`
- `src/validators/`
- `src/lib/`
- `src/views/`
- `src/public/`
- `src/db/`
- `scripts/db/`

### Infrastruktura
Istnieją:
- `Dockerfile`
- `docker-compose.yml`
- `.env.example`
- `.gitignore`
- `.dockerignore`
- `README.md`
- `tailwind.config.js`
- `postcss.config.js`
- `package.json`

### Podstawy runtime
Istnieją:
- `src/app.js`
- `src/server.js`
- konfiguracja env w `src/config/env.js`
- konfiguracja PostgreSQL w `src/config/database.js`
- konfiguracja sesji w `src/config/session.js`

## Co działa jako szkielet

### Routing
Trasy są fizycznie zdefiniowane w:
- `src/routes/public.routes.js`
- `src/routes/auth.routes.js`
- `src/routes/user.routes.js`
- `src/routes/admin.routes.js`

### Widoki
Istnieją placeholdery:
- stron publicznych,
- auth,
- user,
- admin,
- widoków shared.

### Middleware
Istnieją szkielety:
- `attach-current-user`
- `require-auth`
- `require-admin`
- `error-handler`
- `csrf-protection`

## Co jest jeszcze placeholderem

### Auth
- logowanie jest tymczasowym mockiem w kontrolerze,
- brak prawdziwego sprawdzania użytkownika i hasła,
- brak prawdziwej rejestracji do bazy,
- brak finalnej rotacji sesji po logowaniu.

### CSRF
`src/middleware/csrf-protection.js` jest tylko placeholderem.
Dokumentacja wymaga realnej ochrony CSRF, ale nie jest ona jeszcze zaimplementowana.

### Dane i baza
- `src/db/migrations/0001_init_schema.sql` nie zawiera jeszcze finalnego schematu,
- `src/db/seeds/0001_seed_dev.sql` nie zawiera jeszcze realnego seeda MVP,
- repozytoria i serwisy nie mają logiki SQL ani use-case'ów.

### Walidacja
Pliki w `src/validators/` istnieją, ale są puste.

### UI
- layouty i partiale są obecne, ale w wersji minimalnej,
- brak finalnego złożenia ekranów zgodnie z makietami Stitch,
- brak finalnego builda CSS używanego jako jedyne źródło stylu produkcyjnego.

## Infrastruktura: stan aktualny

### Docker Compose
Compose uruchamia 3 serwisy:
- `app`
- `db`
- `smtp` (Mailpit)

### SMTP
SMTP jest przygotowany infrastrukturalnie, ale:
- nie ma jeszcze logiki aplikacyjnej, która go używa,
- zmienne `SMTP_*` są placeholderami na przyszłe etapy.

### Sesje
Aktualny kod używa:
- `express-session`
- `connect-pg-simple`
- tabeli `user_sessions` tworzonej automatycznie przez store

To oznacza, że sesja jest projektowana jako store w PostgreSQL, nie jako pamięciowy store developerski.

## Główne luki przed implementacją MVP
- prawdziwy schemat SQL,
- prawdziwy seed danych,
- realna autoryzacja i rejestracja,
- realna walidacja,
- realne CRUD dla user/admin,
- realne generowanie i zapis inspiracji,
- realne operacje anonimowej skrzynki,
- finalne wyrenderowanie UI zgodnie z dokumentami i materiałami Stitch.

## Zasada dla kolejnych agentów
- Nie zakładaj, że istniejąca struktura oznacza gotową funkcję.
- Jeśli plik ma TODO, placeholder lub mock, traktuj to jako część szkieletu.
- Najpierw sprawdź ten dokument, potem przejdź do odpowiednich plików w `docs/tech/`.
