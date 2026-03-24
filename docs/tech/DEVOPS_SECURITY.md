# DEVOPS_SECURITY

## Cel dokumentu
Ten dokument opisuje minimalne zasady utrzymania i bezpieczeństwa dla MVP `dlaczegozyc.pl`.
Zakres obejmuje:
- PostgreSQL,
- migracje i seed,
- zmienne środowiskowe,
- Docker,
- Docker Compose,
- logowanie,
- podstawy wdrożenia.

Opisuje docelową bazę infrastruktury oraz stan obecnego skeletonu repo.

## Zasada nadrzędna
Devops w MVP ma upraszczać uruchomienie i utrzymanie projektu.
Nie budujemy infrastruktury większej niż potrzeba do lokalnego developmentu, demonstracji i prostego wdrożenia.

## PostgreSQL

### Dlaczego PostgreSQL
- pasuje do trwałego modelu danych wymaganego przez projekt,
- wspiera relacje i indeksy bez dodatkowej warstwy,
- dobrze działa z Docker Compose,
- jest wystarczający dla całego MVP.

### Zasady
- Jedna baza aplikacyjna dla całego MVP.
- Osobny użytkownik bazy dla aplikacji.
- Schemat zmieniany wyłącznie przez migracje.
- Seed odtwarzalny i bezpieczny do uruchomienia wiele razy.

### Minimalne wymagania
- baza developerska,
- baza testowa lub osobny schemat testowy, jeśli testy zostaną dodane,
- jawna konfiguracja połączenia przez env.

### Aktualny skeleton repo
- `src/config/database.js` korzysta z `DATABASE_URL`,
- `docker/postgres-init/01-init.sql` włącza `pgcrypto`,
- pełny schemat aplikacyjny nie został jeszcze zapisany w migracji.

## Migracje i seed

### Migracje
Każda zmiana modelu danych musi mieć migrację.

Minimalne obszary migracji:
- `users`,
- `entries`,
- `inspirations`,
- `anonymous_messages`,
- `help_sections`,
- indeksy i klucze obce.

### Seed
Seed ma tworzyć:
- konto admina,
- konto zwykłego użytkownika,
- przykładowe inspiracje,
- przykładowe wpisy,
- anonimowe wiadomości,
- sekcje pomocy.

### Zasada operacyjna
- seed nie może wymagać ręcznej edycji danych w kodzie,
- hasła seedowe muszą być jawnie opisane tylko w dokumentacji developerskiej lub `.env.example`,
- dane seedowe nie mogą wyglądać jak produkcyjne dane wrażliwe.

## Zmienne środowiskowe

### Minimalny zestaw
- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `SESSION_SECRET`
- `APP_BASE_URL`

### Opcjonalne
- `ADMIN_SEED_LOGIN`
- `ADMIN_SEED_PASSWORD`
- `ADMIN_SEED_IS_ACTIVE`
- `SESSION_COOKIE_NAME`
- `SESSION_COOKIE_SECURE`
- `SESSION_COOKIE_SAME_SITE`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM_NAME`
- `SMTP_FROM_EMAIL`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX_REQUESTS`
- `BODY_LIMIT`
- `TRUST_PROXY`

### Zasady
- Sekrety tylko w env, nigdy w repo.
- Repo powinno mieć `.env.example` bez wartości wrażliwych.
- Konfiguracja środowisk ma być prosta: `development`, `test`, `production`.

## Docker

### Rola Dockera w projekcie
Docker nie jest celem samym w sobie.
Ma:
- przyspieszać uruchomienie,
- ujednolicać środowisko,
- uprościć setup dla zespołu i prowadzącego.

### Minimalne zasady dla `Dockerfile`
- używać konkretnej wersji Node.js,
- uruchamiać aplikację jako użytkownik nie-root, jeśli to możliwe,
- oddzielić instalację zależności od kopiowania kodu,
- nie pakować do obrazu plików lokalnych `.env`,
- trzymać końcowy obraz możliwie mały i czytelny.

### Co nie jest potrzebne w MVP
- orkiestracja wieloserwisowa poza `app + db`,
- osobne obrazy dla workerów,
- reverse proxy w osobnym kontenerze, jeśli nie ma realnej potrzeby.

## Docker Compose

### Minimalny zakres
`docker-compose.yml` powinien spinać:
- `app`,
- `db`.

W aktualnym repo Compose zawiera także:
- `smtp` (Mailpit) jako developerski serwis testowy.

### Zasady dla `app`
- zależność od bazy,
- dostęp do env,
- komenda uruchomieniowa czytelna dla developmentu,
- wolumen developerski tylko jeśli realnie przyspiesza pracę.

### Zasady dla `db`
- trwały wolumen danych,
- jawne porty tylko gdy potrzebne lokalnie,
- podstawowy healthcheck.

### Zasady dla `smtp`
- serwis pomocniczy tylko dla developmentu,
- nie jest jeszcze używany przez logikę aplikacyjną,
- służy do bezpiecznego testowania przyszłych flow opartych o SMTP.

### Rekomendowany healthcheck
- baza zgłasza gotowość przed pełnym startem aplikacji,
- aplikacja przy błędzie połączenia powinna logować problem czytelnie i kończyć start albo ponawiać próbę w prosty sposób.

### Zgodność z aktualnym repo
- `docker-compose.yml` ma healthcheck bazy,
- `app` zależy od `db` i `smtp`,
- `Dockerfile` używa `node:20-alpine`,
- kontener aplikacji działa jako użytkownik `node`.

## Bezpieczeństwo aplikacyjne

### Formularze i requesty
- Wszystkie `POST` z EJS mają przechodzić przez CSRF.
- Walidacja wejścia po stronie serwera jest obowiązkowa.
- Długość pól tekstowych musi być ograniczona.

### Hasła i sesje
- Hasła haszować standardową biblioteką.
- Sesje trzymać po stronie serwera.
- Cookie sesyjne: `httpOnly`, `sameSite=lax`, `secure` w produkcji.
- Rotować identyfikator sesji po logowaniu.

### Dostęp i dane
- Każda akcja user/admin sprawdzana po stronie serwera.
- Nie logować haseł, sekretów, identyfikatorów sesji i pełnych treści wrażliwych wiadomości.
- Anonimowa skrzynka nie może zostać przypadkiem powiązana z użytkownikiem.

### SQL i dane
- Tylko zapytania parametryzowane.
- Żadnego składania SQL z surowych danych użytkownika.

## Logowanie i obserwowalność

### Co logować
- start aplikacji,
- błędy połączenia z bazą,
- błędy wewnętrzne 500,
- nieudane logowania w formie zanonimizowanej,
- start migracji i seeda.

### Czego nie logować
- haseł,
- treści anonimowych wiadomości,
- pełnych danych sesji,
- sekretów środowiskowych.

### Poziom MVP
Wystarczy prosty logger tekstowy lub JSON.
Nie wprowadzamy pełnego stacku monitoringu.

## Deployment

### Minimalny cel wdrożeniowy
Projekt ma dać się:
- uruchomić lokalnie,
- uruchomić kontenerowo,
- opisać w README tak, by osoba trzecia mogła go postawić bez zgadywania.

### Minimum dla środowiska produkcyjnego
- HTTPS przed aplikacją,
- poprawnie ustawione env,
- migracje uruchamiane jawnie,
- seed tylko w środowiskach testowych i demonstracyjnych,
- regularny backup bazy, jeśli aplikacja ma być używana dłużej niż demo.

### Czego nie zakładamy w MVP
- autoscalingu,
- CI/CD z wieloma etapami,
- blue/green deploy,
- zewnętrznych kolejek,
- osobnych środowisk preview dla każdego brancha.

## Struktura plików operacyjnych
Rekomendowane pliki w repo:
- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`
- `.env.example`
- `README.md`

Opcjonalnie:
- `docker/entrypoint.sh`
- `docker/postgres-init/`
- `scripts/db/`

## Ryzyka i miejsca łatwe do pominięcia
- Uruchomienie aplikacji bez migracji i seeda.
- Trzymanie `SESSION_SECRET` w repo.
- Brak trwałego wolumenu dla PostgreSQL.
- Brak healthchecka bazy przy Compose.
- Logowanie treści anonimowej skrzynki.
- Seed z hasłem admina zaszytym na stałe w dokumentacji publicznej.

## Krótka checklista devops i security
- Czy baza jest konfigurowana przez env?
- Czy istnieją migracje i seed?
- Czy kontenery obejmują wymagane serwisy developerskie (`app`, `db`, opcjonalnie `smtp`)?
- Czy PostgreSQL ma trwały wolumen?
- Czy sesje i hasła są zabezpieczone?
- Czy CSRF i walidacja są uwzględnione?
- Czy README opisuje uruchomienie lokalne i kontenerowe?
