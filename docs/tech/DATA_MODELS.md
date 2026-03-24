# DATA_MODELS

## Cel dokumentu
Ten dokument opisuje minimalny model danych dla MVP `dlaczegozyc.pl`.
Opis jest architektoniczny: wskazuje encje, relacje, pola kluczowe i zasady przechowywania danych.

To jest model docelowy.
Aktualne pliki SQL w repo są jeszcze skeletonem, nie pełną implementacją tego modelu.

## Założenia modelu
- Dane mają być trwałe i przechowywane w PostgreSQL.
- Model ma wspierać wyłącznie zakres MVP.
- Nazwy tabel i pól mają być proste, spójne i przewidywalne.
- Każda tabela produkcyjna powinna mieć `id`, `created_at`, `updated_at`.

## Główne encje

### 1. `users`
Cel:
- konto użytkownika,
- logowanie,
- rozróżnienie `user` i `admin`.

Minimalne pola:
- `id`,
- `login`,
- `password_hash`,
- `is_admin`,
- `created_at`,
- `updated_at`.

Zasady:
- `login` jest unikatowy,
- hasło jest przechowywane wyłącznie jako hash,
- w MVP nie przechowujemy rozbudowanego profilu.

### 2. `entries`
Cel:
- własne wpisy zalogowanych użytkowników,
- podgląd i edycja tylko przez właściciela,
- administracyjne zarządzanie treścią.

Minimalne pola:
- `id`,
- `user_id`,
- `title`,
- `body`,
- `status`,
- `created_at`,
- `updated_at`.

Relacja:
- wiele wpisów należy do jednego użytkownika.

Uwaga:
- `title` może być krótkie, ale pomaga w czytelnej liście wpisów.
- Jeśli zespół chce uproszczenia do jednego pola treści, można zredukować `title`, ale domyślnie rekomendowany jest tytuł + treść.

### 3. `inspirations`
Cel:
- ściana inspiracji,
- szczegół inspiracji,
- wynik generatora inspiracji,
- zarządzanie inspiracjami przez admina.

Minimalne pola:
- `id`,
- `emoji`,
- `title`,
- `content`,
- `source`,
- `status`,
- `created_by_user_id`,
- `created_at`,
- `updated_at`.

Znaczenie pól:
- `source`: `manual` lub `generator`,
- `created_by_user_id`: opcjonalne; w generatorze publicznym może być `null`,
- `status`: stan publikacji i administracji.

### 4. `anonymous_messages`
Cel:
- przechowanie wiadomości z anonimowej skrzynki.

Minimalne pola:
- `id`,
- `body`,
- `status`,
- `created_at`,
- `updated_at`.

Zasady:
- brak `user_id`,
- brak danych osobowych,
- brak pola kontaktowego w MVP,
- tylko minimalna treść potrzebna do realizacji celu.

### 5. `help_sections`
Cel:
- sekcja pomocy widoczna publicznie,
- prosty CRUD po stronie admina.

Minimalne pola:
- `id`,
- `category`,
- `title`,
- `body`,
- `display_order`,
- `status`,
- `created_at`,
- `updated_at`.

Zasady:
- publicznie pokazujemy tylko rekordy aktywne/opublikowane,
- `display_order` porządkuje sekcję bez dodatkowej logiki UI.

## Relacje

```text
users 1 --- n entries
users 1 --- n inspirations (opcjonalnie jako autor ręcznie dodanej inspiracji)
anonymous_messages bez relacji do users
help_sections bez relacji do users w MVP
```

## Statusy treści

### Zasada
Dokumenty mówią o "zmianie statusów", ale nie definiują dokładnego słownika. Dlatego przyjmujemy najprostszy bezpieczny zestaw statusów per typ treści.

### `entries.status`
Rekomendowane wartości:
- `active`,
- `saved`,
- `archived`.

Uzasadnienie:
- odpowiada to stanom widocznym w `my_entries_mobile`,
- pozwala adminowi zmieniać status bez budowania moderacji.

### `inspirations.status`
Rekomendowane wartości:
- `draft`,
- `published`,
- `archived`.

### `anonymous_messages.status`
Rekomendowane wartości:
- `new`,
- `reviewed`,
- `archived`.

### `help_sections.status`
Rekomendowane wartości:
- `draft`,
- `published`.

## Zasady dla PostgreSQL
- Używać kluczy obcych tam, gdzie istnieje relacja z użytkownikiem.
- Używać indeksów przynajmniej dla:
  - `users.login`,
  - `entries.user_id`,
  - `entries.status`,
  - `inspirations.status`,
  - `anonymous_messages.status`,
  - `help_sections.status, display_order`.
- Trzymać strukturę bazy w migracjach, nie w ręcznych zmianach.
- Wszystkie zapytania wykonywać parametryzowanie.

## Zgodność z aktualnym repo
- istnieje katalog `src/db/migrations/`,
- istnieje katalog `src/db/seeds/`,
- istnieją skrypty `scripts/db/migrate.js`, `scripts/db/seed.js`, `scripts/db/reset.js`,
- plik `src/db/migrations/0001_init_schema.sql` jest jeszcze placeholderem,
- plik `src/db/seeds/0001_seed_dev.sql` jest jeszcze placeholderem.

## Seed danych
Seed ma zapewnić:
- konto administratora,
- co najmniej jednego zwykłego użytkownika,
- kilka inspiracji,
- przykładowe wpisy użytkownika,
- kilka wiadomości anonimowych,
- przykładowe sekcje pomocy.

Cel seeda:
- spełnić wymagania projektu,
- umożliwić testowanie flow pustych i niepustych stanów,
- pokazać panel admina i panel użytkownika bez ręcznego przygotowania danych.

## Minimalizacja danych
- Nie przechowujemy danych, których MVP nie używa.
- Anonimowa skrzynka nie zapisuje użytkownika, maila ani innych identyfikatorów osobowych.
- Jeśli wpis lub inspiracja nie wymaga rozbudowanych metadanych, nie dodajemy ich "na przyszłość".

## Operacje CRUD per encja

| Encja | Create | Read | Update | Delete |
|---|---|---|---|---|
| `users` | register + seed | auth/admin | ograniczone | brak w MVP |
| `entries` | user/admin | owner/admin | owner/admin | admin lub soft delete |
| `inspirations` | generator/admin | public/admin | admin | admin |
| `anonymous_messages` | public | admin | admin status | admin |
| `help_sections` | admin/seed | public/admin | admin | admin |

## Świadomie poza MVP
- komentarze i reakcje,
- wiadomości prywatne,
- załączniki plików,
- wersjonowanie treści,
- historia zmian,
- profile użytkowników,
- etykiety i tagowanie,
- pełna moderacja z kolejką review.

## Ryzyka i miejsca łatwe do pominięcia
- Mieszanie inspiracji ręcznych i generatora bez pola `source`.
- Powiązanie anonimowej skrzynki z użytkownikiem, mimo że produkt obiecuje anonimowość.
- Brak jasnych statusów dla panelu admina.
- Dodanie zbyt wielu pól "na zapas", które nie mają żadnego użycia w MVP.
