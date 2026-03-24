# ARCHITECTURE

## Cel dokumentu
Ten dokument opisuje docelową strukturę techniczną repozytorium dla MVP `dlaczegozyc.pl`.
Ma być praktycznym planem implementacji dla stosu Node.js + Express + EJS + Tailwind CSS + PostgreSQL.

## Kontekst MVP
Źródłem prawdy dla zakresu są kolejno:
1. `docs/core/REQUIREMENTS.md`
2. `docs/funkcjonalnosci.md`
3. `docs/core/MVP_SCOPE.md`
4. `docs/core/PRODUCT.md`
5. `docs/core/USER_FLOWS.md`
6. `docs/ui/SCREENS.md`
7. `docs/ui/DESIGN_SYSTEM.md`
8. `docs/rules/ANTI_SLOP.md`

Uwaga: `docs/AGENT_MENU.md` podaje krótszą hierarchię niż `docs/rules/AI_RULES.md`. W planie technicznym obowiązuje bardziej szczegółowa kolejność z `AI_RULES.md`, bo lepiej rozstrzyga konflikty między produktem, flow i UI.

## Zasady architektoniczne
- MVP ma być małe, czytelne i wdrażalne bez dodatkowych warstw "na przyszłość".
- Architektura ma wspierać 3 konteksty aplikacji: `public`, `user`, `admin`.
- Widoki EJS mają korzystać ze wspólnych layoutów i partiali, bez kopiowania układu per ekran.
- Routing, autoryzacja i walidacja muszą być proste, ale jawne.
- Model danych ma obejmować tylko encje potrzebne do obecnego MVP.
- Docker i Docker Compose mają uprościć uruchomienie, ale nie mogą narzucać złożonej infrastruktury.

## Rzeczywisty zakres MVP

### Public
- strona główna,
- ściana inspiracji,
- generator inspiracji,
- anonimowa skrzynka,
- sekcja pomocy,
- rejestracja,
- logowanie,
- wylogowanie.

### User
- panel użytkownika,
- lista własnych wpisów,
- dodawanie własnych wpisów,
- edycja własnych wpisów.

### Admin
- panel admina,
- podgląd wszystkich treści,
- edycja wszystkich treści,
- zmiana statusów,
- zarządzanie sekcją pomocy,
- zarządzanie inspiracjami.

## Świadome decyzje MVP
- Generator inspiracji i anonimowa skrzynka pozostają publiczne. To wynika z `docs/core/MVP_SCOPE.md` i ma pierwszeństwo nad luźniejszym zapisem w przewodniku Stitch.
- Po rejestracji użytkownik trafia do logowania, nie do automatycznego zalogowania. To prostsze, czytelniejsze i bezpieczniejsze dla MVP.
- Zarządzanie inspiracjami przez admina nie wymaga osobnego obszaru produktu. W MVP ma działać jako część wspólnego modułu administracyjnego treści z filtrem typu treści.
- Ekrany `empty_state_mobile`, `error_state_mobile` i `auth_required_mobile` są wspólnymi stanami widoków, nie osobnymi modułami domenowymi.

## Docelowa struktura katalogów

```text
src/
  app.js
  server.js
  config/
    env.js
    database.js
    session.js
  routes/
    public.routes.js
    auth.routes.js
    user.routes.js
    admin.routes.js
  controllers/
    public.controller.js
    auth.controller.js
    user.controller.js
    admin.controller.js
  services/
    auth.service.js
    inspiration.service.js
    entry.service.js
    help.service.js
    anonymous-box.service.js
    admin-content.service.js
  repositories/
    users.repository.js
    entries.repository.js
    inspirations.repository.js
    anonymous-messages.repository.js
    help-sections.repository.js
  middleware/
    require-auth.js
    require-admin.js
    attach-current-user.js
    csrf-protection.js
    error-handler.js
  validators/
    auth.validator.js
    entry.validator.js
    inspiration.validator.js
    anonymous-box.validator.js
    help.validator.js
  lib/
    password.js
    flash.js
    view-models.js
  views/
    layouts/
      base.ejs
      public.ejs
      app.ejs
      admin.ejs
    partials/
      header.ejs
      navigation-public.ejs
      navigation-user.ejs
      navigation-admin.ejs
      page-header.ejs
      form-field.ejs
      flash-messages.ejs
      empty-state.ejs
      error-state.ejs
      success-state.ejs
      footer.ejs
    pages/
      public/
        home.ejs
        inspiration-wall.ejs
        inspiration-generator.ejs
        inspiration-detail.ejs
        anonymous-box.ejs
        anonymous-box-sent.ejs
        help.ejs
      auth/
        register.ejs
        login.ejs
        auth-required.ejs
      user/
        dashboard.ejs
        my-entries.ejs
        entry-create.ejs
        entry-edit.ejs
      admin/
        dashboard.ejs
        admin-entries.ejs
        admin-entry-edit.ejs
        admin-help-edit.ejs
      shared/
        error.ejs
        not-found.ejs
        forbidden.ejs
  public/
    css/
      app.css
    js/
    images/
  db/
    migrations/
    seeds/
    sql/
```

## Uzasadnienie struktury

### Dlaczego `routes -> controllers -> services -> repositories`
- `routes` mapują HTTP i middleware.
- `controllers` składają request, response i wybór widoku.
- `services` trzymają logikę aplikacyjną i zasady domenowe.
- `repositories` izolują SQL i operacje na PostgreSQL.

To jest wystarczająco czytelne dla zespołu, ale nie wprowadza nadmiarowych abstrakcji.

### Dlaczego 4 grupy tras
- `public` dla stron i formularzy dostępnych bez konta,
- `auth` dla rejestracji, logowania i wylogowania,
- `user` dla własnych wpisów użytkownika,
- `admin` dla wszystkich obszarów administracyjnych.

To odpowiada rzeczywistym rolom i flow, a nie sztucznemu podziałowi technologicznemu.

### Dlaczego wspólne partiale
Przewodnik Stitch wymaga jednego systemu UI z 3 wariantami nawigacji. Dlatego:
- nawigacja public, user i admin ma wspólną logikę i stałe miejsca w layoutach,
- stany `EmptyState`, `ErrorState`, `SuccessState` mają jedną definicję,
- formularze auth i formularze wpisów mają te same zasady pola, błędu i CTA.

## Podział na warstwy aplikacji

### 1. Warstwa HTTP
Odpowiada za:
- mapowanie metod i ścieżek,
- uruchamianie middleware,
- ochronę tras,
- przekazywanie danych do kontrolerów.

### 2. Warstwa aplikacyjna
Odpowiada za:
- scenariusze rejestracji i logowania,
- generowanie inspiracji,
- zapis anonimowych wiadomości,
- CRUD własnych wpisów,
- operacje administracyjne na treściach i pomocy.

### 3. Warstwa danych
Odpowiada za:
- relacje z PostgreSQL,
- zapytania SQL,
- seed i migracje,
- spójność nazw tabel i pól.

### 4. Warstwa prezentacji
Odpowiada za:
- layouty EJS,
- partiale,
- przekazanie bezpiecznych danych do widoku,
- spójność z `docs/ui/SCREENS.md` i `docs/ui/UI_VISION.md`.

## Obsługa kontekstów aplikacji

### Public
Używa `views/layouts/public.ejs` i `navigation-public.ejs`.
Ma być lekka, spokojna i prowadzić do jednej akcji na ekran.

### User
Używa `views/layouts/app.ejs` i `navigation-user.ejs`.
Pokazuje tylko dane przypisane do zalogowanego użytkownika.

### Admin
Używa `views/layouts/admin.ejs` i `navigation-admin.ejs`.
Daje stabilny dostęp do wszystkich obszarów zarządzania bez mieszania układów.

## Zasady dla EJS
- Nazwy widoków w implementacji mają odpowiadać nazwom ekranów z `docs/ui/SCREENS.md`, ale w wariancie czytelnym dla plików EJS.
- Layout ma odpowiadać kontekstowi, nie pojedynczemu ekranowi.
- Nie duplikować top bara, CTA, stopki i komunikatów między plikami widoków.
- Dane do widoku przygotowywać w kontrolerze lub przez prosty `view-model`, nie składać logiki warunkowej bezpośrednio w EJS.
- Domyślnie używać escaped output. Nie renderować nieprzefiltrowanego HTML z bazy.

## Zasady dla Tailwind CSS
- Korzystać z jednego builda CSS do `src/public/css/app.css`.
- Design system z `docs/ui/DESIGN_SYSTEM.md` pozostaje źródłem prawdy dla koloru, typografii i tonu.
- Bogatsze tokeny ze Stitch można traktować tylko jako mapowanie techniczne do prostego systemu kolorów, nie jako nowy system projektowy.
- Domyślny tryb to `light`. Klasy `dark:` z materiałów Stitch nie są częścią MVP i nie powinny wymuszać wdrożenia dark mode.
- Unikać dekoracji, gradientów i efektów, które nie wspierają czytelności lub działania.

## Zasady dla assetów
- Obrazy i ikony mają wspierać zaufanie i spokój, ale nie mogą stać się osią produktu.
- Lokalne assety trzymać w `src/public/images/`.
- Nie opierać finalnego produktu na zewnętrznych obrazach z wygenerowanych mockupów Stitch.

## Elementy świadomie wycięte z MVP
- komentarze,
- polubienia,
- system znajomych,
- wiadomości między użytkownikami,
- rozbudowana moderacja,
- odzyskiwanie hasła,
- logowanie społecznościowe,
- rozbudowane profile,
- dashboard analityczny,
- notyfikacje,
- PWA,
- aplikacja mobilna,
- płatności,
- rozbudowany panel zarządzania użytkownikami,
- dark mode.

## Ryzyka architektoniczne
- Najłatwiej zgubić spójność nazw między `SCREENS.md`, Stitch i trasami Express.
- Admin ma zarządzać inspiracjami, ale UI nie ma osobnego ekranu admin inspiracji. To musi być jawnie rozwiązane w routingu i module admin.
- Materiały Stitch pokazują więcej ozdobników niż wymaga MVP. Implementacja nie może kopiować ich bez selekcji.
- Ekrany puste, błędów i auth-required muszą być wspólnymi stanami systemu, a nie dodatkiem "na końcu".

## Krótka checklista architektoniczna
- Czy istnieją oddzielne moduły `public`, `auth`, `user`, `admin`?
- Czy layouty i partiale nie są duplikowane między ekranami?
- Czy każda operacja zapisu przechodzi przez walidację i serwis?
- Czy PostgreSQL jest izolowany w `repositories`?
- Czy stany `error`, `empty`, `success`, `auth_required` mają wspólne komponenty?
- Czy architektura nie wprowadza funkcji spoza MVP?
