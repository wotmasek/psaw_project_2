# Dokumentacja Repo

## Cel
Ten katalog jest jednym źródłem prawdy dla produktu, zakresu MVP, UI i decyzji technicznych w repo `dlaczegozyc.pl`.

Dokumentacja ma odpowiadać:
- realnemu zakresowi MVP,
- aktualnej strukturze repo,
- obecnemu stanowi implementacji,
- potrzebom kolejnych agentów pracujących nad kodem.

## Jak czytać dokumentację

### 1. Zawsze zacznij od
- `docs/AGENT_MENU.md`

### 2. Gdy chcesz zrozumieć produkt i zakres
- `docs/core/PRODUCT.md`
- `docs/core/MVP_SCOPE.md`
- `docs/core/USER_FLOWS.md`
- `docs/funkcjonalnosci.md`
- `docs/core/REQUIREMENTS.md`

### 3. Gdy pracujesz nad UI
- `docs/ui/UI_VISION.md`
- `docs/ui/DESIGN_SYSTEM.md`
- `docs/ui/SCREENS.md`
- `ui_projects /STITCH_AGENT_GUIDE.md`

### 4. Gdy pracujesz nad kodem i infrastrukturą
- `docs/tech/ARCHITECTURE.md`
- `docs/tech/AUTH.md`
- `docs/tech/DATA_MODELS.md`
- `docs/tech/ROUTES.md`
- `docs/tech/DEVOPS_SECURITY.md`
- `docs/tech/IMPLEMENTATION_STATUS.md`

### 5. Gdy chcesz zweryfikować kompletność
- `docs/tech/COMPLETENESS_CHECKLIST.md`
- `docs/rules/AI_RULES.md`
- `docs/rules/ANTI_SLOP.md`

## Jedna hierarchia źródeł prawdy
Jeśli dokumenty się różnią, obowiązuje ta kolejność:
1. `docs/core/REQUIREMENTS.md`
2. `docs/core/MVP_SCOPE.md`
3. `docs/core/PRODUCT.md`
4. `docs/core/USER_FLOWS.md`
5. `docs/funkcjonalnosci.md`
6. `docs/ui/SCREENS.md`
7. `docs/ui/DESIGN_SYSTEM.md`
8. `docs/ui/UI_VISION.md`
9. `docs/tech/ARCHITECTURE.md`
10. `docs/tech/AUTH.md`
11. `docs/tech/DATA_MODELS.md`
12. `docs/tech/ROUTES.md`
13. `docs/tech/DEVOPS_SECURITY.md`
14. `docs/rules/AI_RULES.md`
15. `docs/rules/ANTI_SLOP.md`

## Co opisuje który obszar

### `docs/core/`
Opisuje produkt, zakres MVP, formalne wymagania i przepływy użytkownika.

### `docs/ui/`
Opisuje kierunek wizualny, zestaw ekranów i minimalny system UI.

### `docs/tech/`
Opisuje architekturę, auth, dane, trasy, devops i aktualny stan implementacji.

### `docs/rules/`
Opisuje zasady pracy agenta i antywzorce jakościowe.

## Ważne rozróżnienia

### `REQUIREMENTS.md`
To są formalne wymagania zadania/projektu, nie pełna specyfikacja produktu.

### `MVP_SCOPE.md`
To jest granica produktu na teraz.
Jeśli czegoś tam nie ma, nie należy tego dodawać bez wyraźnej decyzji.

### `funkcjonalnosci.md`
To jest skrócona mapa modułów MVP.
Nie zastępuje `MVP_SCOPE.md`, `USER_FLOWS.md` ani `ROUTES.md`.

### `IMPLEMENTATION_STATUS.md`
Ten plik rozróżnia:
- co jest już w repo,
- co jest tylko szkieletem,
- czego jeszcze nie ma.

## Zasady utrzymania dokumentacji
- Nie duplikować tej samej decyzji w kilku plikach bez potrzeby.
- Aktualizować dokumentację razem ze zmianą struktury repo lub kontraktów technicznych.
- Gdy coś jest jeszcze szkieletem, pisać to wprost.
- Gdy coś jest luką, nazwać lukę i wskazać bezpieczne rozwiązanie MVP.
