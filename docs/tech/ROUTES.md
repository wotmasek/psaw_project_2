# ROUTES

## Cel dokumentu
Ten dokument mapuje trasy HTTP na moduły aplikacji, widoki EJS i poziomy dostępu.
Ma być źródłem prawdy dla routingu Express w MVP.

Opisuje docelowy kontrakt HTTP i układ modułów.
Aktualny stan implementacji skeletonu jest zgodny strukturalnie, ale większość akcji `POST` jest jeszcze placeholderem.

## Zasady ogólne
- Wszystkie zapisy odbywają się przez formularze HTML i `POST`.
- `GET /` jest obowiązkowe.
- Nazwy ekranów czerpiemy z `docs/ui/SCREENS.md`, ale w routingu używamy czytelnych ścieżek URL.
- Widoki wspólne (`error`, `empty`, `auth_required`) są stanami layoutu lub dedykowanymi template'ami shared, nie osobnymi modułami domenowymi.

## Podział tras
- `public` dla treści i formularzy bez logowania,
- `auth` dla rejestracji i logowania,
- `user` dla danych właściciela,
- `admin` dla zarządzania całością treści.

## Trasy publiczne

| Ścieżka | Metoda | Widok / ekran | Dostęp | Cel |
|---|---|---|---|---|
| `/` | GET | `public/home.ejs` | public | strona główna |
| `/inspirations` | GET | `public/inspiration-wall.ejs` | public | lista inspiracji |
| `/inspirations/:id` | GET | `public/inspiration-detail.ejs` | public | szczegół inspiracji |
| `/inspirations/generator` | GET | `public/inspiration-generator.ejs` | public | formularz 3 pytań |
| `/inspirations/generator` | POST | `public/inspiration-generator.ejs` | public | wygenerowanie i zapis wyniku |
| `/anonymous-box` | GET | `public/anonymous-box.ejs` | public | formularz anonimowej skrzynki |
| `/anonymous-box` | POST | redirect do `/anonymous-box/sent` | public | zapis anonimowej wiadomości |
| `/anonymous-box/sent` | GET | `public/anonymous-box-sent.ejs` | public | ekran potwierdzenia |
| `/help` | GET | `public/help.ejs` | public | sekcja pomocy |

## Trasy auth

| Ścieżka | Metoda | Widok / ekran | Dostęp | Cel |
|---|---|---|---|---|
| `/register` | GET | `auth/register.ejs` | public | formularz rejestracji |
| `/register` | POST | redirect do `/login` | public | utworzenie konta |
| `/login` | GET | `auth/login.ejs` | public | formularz logowania |
| `/login` | POST | redirect do `/dashboard` | public | logowanie i start sesji |
| `/logout` | POST | redirect do `/` | user/admin | wylogowanie |
| `/auth-required` | GET | `auth/auth-required.ejs` | public | kontrolowany ekran wymagania logowania |

## Trasy user

| Ścieżka | Metoda | Widok / ekran | Dostęp | Cel |
|---|---|---|---|---|
| `/dashboard` | GET | `user/dashboard.ejs` | user/admin | panel użytkownika |
| `/my-entries` | GET | `user/my-entries.ejs` | user/admin | lista własnych wpisów |
| `/entries/new` | GET | `user/entry-create.ejs` | user/admin | formularz nowego wpisu |
| `/entries` | POST | redirect do `/my-entries` | user/admin | zapis nowego wpisu |
| `/entries/:id/edit` | GET | `user/entry-edit.ejs` | owner/admin | formularz edycji wpisu |
| `/entries/:id` | POST | redirect do `/my-entries` | owner/admin | zapis zmian wpisu |

## Trasy admin

### Zasada
Admin zarządza treściami przez dedykowane moduły per typ: inspiracje, sekcje pomocy, wiadomości, wpisy.
Każdy typ ma osobne trasy i widoki — czytelniejsze niż uniwersalny `:kind`.

### Dashboard

| Ścieżka | Metoda | Widok / ekran | Dostęp | Cel |
|---|---|---|---|---|
| `/admin` | GET | `admin/dashboard.ejs` | admin | panel administratora |

### Inspiracje

| Ścieżka | Metoda | Widok / ekran | Dostęp | Cel |
|---|---|---|---|---|
| `/admin/inspirations` | GET | `admin/inspirations-list.ejs` | admin | lista inspiracji |
| `/admin/inspirations/new` | GET | `admin/inspiration-form.ejs` | admin | formularz nowej inspiracji |
| `/admin/inspirations` | POST | redirect do `/admin/inspirations` | admin | zapis nowej inspiracji |
| `/admin/inspirations/:id/edit` | GET | `admin/inspiration-form.ejs` | admin | formularz edycji |
| `/admin/inspirations/:id` | POST | redirect do `/admin/inspirations` | admin | zapis zmian |
| `/admin/inspirations/:id/delete` | POST | redirect do `/admin/inspirations` | admin | usunięcie |

### Sekcje pomocy

| Ścieżka | Metoda | Widok / ekran | Dostęp | Cel |
|---|---|---|---|---|
| `/admin/help` | GET | `admin/help-list.ejs` | admin | lista sekcji |
| `/admin/help/new` | GET | `admin/help-form.ejs` | admin | formularz nowej sekcji |
| `/admin/help` | POST | redirect do `/admin/help` | admin | zapis nowej sekcji |
| `/admin/help/:id/edit` | GET | `admin/help-form.ejs` | admin | formularz edycji |
| `/admin/help/:id` | POST | redirect do `/admin/help` | admin | zapis zmian |
| `/admin/help/:id/delete` | POST | redirect do `/admin/help` | admin | usunięcie |

### Anonimowe wiadomości

| Ścieżka | Metoda | Widok / ekran | Dostęp | Cel |
|---|---|---|---|---|
| `/admin/messages` | GET | `admin/messages-list.ejs` | admin | lista wiadomości |
| `/admin/messages/:id` | GET | `admin/message-view.ejs` | admin | podgląd wiadomości |
| `/admin/messages/:id/status` | POST | redirect do `/admin/messages` | admin | zmiana statusu |
| `/admin/messages/:id/delete` | POST | redirect do `/admin/messages` | admin | usunięcie |

### Wpisy użytkowników

| Ścieżka | Metoda | Widok / ekran | Dostęp | Cel |
|---|---|---|---|---|
| `/admin/entries` | GET | `admin/entries-list.ejs` | admin | lista wpisów |
| `/admin/entries/:id/edit` | GET | `admin/entry-edit.ejs` | admin | edycja wpisu |
| `/admin/entries/:id` | POST | redirect do `/admin/entries` | admin | zapis zmian |
| `/admin/entries/:id/delete` | POST | redirect do `/admin/entries` | admin | usunięcie |

## Widoki shared i stany systemowe

### `empty-state`
Nie wymaga osobnej publicznej ścieżki.
Jest używany jako wspólny partial lub dedykowany fragment widoku m.in. dla:
- dashboardu użytkownika,
- listy własnych wpisów,
- list administracyjnych,
- ewentualnie ściany inspiracji.

### `error-state`
Powinien być używany przez:
- 403,
- 404,
- 500,
- bezpieczne błędy dostępu.

### `success-state`
Jest używany dla flow typu:
- wysłanie anonimowej wiadomości,
- poprawna rejestracja jako komunikat lub redirect do `/login`,
- poprawny zapis wpisu lub pomocy.

## Powiązanie ekranów z nazwami Stitch

| Nazwa kanoniczna | Nazwa w Stitch |
|---|---|
| `home_mobile` | `home_screen_mobile_*` |
| `register_mobile` | `registration_screen_mobile_*` |
| `login_mobile` | `login_screen_mobile_*` |
| `inspiration_detail_mobile` | `inspiration_details_mobile_*` |
| `anonymous_box_sent_mobile` | `submission_successful_mobile_*` |
| `help_mobile` | `help_resources_mobile_*` |
| `admin_entries_mobile` | `admin_manage_entries_mobile_*` |
| `admin_help_edit_mobile` | `admin_edit_help_section_mobile_*` |
| `auth_required_mobile` | `authentication_required_mobile_*` |

W implementacji routingu i widoków obowiązują nazwy kanoniczne z dokumentacji, nie nazwy katalogów Stitch.

## Middleware per grupa

### Public
- `attach-current-user`,
- `csrf-protection` na formularzach z `POST`.

### Auth
- `attach-current-user`,
- `csrf-protection`,
- ochrona przed wejściem zalogowanego usera na rejestrację i logowanie może przekierowywać do `/dashboard`.

### User
- `attach-current-user`,
- `require-auth`,
- `csrf-protection`,
- sprawdzenie własności wpisu.

### Admin
- `attach-current-user`,
- `require-auth`,
- `require-admin`,
- `csrf-protection`.

## Rekomendowane nazwy modułów tras
- `public.routes.js`
- `auth.routes.js`
- `user.routes.js`
- `admin.routes.js`

## Trasy ustawień użytkownika

| Ścieżka | Metoda | Widok / ekran | Dostęp | Cel |
|---|---|---|---|---|
| `/settings` | GET | `user/settings.ejs` | user/admin | ustawienia konta |
| `/settings/profile` | POST | redirect do `/settings` | user/admin | zapis imienia i nazwiska |
| `/settings/email` | POST | redirect do `/settings` | user/admin | zmiana emaila |
| `/settings/password` | POST | redirect do `/settings` | user/admin | zmiana hasła |

## Trasy odzyskiwania hasła

| Ścieżka | Metoda | Widok / ekran | Dostęp | Cel |
|---|---|---|---|---|
| `/forgot-password` | GET | `auth/forgot-password.ejs` | public | formularz podania emaila |
| `/forgot-password` | POST | `auth/forgot-password.ejs` (sent) | public | wysyłka maila z linkiem |
| `/reset-password/:token` | GET | `auth/reset-password.ejs` | public | formularz nowego hasła |
| `/reset-password/:token` | POST | redirect do `/login` | public | zapis nowego hasła |

## Zgodność z aktualnym repo
- trasy publiczne, auth, user, admin — pliki istnieją i mają logikę,
- trasy auth implementują pełny flow: rejestracja, logowanie, wylogowanie, reset hasła,
- trasy user implementują CRUD wpisów + ustawienia konta,
- trasy admin implementują pełny CRUD inspiracji, sekcji pomocy, moderację wiadomości i zarządzanie wpisami.

## Rzeczy świadomie poza MVP
- REST API dla frontendu SPA,
- endpointy JSON dla każdej encji,
- bulk actions,
- panel zarządzania użytkownikami,
- osobne ścieżki dla komentarzy i notyfikacji.

## Ryzyka i miejsca łatwe do pominięcia
- Niespójne nazwy między widokami a folderami Stitch.
- CSRF placeholder — przed produkcją wymaga prawdziwej implementacji.
