-- ==========================================================
-- Admin account  (password: admin123 – dev only)
-- hash = crypt('admin123', gen_salt('bf'))
-- ==========================================================
INSERT INTO users (login, password_hash, is_admin)
VALUES ('admin', crypt('admin123', gen_salt('bf')), TRUE)
ON CONFLICT (login) DO NOTHING;

-- ==========================================================
-- Regular user  (password: user123 – dev only)
-- ==========================================================
INSERT INTO users (login, password_hash, is_admin)
VALUES ('user', crypt('user123', gen_salt('bf')), FALSE)
ON CONFLICT (login) DO NOTHING;

-- ==========================================================
-- Inspirations (published – visible on public wall)
-- ==========================================================
INSERT INTO inspirations (emoji, title, content, source, status) VALUES
  ('✨', 'Nowy dzień, nowa szansa',
   'Każdy dzień to nowa szansa, by zacząć od nowa. Nie musisz być idealny – wystarczy, że próbujesz.',
   'manual', 'published'),
  ('🌿', 'Siła w Tobie',
   'Twoja siła nie płynie z tego, co potrafisz, ale z pokonywania rzeczy, które kiedyś wydawały Ci się niemożliwe.',
   'manual', 'published'),
  ('☀️', 'Pierwszy krok',
   'Nie musisz widzieć całej drogi, wystarczy zrobić pierwszy krok.',
   'manual', 'published'),
  ('🌱', 'Jesteś wystarczający',
   'Jesteś wystarczający dokładnie taki, jaki jesteś w tej chwili.',
   'manual', 'published'),
  ('💛', 'Małe zwycięstwo',
   'Nawet najmniejszy krok w stronę światła jest zwycięstwem nad mrokiem, który próbował Cię zatrzymać.',
   'manual', 'published'),
  ('🌈', 'Po burzy',
   'Po każdej burzy przychodzi cisza. Pozwól sobie na tę ciszę.',
   'manual', 'published');

INSERT INTO inspirations (emoji, title, content, source, status) VALUES
  ('🔮', 'Generowana inspiracja',
   'Nawet najdłuższa droga zaczyna się od pierwszego kroku, który właśnie robisz.',
   'generator', 'published');

-- ==========================================================
-- Anonymous messages (sample for admin panel testing)
-- ==========================================================
INSERT INTO anonymous_messages (body, status) VALUES
  ('Czuję się samotna, ale nie chcę z nikim rozmawiać. Chciałabym tylko, żeby ktoś wiedział, że tu jestem.', 'new'),
  ('Dzisiaj był trudny dzień, ale dotrwałem do końca. To chyba coś znaczy.', 'new');

-- ==========================================================
-- Help sections (published – visible on /help)
-- ==========================================================
INSERT INTO help_sections (category, title, body, display_order, status) VALUES
  ('telefony', 'Telefony zaufania',
   'Bezpłatne i anonimowe wsparcie telefoniczne dostępne całą dobę.',
   1, 'published'),
  ('telefony', 'Dla dzieci i młodzieży – 116 111',
   'Czynny całą dobę, 7 dni w tygodniu. Bezpłatna linia prowadzona przez Fundację Dajemy Dzieciom Siłę.',
   2, 'published'),
  ('telefony', 'Dla osób dorosłych – 116 123',
   'Bezpłatny telefon wsparcia psychicznego prowadzony przez Instytut Psychologii Zdrowia.',
   3, 'published'),
  ('osrodki', 'Lokalne ośrodki pomocy',
   'Centra Interwencji Kryzysowej (CIK) oferują bezpłatną pomoc psychologiczną, prawną i socjalną. Znajdź najbliższy ośrodek w swojej okolicy.',
   4, 'published'),
  ('edukacja', 'Materiały edukacyjne',
   'Baza wiedzy o zdrowiu psychicznym – jak rozpoznać depresję, pierwsza pomoc emocjonalna, techniki radzenia sobie ze stresem.',
   5, 'published');

-- ==========================================================
-- Entries (sample user entries for admin/user panel testing)
-- ==========================================================
INSERT INTO entries (user_id, title, body, status)
SELECT id, 'Mój pierwszy wpis', 'Dzisiaj postanowiłem zapisywać swoje myśli. To mały krok, ale ważny.', 'active'
FROM users WHERE login = 'user'
LIMIT 1;

INSERT INTO entries (user_id, title, body, status)
SELECT id, 'Dobry dzień', 'Spotkałem starą znajomą. Krótka rozmowa poprawiła mi humor na cały dzień.', 'active'
FROM users WHERE login = 'user'
LIMIT 1;
