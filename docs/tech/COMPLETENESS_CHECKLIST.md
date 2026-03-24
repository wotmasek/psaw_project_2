# COMPLETENESS_CHECKLIST

## Cel dokumentu
Ta checklista służy do szybkiej kontroli, czy plan techniczny MVP `dlaczegozyc.pl` obejmuje wszystkie wymagane obszary i czy nic nie zostało pominięte między dokumentacją produktu, UI i techniką.

## Zakres objęty kontrolą
- auth,
- role,
- public,
- user,
- admin,
- data,
- routes,
- UI,
- error states,
- empty states,
- security,
- PostgreSQL,
- Docker,
- Docker Compose,
- deployment.

## Checklista kompletności

### 1. Auth
- [x] Jest decyzja o logowaniu sesyjnym.
- [x] Jest decyzja o rejestracji, logowaniu i wylogowaniu.
- [x] Jest określone zachowanie po poprawnej rejestracji.
- [x] Jest opis ochrony tras i obsługi `auth_required`.
- [x] Jest wskazane minimum bezpieczeństwa dla sesji i haseł.

### 2. Role
- [x] Są opisane role `guest`, `user`, `admin`.
- [x] Jest opisana granica uprawnień user/admin.
- [x] Jest decyzja, skąd bierze się konto admina.

### 3. Public
- [x] Strona główna jest objęta planem.
- [x] Ściana inspiracji jest objęta planem.
- [x] Generator inspiracji jest objęty planem.
- [x] Anonimowa skrzynka jest objęta planem.
- [x] Sekcja pomocy jest objęta planem.
- [x] Publiczne auth jest objęte planem.

### 4. User
- [x] Jest dashboard użytkownika.
- [x] Jest lista własnych wpisów.
- [x] Jest tworzenie wpisu.
- [x] Jest edycja własnego wpisu.
- [x] Jest sprawdzanie własności rekordu.

### 5. Admin
- [x] Jest dashboard admina.
- [x] Jest wspólny moduł zarządzania treściami.
- [x] Jest edycja wpisów, wiadomości i inspiracji.
- [x] Jest zmiana statusów.
- [x] Jest zarządzanie sekcją pomocy.

### 6. Data
- [x] Są opisane encje `users`, `entries`, `inspirations`, `anonymous_messages`, `help_sections`.
- [x] Są opisane relacje.
- [x] Są opisane statusy treści.
- [x] Jest decyzja o seedzie.
- [x] Jest decyzja o minimalizacji danych.

### 7. Routes
- [x] Jest `GET /`.
- [x] Są opisane trasy `GET` i `POST` dla public, auth, user i admin.
- [x] Jest rozwiązana niejednoznaczność admin/inspiracje.
- [x] Jest opis użycia stanów shared.

### 8. UI
- [x] Architektura uwzględnia jeden system layoutów i partiali.
- [x] Są rozdzielone konteksty `public`, `user`, `admin`.
- [x] Jest decyzja o kanonicznych nazwach z `SCREENS.md`.
- [x] Jest opis relacji między dokumentacją a materiałami Stitch.

### 9. Error states
- [x] Jest opis `403`.
- [x] Jest opis `404`.
- [x] Jest opis `500`.
- [x] Jest decyzja o wspólnym `ErrorState`.

### 10. Empty states
- [x] Jest decyzja o wspólnym `EmptyState`.
- [x] Dashboard usera uwzględnia pusty stan.
- [x] Lista wpisów usera uwzględnia pusty stan.
- [x] Listy admina mogą korzystać z tego samego wzorca.

### 11. Security
- [x] Jest CSRF dla formularzy.
- [x] Jest walidacja po stronie serwera.
- [x] Są zapytania parametryzowane.
- [x] Jest zakaz logowania danych wrażliwych.
- [x] Jest opis ochrony sesji.

### 12. PostgreSQL
- [x] PostgreSQL jest wskazany jako docelowa baza MVP.
- [x] Są migracje.
- [x] Jest seed.
- [x] Są indeksy minimalne.

### 13. Docker
- [x] Jest rola Dockera w MVP.
- [x] Są zasady dla `Dockerfile`.
- [x] Jest wskazane minimalne użycie kontenerów.

### 14. Docker Compose
- [x] Jest układ `app + db`.
- [x] Jest trwały wolumen dla bazy.
- [x] Jest healthcheck.
- [x] Jest konfiguracja env.

### 15. Deployment
- [x] Jest minimum wdrożeniowe.
- [x] Jest wymaganie HTTPS dla produkcji.
- [x] Jest rozdzielenie migracji i seeda.
- [x] Jest lista plików operacyjnych repo.

## Świadomie wycięte z MVP
- [x] komentarze,
- [x] polubienia,
- [x] system znajomych,
- [x] wiadomości między użytkownikami,
- [x] odzyskiwanie hasła,
- [x] social login,
- [x] rozbudowane profile,
- [x] PWA,
- [x] aplikacja mobilna,
- [x] płatności,
- [x] rozbudowana moderacja,
- [x] dark mode.

## Drugi przebieg kontrolny

### Co zostało domknięte
- `docs/tech` przestał być pustym miejscem i stał się spójnym planem implementacji.
- Została rozpisana struktura repo oraz warstwy aplikacji.
- Zostały domknięte luki w auth, rolach, modelu danych i routingu.
- Została opisana obsługa public/user/admin oraz wspólnych stanów UI.
- Zostały dopisane zasady PostgreSQL, Docker, Compose, env i bezpieczeństwa.

### Co było ryzykowne i zostało rozwiązane
- Rozjazd między `SCREENS.md` i nazwami Stitch: rozwiązany przez przyjęcie nazw kanonicznych z dokumentacji.
- Brak osobnego ekranu admin inspiracji: rozwiązany przez wspólny moduł administracyjny treści.
- Nieokreślone statusy treści: rozwiązane przez minimalny słownik statusów per encja.
- Niejednoznaczność po rejestracji: rozwiązana przez przekierowanie do logowania.

### Co nadal wymaga dyscypliny przy implementacji
- Nie rozdmuchać modelu danych o pola "na później".
- Nie skopiować 1:1 ozdobników i dark mode z wygenerowanych ekranów Stitch.
- Nie pominąć CSRF, walidacji i kontroli właściciela wpisu.
- Nie rozbić jednej nawigacji na osobne lokalne wyjątki.

## Otwarte decyzje niskiego ryzyka
Te elementy nie blokują planu technicznego, ale przy implementacji trzeba je po prostu wybrać konsekwentnie:
- konkretna biblioteka migracji,
- konkretna biblioteka do walidacji formularzy,
- finalna wersja builda Tailwind CSS,
- sposób przechowywania sesji między restartami w środowisku demonstracyjnym.
