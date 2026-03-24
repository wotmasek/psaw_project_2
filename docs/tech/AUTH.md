# AUTH

## Cel dokumentu
Ten dokument definiuje autoryzację, role i ochronę dostępu w MVP `dlaczegozyc.pl`.

Opisuje stan docelowy auth.
Aktualny stan implementacji skeletonu opisuje `docs/tech/IMPLEMENTATION_STATUS.md`.

## Założenie MVP
W MVP stosujemy klasyczne uwierzytelnianie sesyjne:
- rejestracja przez formularz HTML,
- logowanie przez formularz HTML,
- wylogowanie przez formularz `POST`,
- sesja po stronie serwera,
- role `user` i `admin`.

To podejście najlepiej pasuje do Express + EJS + formularzy serwerowych.

## Role

### Gość
Może:
- wejść na stronę główną,
- przeglądać inspiracje,
- użyć generatora inspiracji,
- wysłać wiadomość do anonimowej skrzynki,
- czytać sekcję pomocy,
- zarejestrować się,
- zalogować się.

Nie może:
- wejść do panelu użytkownika,
- dodawać i edytować własnych wpisów,
- wejść do panelu admina.

### User
Może:
- robić wszystko, co gość,
- wejść do własnego panelu,
- przeglądać tylko własne wpisy,
- dodawać własne wpisy,
- edytować tylko własne wpisy,
- wylogować się.

Nie może:
- edytować treści innych użytkowników,
- wykonywać akcji administracyjnych.

### Admin
Może:
- robić wszystko, co user,
- wejść do panelu admina,
- przeglądać wszystkie treści,
- edytować wpisy, anonimowe wiadomości i inspiracje,
- zmieniać statusy treści,
- zarządzać sekcją pomocy.

## Model konta
- Konto użytkownika ma unikatowy `login`.
- Hasło jest przechowywane jako salted hash.
- Rola admina jest utrzymywana jako pole logiczne w tabeli użytkowników.
- Konto administratora powstaje z seeda danych testowych.

Rekomendacja MVP:
- pole `is_admin boolean not null default false`,
- jedno konto admina zdefiniowane w seedzie,
- brak panelu do zarządzania rolami.

## Rejestracja

### Formularz
Pola:
- `login`,
- `password`,
- `passwordConfirmation`.

### Walidacja
- `login` jest wymagany i unikatowy,
- `password` jest wymagane,
- `passwordConfirmation` musi być zgodne z hasłem,
- komunikaty błędów są krótkie i nietechniczne.

### Zachowanie po sukcesie
Po poprawnej rejestracji użytkownik jest przekierowany do logowania.

Uzasadnienie:
- prostszy przepływ techniczny,
- mniej stanów do obsługi,
- mniejsze ryzyko błędów w sesji na starcie,
- zgodność z zasadą prostego MVP.

## Logowanie

### Formularz
Pola:
- `login`,
- `password`.

### Zachowanie po sukcesie
- sesja zostaje utworzona,
- identyfikator użytkownika trafia do sesji,
- użytkownik trafia do własnego panelu,
- jeśli konto ma `is_admin = true`, może wejść także do panelu admina.

### Zachowanie po błędzie
- brak technicznego żargonu,
- jeden prosty komunikat typu: "Nie udało się zalogować. Sprawdź login i hasło."

## Wylogowanie
- Wylogowanie odbywa się przez `POST /logout`.
- Sesja jest niszczona po stronie serwera.
- Cookie sesyjne jest czyszczone.
- Użytkownik wraca do stanu publicznego.

## Sesja

### Rekomendacja MVP
- `express-session`,
- cookie `httpOnly`,
- `sameSite=lax`,
- `secure=true` tylko w środowisku produkcyjnym z HTTPS,
- jawny `SESSION_SECRET` w zmiennych środowiskowych.

### Store sesji
- Preferowany jest store trwały.
- Jeśli projekt ma działać po restartach i w kontenerach, store nie powinien być pamięciowy.
- Aktualny skeleton repo używa PostgreSQL session store przez `connect-pg-simple`.

W MVP nie wprowadzamy JWT.

## Ochrona tras

### Middleware
- `attach-current-user` do udostępnienia bieżącego użytkownika w `res.locals`,
- `require-auth` do ochrony tras user i admin,
- `require-admin` do ochrony tras admin,
- `csrf-protection` dla formularzy zapisu.

### Zasady
- Każda trasa user wymaga sesji.
- Każda trasa admin wymaga sesji i roli admin.
- Ograniczenie "użytkownik edytuje tylko swoje dane" musi być sprawdzane po stronie serwera na podstawie właściciela rekordu.
- Samo ukrycie przycisku w UI nie jest autoryzacją.

## Macierz dostępu

| Obszar | Guest | User | Admin |
|---|---|---|---|
| Publiczne strony i formularze | tak | tak | tak |
| Rejestracja i logowanie | tak | tak | tak |
| Dashboard usera | nie | tak | tak |
| Własne wpisy | nie | tak | tak |
| Edycja własnych wpisów | nie | tak | tak |
| Panel admina | nie | nie | tak |
| Edycja wszystkich treści | nie | nie | tak |
| Zarządzanie pomocą | nie | nie | tak |

## `auth_required`, 403, 404 i błędy dostępu

### `auth_required`
To kontrolowany widok dla prób wejścia w obszar wymagający konta.
Stosować go dla wejścia z poziomu UI, gdy użytkownik nie jest zalogowany.

### 403
Stosować, gdy użytkownik jest zalogowany, ale nie ma uprawnień do zasobu lub roli.

### 404
Stosować dla brakującej ścieżki lub rekordu, którego nie ma albo nie powinien być ujawniony.

### Zasada UI
- brak żargonu,
- jasny powrót do bezpiecznego miejsca,
- jeden główny komunikat,
- brak ujawniania szczegółów technicznych.

## Minimalne bezpieczeństwo auth
- Hasła haszować standardową biblioteką, nie własnym kodem.
- Rotować identyfikator sesji po poprawnym logowaniu.
- Ograniczyć liczbę prób logowania na IP lub sesję.
- Nie logować haseł, tokenów CSRF ani treści sesji.
- Nie trzymać sekretów w repozytorium.

## Zgodność z aktualnym repo
- sesja jest już skonfigurowana w `src/config/session.js`,
- cookie sesyjne jest parametryzowane env,
- logout działa jako `POST`,
- auth controller jest jeszcze placeholderem i nie wykonuje prawdziwej autoryzacji do bazy,
- middleware CSRF jest jeszcze placeholderem.

## Elementy świadomie poza MVP
- odzyskiwanie hasła,
- logowanie przez Google i inne social loginy,
- 2FA,
- zarządzanie rolami z panelu,
- reset sesji na wszystkich urządzeniach,
- potwierdzanie maila.

## Ryzyka i miejsca łatwe do pominięcia
- Próba edycji cudzego wpisu przez bezpośredni URL.
- Brak CSRF przy formularzach EJS.
- Pozostawienie logout jako `GET`.
- Przechowywanie admina poza seedem bez jawnego procesu inicjalizacji.
- Niespójne zachowanie po rejestracji między widokiem a backendem.
