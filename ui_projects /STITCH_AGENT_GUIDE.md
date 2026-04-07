# STITCH_AGENT_GUIDE

Ten plik opisuje, jak agent ma pracować z projektami wygenerowanymi w Stitch AI dla `dlaczegozyc.pl`.
Celem jest utrzymanie jednego spójnego systemu UI, bez rozjeżdżania się nawigacji, komponentów i stylu między ekranami.

## 1) Zasada pracy z materiałem wejściowym

Agent zawsze traktuje jako punkt odniesienia:
- `docs/core/PRODUCT.md`
- `docs/core/MVP_SCOPE.md`
- `docs/core/REQUIREMENTS.md`
- `docs/core/USER_FLOWS.md`
- `docs/ui/UI_VISION.md`
- `docs/ui/DESIGN_SYSTEM.md`
- `docs/ui/SCREENS.md`
- `docs/rules/AI_RULES.md`
- `docs/rules/ANTI_SLOP.md`
- `docs/tech/ROUTES.md`
- `docs/tech/AUTH.md`

Pliki ze Stitch są tylko materiałem produkcyjnym do porównania, wyboru i wyciągania wspólnego systemu.

## 2) Jak analizować projekty Stitch

W `ui_projects/stitch/` znajdują się zwykle dwa warianty tego samego widoku, np. `_1` i `_2`.

Agent ma robić tak:
1. Otworzyć oba warianty danego ekranu.
2. Porównać je pod kątem:
   - zgodności z `UI_VISION.md`,
   - czytelności na mobile,
   - spójności z innymi ekranami,
   - jakości hierarchy,
   - braku „AI slopu”,
   - prostoty i użyteczności.
3. Wybrać **jedną najlepszą wersję jako canonical**.
4. Drugą potraktować wyłącznie jako referencję pomocniczą.
5. Nie mieszać obu wersji w jeden hybrydowy ekran, chyba że obie mają wyraźnie dobre, kompatybilne fragmenty.

## 3) Co jest canonical source of truth

Canonical source of truth ma być zawsze:
- dokumentacja produktu,
- screen flow z `docs/ui/SCREENS.md`,
- design system,
- wybrany najlepszy wariant Stitch dla danego widoku.

Jeżeli ekran w Stitch różni się od specyfikacji, specyfikacja wygrywa.

## 4) Jak wyodrębniać partiale

Celem jest jedna wspólna baza UI, a nie osobna nawigacja i osobne komponenty na każdej stronie.

### Partiale należy wyciągać z ekranów, które powtarzają ten sam wzorzec:
- nagłówek / top bar
- nawigacja publiczna
- nawigacja zalogowanego użytkownika
- nawigacja admina
- główne CTA
- formularze autoryzacji
- karty treści
- listy wpisów
- komunikaty sukcesu / błędu
- stany pusty / brak danych
- sekcje pomocy
- akcje edycji / usuwania / zapisu
- stopka, jeśli występuje

### Reguła:
Jeśli 2 lub więcej ekranów mają ten sam typ elementu, agent ma z tego zrobić partial, a nie duplikować tego elementu per ekran.

## 5) Jak wygląda poprawne wyciąganie partiali dla nawigacji

Nawigacja ma mieć jedną bazę, z trzema wariantami stanu:

### A. Public navigation
Dla ekranów publicznych:
- home
- login
- register
- help
- inspiration wall
- inspiration details
- auth required
- error state
- empty state

Powinna być lekka i dyskretna. Może zawierać:
- logo / nazwę,
- link do pomocy,
- link do logowania / rejestracji,
- ewentualnie minimalny powrót do home.

### B. User navigation
Dla zalogowanego użytkownika:
- dashboard
- my entries
- create entry
- edit entry
- inspiration generator, jeśli jest dostępny po zalogowaniu
- anonymous box, jeśli dostępny po zalogowaniu

Powinna być ta sama na wszystkich stronach użytkownika.
Nie wolno tworzyć osobnej nawigacji na każdym ekranie użytkownika.

### C. Admin navigation
Dla panelu admina:
- admin dashboard
- admin entries
- admin entry edit
- admin help edit

Powinna być jedna, wspólna i stabilna.
Jeśli trzeba, może mieć dodatkowe pozycje administracyjne, ale nie może zmieniać struktury per ekran.

## 6) Zasada „jedna nawigacja, wiele kontekstów”

Agent ma traktować nawigację jako jeden komponent systemowy z różnymi stanami, a nie jako osobny layout dla każdego widoku.

Czyli:
- jedna logika,
- jeden styl,
- jeden zestaw proporcji,
- jedna hierarchia wizualna,
- różne pozycje aktywne zależnie od kontekstu.

## 7) Jak łączyć partiale z ekranami

Każdy ekran powinien być składany z tych samych bloków:
- `AppShell`
- `TopBar` / `Header`
- `PrimaryNavigation`
- `PageHeader`
- `ContentSection`
- `Card`
- `FormField`
- `PrimaryAction`
- `SecondaryAction`
- `EmptyState`
- `ErrorState`
- `SuccessState`
- `Footer`

Ważne:
- nie kopiować kodu / układu per ekran,
- tylko składać ekran z tych samych partiali,
- jeśli element występuje w wielu miejscach, powinien mieć jedną definicję.

## 8) Jak traktować mobile i desktop

Mobile i desktop to nie dwa różne produkty.
To ten sam system UI w dwóch układach.

Agent ma:
- zachować to samo znaczenie i te same sekcje,
- zachować ten sam porządek treści,
- zachować te same CTA,
- przeskalować layout zgodnie z kontekstem urządzenia,
- nie robić redesignu tylko dlatego, że ekran jest większy.

## 9) Co agent ma wyciągać poza nawigacją

Jeśli element się powtarza, warto zrobić z niego partial:
- hero / intro blok,
- informacyjny banner,
- karty inspiracji,
- karty wpisów użytkownika,
- formularze logowania/rejestracji,
- formularz wiadomości anonimowej,
- blok pomocy,
- blok sukcesu,
- blok błędu,
- blok pustego stanu,
- sekcja akcji admina.

## 10) Czego agent ma nie robić

- Nie tworzyć osobnego menu na każdej stronie.
- Nie różnicować układu nawigacji bez powodu.
- Nie budować lokalnych wyjątków, jeśli da się użyć jednego partiala.
- Nie dodawać ozdobników bez funkcji.
- Nie przekształcać prostych ekranów w „marketingowe” layouty.
- Nie robić kilku stylistyk w jednym systemie.
- Nie traktować Stitch jako finalnego źródła prawdy bez porównania z dokumentacją.

## 11) Proces decyzyjny dla agenta

Dla każdego widoku agent ma wykonać następujące kroki:
1. Sprawdzić wymogi w dokumentacji.
2. Otworzyć wszystkie warianty Stitch dla tego widoku.
3. Wybrać najlepszy wariant.
4. Zidentyfikować powtarzalne elementy.
5. Wyciągnąć partiale.
6. Uporządkować layout wokół wspólnych partiali.
7. Sprawdzić, czy nawigacja jest jedna i spójna.
8. Zostawić wyraźny, prosty flow.

## 12) Kryterium jakości

Dobry wynik to taki, w którym:
- wszystkie widoki wyglądają jak część jednego produktu,
- nawigacja nie skacze między ekranami,
- partiale są współdzielone,
- mobile i desktop mają ten sam charakter,
- projekt jest prosty, spokojny i użyteczny,
- nic nie wygląda jak osobny eksperyment wizualny.

## 13) Backup prompt, gdy agent nie dowozi desktopów

Jeśli automatyczne generowanie desktopów nie działa poprawnie albo agent zaczyna mieszać layout, użyj poniższego promptu awaryjnego.

```text
You are given a complete set of mobile UI screens for a web application called “dlaczegozyc.pl”.

Your task is to create desktop versions of all screens by scaling and adapting the existing mobile screens.

Important:
- Use the mobile screens as the exact source of truth.
- Do not redesign the product.
- Do not change the content, hierarchy, flow, or screen purpose.
- Do not merge screens.
- Do not omit any screen.
- Keep the same visual style, tone, and components.
- The only job is to adapt each mobile screen into a clean desktop layout.
- Preserve all navigation structure and extract shared partials so there is one consistent navigation system across the whole product.
- If a component repeats across multiple screens, make it a reusable partial instead of redesigning it per page.
- Keep one version of public navigation, one version of user navigation, and one version of admin navigation.
- Desktop layouts should feel like a natural upscale of the mobile product, not a new design direction.
- Keep the app calm, minimal, trustworthy, and professional.
```

## 14) Finalna reguła dla agenta

Najpierw spójność, potem skalowanie, potem kosmetyka.
Jeśli coś można zrobić jako partial, należy to zrobić jako partial.
Jeśli coś ma trzy wersje na trzech ekranach, a powinno być jedno, to jest błąd.
