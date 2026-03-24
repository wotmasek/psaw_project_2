# DESIGN_SYSTEM

## Cel dokumentu
Ten plik definiuje minimalny system wizualny MVP.
Ma być prosty, spójny i zgodny z obecnym szkieletem repo.

## Zakres
Ten dokument opisuje tylko:
- kolory bazowe,
- typografię,
- ogólne zasady formy,
- mapowanie na obecną konfigurację projektu.

Nie opisuje:
- pełnych makiet ekranów,
- flow ekranów,
- antywzorców jakościowych.

Do tego służą:
- `docs/ui/SCREENS.md`
- `docs/ui/UI_VISION.md`
- `docs/rules/ANTI_SLOP.md`

## Tryb
- Domyślny tryb: `light`
- Dark mode nie jest częścią MVP

## Paleta
- `primary`: `#2E7D32`
- `secondary`: `#E3F2FD`
- `tertiary`: `#E8F5E9`
- `neutral`: `#37474F`

## Typografia
- nagłówki: `Manrope`
- tekst podstawowy: `Inter`
- etykiety formularzy: `Inter`

## Forma
- umiarkowane zaokrąglenia,
- spokojne światło i dużo oddechu,
- wysoki priorytet czytelności nad dekoracją,
- wyraźne CTA bez przesadnych efektów.

## Gęstość
- domyślna gęstość: `normal`
- formularze i listy mają być lekkie wizualnie

## Mapowanie do repo

### Aktualny szkielet
Kolory są już odwzorowane w:
- `tailwind.config.js`
- `src/public/css/tailwind.input.css`
- `src/public/css/app.css`

### Zasada implementacyjna
- jeśli trzeba dodać nowe utility lub tokeny Tailwind, powinny wynikać z tej palety,
- nie budować drugiego, równoległego systemu kolorów,
- bogatsze tokeny widoczne w materiałach Stitch traktować jako inspirację techniczną, nie jako osobne źródło prawdy.

## Luki celowo pozostawione na później
- szczegółowa skala spacingu,
- skala cieni,
- pełna biblioteka komponentów,
- desktop-specific variants.

To nie są braki krytyczne na etapie obecnego MVP skeletonu.