# AGENT_MENU

Ten plik jest pierwszym punktem wejścia dla agenta.
Ma pomóc szybko wybrać właściwe dokumenty i nie zgadywać intencji projektu.

## Zasada startowa
1. Przeczytaj ten plik.
2. Otwórz `docs/README.md`.
3. Dopiero potem czytaj dokumenty właściwe dla zadania.

## Szybka mapa zadań

### Gdy trzeba zrozumieć produkt
Czytaj:
- `docs/core/PRODUCT.md`
- `docs/core/MVP_SCOPE.md`
- `docs/core/USER_FLOWS.md`
- `docs/funkcjonalnosci.md`
- `docs/core/REQUIREMENTS.md`

### Gdy trzeba pracować nad UI
Czytaj:
- `docs/ui/UI_VISION.md`
- `docs/ui/DESIGN_SYSTEM.md`
- `docs/ui/SCREENS.md`
- `ui_projects /STITCH_AGENT_GUIDE.md`

### Gdy trzeba pracować nad backendem lub infrastrukturą
Czytaj:
- `docs/tech/ARCHITECTURE.md`
- `docs/tech/AUTH.md`
- `docs/tech/DATA_MODELS.md`
- `docs/tech/ROUTES.md`
- `docs/tech/DEVOPS_SECURITY.md`
- `docs/tech/IMPLEMENTATION_STATUS.md`

### Gdy trzeba zweryfikować jakość i ograniczenia
Czytaj:
- `docs/rules/AI_RULES.md`
- `docs/rules/ANTI_SLOP.md`
- `docs/tech/COMPLETENESS_CHECKLIST.md`

## Jedna hierarchia źródeł prawdy
Nie utrzymujemy kilku różnych list priorytetów.
Obowiązują zasady z `docs/README.md`.

## Minimalna zasada
- Nie buduj niczego, czego nie ma w wymaganiach lub w MVP.
- Nie traktuj szkicu implementacyjnego jak gotowej funkcji.
- Jeśli dokumentacja i repo sobie przeczą, najpierw sprawdź `docs/README.md`, potem odpowiedni plik w `docs/tech/IMPLEMENTATION_STATUS.md`.