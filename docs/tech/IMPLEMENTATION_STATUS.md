# IMPLEMENTATION_STATUS

## Cel dokumentu
Ten plik opisuje aktualny stan implementacji repo `dlaczegozyc.pl`.
Rozdziela decyzje docelowe od aktualnego kodu i pozostałych luk.

## Status ogólny
Repo jest na etapie kompletnego MVP:
- działająca publiczna część aplikacji,
- działający system auth (rejestracja, logowanie, wylogowanie, reset hasła),
- działające ustawienia użytkownika (profil, email, hasło),
- działający panel użytkownika z CRUD wpisów,
- działający panel admina z CRUD inspiracji, CRUD sekcji pomocy, moderacją wiadomości i podglądem wpisów,
- gotowa infrastruktura developerska (Docker/Podman, PostgreSQL, SMTP).

## Co działa w pełni

### Publiczna część
- strona główna `/`,
- ściana inspiracji `/inspirations`,
- szczegół inspiracji `/inspirations/:id`,
- generator inspiracji `/inspirations/generator` (GET + POST),
- anonimowa skrzynka `/anonymous-box` (GET + POST),
- potwierdzenie `/anonymous-box/sent`,
- sekcja pomocy `/help`.

### System auth
- rejestracja `/register` (GET + POST) — bcrypt hashing, walidacja, duplikaty loginów,
- logowanie `/login` (GET + POST) — weryfikacja bcrypt, regeneracja sesji,
- wylogowanie `POST /logout` — niszczenie sesji, czyszczenie cookie,
- ekran wymagania logowania `/auth-required`,
- odzyskiwanie hasła `/forgot-password` (GET + POST) — token SHA-256, email przez nodemailer,
- nowe hasło `/reset-password/:token` (GET + POST) — weryfikacja tokenu, wygasanie,
- ekran wygasłego/nieprawidłowego tokenu.

### Strefa po zalogowaniu
- dashboard `/dashboard` — powitanie z imieniem, szybki dostęp, ostatnia aktywność,
- moje wpisy `/my-entries` — lista wpisów użytkownika, stan pusty,
- nowy wpis `/entries/new` + `POST /entries` — walidacja, zapis,
- edycja wpisu `/entries/:id/edit` + `POST /entries/:id` — sprawdzenie właściciela,
- ustawienia `/settings` — profil (imię, nazwisko), email, zmiana hasła, wylogowanie.

### Panel admina
- dashboard `/admin` — podsumowanie: liczba wiadomości, inspiracji, wpisów; skróty do zarządzania,
- **inspiracje** — pełny CRUD:
  - lista `/admin/inspirations` z filtrem statusu, edycja/usuwanie inline,
  - nowa inspiracja `/admin/inspirations/new` (GET) + `POST /admin/inspirations`,
  - edycja `/admin/inspirations/:id/edit` (GET) + `POST /admin/inspirations/:id`,
  - usuwanie `POST /admin/inspirations/:id/delete`,
- **sekcje pomocy** — pełny CRUD:
  - lista `/admin/help` z kolejnością, statusem, edycja/usuwanie inline,
  - nowa sekcja `/admin/help/new` (GET) + `POST /admin/help`,
  - edycja `/admin/help/:id/edit` (GET) + `POST /admin/help/:id`,
  - usuwanie `POST /admin/help/:id/delete`,
- **anonimowe wiadomości** — moderacja:
  - lista `/admin/messages` ze statusami (nowa/przeczytana/archiwum),
  - podgląd `/admin/messages/:id`,
  - zmiana statusu `POST /admin/messages/:id/status`,
  - usuwanie `POST /admin/messages/:id/delete`,
- **wpisy użytkowników** — podgląd i edycja:
  - lista `/admin/entries` z autorem i statusem,
  - edycja `/admin/entries/:id/edit` (GET) + `POST /admin/entries/:id` (tytuł, treść, status),
  - usuwanie `POST /admin/entries/:id/delete`.

### Middleware
- `attach-current-user` — udostępnia `currentUser`, `isAuthenticated`, `isAdmin` w `res.locals`,
- `require-auth` — przekierowanie do `/auth-required`,
- `require-admin` — sprawdzenie roli admin, render 403,
- `csrf-protection` — placeholder (token pusty, middleware przepuszcza),
- `error-handler` — 404 i 500 z layoutem publicznym.

### Baza danych
Schemat:
- `users` — id, login, password_hash, is_admin, email, first_name, last_name,
- `entries` — id, user_id, title, body, status,
- `inspirations` — id, emoji, title, content, source, status, created_by_user_id,
- `anonymous_messages` — id, body, status,
- `help_sections` — id, category, title, body, display_order, status,
- `password_reset_tokens` — id, user_id, token_hash, expires_at, used_at.

Migracje: `0001_init_schema.sql`, `0002_auth_profile_reset.sql`.
Seed: admin (admin123), user/Aleksandra (user123), inspiracje, wiadomości, pomoc, wpisy.

### Widoki EJS
Działające widoki z designem Stitch AI:
- publiczne: home, inspiration-wall, inspiration-detail, inspiration-generator, anonymous-box, anonymous-box-sent, help,
- auth: register, login, auth-required, forgot-password, reset-password, reset-password-invalid,
- user: dashboard, my-entries, entry-create, entry-edit, settings,
- admin: dashboard, inspirations-list, inspiration-form, messages-list, message-view, help-list, help-form, entries-list, entry-edit,
- shared: error, not-found, forbidden.

Partiale: head, header, navigation-public, navigation-user, navigation-admin, flash-messages, empty-state, footer.

### Infrastruktura
- Docker/Podman: PostgreSQL 16-alpine, obraz aplikacji Node.js 20-alpine,
- SMTP: konfiguracja w `src/config/env.js`, `src/lib/mailer.js` z nodemailer,
- sesje: `express-session` + `connect-pg-simple`,
- hasła: `bcrypt` (SALT_ROUNDS = 12).

## Co jest jeszcze placeholderem

### CSRF
`src/middleware/csrf-protection.js` jest placeholderem — token jest pusty, middleware przepuszcza.
Przed produkcją wymaga podpięcia realnej biblioteki CSRF.

### Funkcje user poza CRUD wpisów
- brak kasowania wpisów przez użytkownika (admin może),
- brak zmiany statusu wpisów przez użytkownika (admin może),
- brak potwierdzenia email.

## Główne luki przed produkcją
- CSRF z prawdziwym tokenem,
- rate-limiting na logowanie i reset hasła,
- potwierdzenie zmiany emaila (opcjonalne w MVP),
- wersja desktop panelu admina (mobile-first działa, desktop wymaga sidebar).

## Zasada dla kolejnych agentów
- Publiczna część, auth, panel użytkownika i panel admina są gotowe do użycia.
- CSRF wymaga podpięcia prawdziwej biblioteki.
- Nie zakładaj, że placeholder oznacza gotową funkcję.
