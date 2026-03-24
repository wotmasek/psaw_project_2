# FUNKCJONALNOŚCI

## Rola tego pliku
Ten plik jest krótką mapą modułów MVP.
Nie zastępuje:
- `docs/core/MVP_SCOPE.md` w zakresie granic MVP,
- `docs/core/USER_FLOWS.md` w zakresie przebiegu użytkownika,
- `docs/tech/ROUTES.md` w zakresie tras,
- `docs/tech/DATA_MODELS.md` w zakresie danych.

## Cel aplikacji
Aplikacja ma pomagać osobie w kryzysie psychicznym poprzez:
- codzienną inspirację,
- anonimowe opisanie sytuacji,
- jasne wskazanie, gdzie szukać pomocy.

## Moduły MVP

### Public
- strona główna,
- ściana inspiracji,
- generator inspiracji,
- anonimowa skrzynka,
- sekcja pomocy,
- rejestracja,
- logowanie.

### User
- panel użytkownika,
- lista własnych wpisów,
- dodawanie wpisów,
- edycja własnych wpisów.

### Admin
- panel administratora,
- zarządzanie wszystkimi treściami,
- zmiana statusów,
- zarządzanie sekcją pomocy,
- zarządzanie inspiracjami.

## Zasady dostępu
- gość widzi tylko część publiczną,
- user widzi część publiczną i własne dane,
- admin ma dostęp do całego panelu administracyjnego,
- zwykły użytkownik nie edytuje cudzych treści.

## Relacja do reszty dokumentacji
- Szczegółowe ekrany: `docs/ui/SCREENS.md`
- Szczegółowe flow: `docs/core/USER_FLOWS.md`
- Szczegółowe role i auth: `docs/tech/AUTH.md`
- Szczegółowe trasy: `docs/tech/ROUTES.md`
- Szczegółowe dane: `docs/tech/DATA_MODELS.md`

## Zasada
Najpierw działający przepływ i zgodność z MVP.
Kosmetyka i dodatki dopiero po domknięciu podstaw.