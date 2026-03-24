const inspirationsRepo = require("../repositories/inspirations.repository");

const MOOD_TEMPLATES = {
  calm: [
    "Twój spokój jest siłą, która inspiruje innych. Pozwól sobie na tę chwilę ciszy.",
    "Ciszą możesz więcej niż krzykiem. Twoja harmonia jest darem.",
  ],
  hard: [
    "Nawet w najciemniejszej godzinie jest iskra, która czeka, aż ją dostrzeżesz.",
    "Trudne chwile nie definiują Cię — to jak przez nie przechodzisz, mówi kim jesteś.",
  ],
  energetic: [
    "Twoja energia może zmienić dzień komuś innemu. Wykorzystaj ją mądrze.",
    "Świat potrzebuje Twojej energii. Działaj — każdy krok się liczy.",
  ],
  tired: [
    "Odpoczynek to nie słabość — to odwaga, by zadbać o siebie.",
    "Nie musisz dziś zdobywać szczytów. Wystarczy, że jesteś.",
  ],
};

async function getPublishedInspirations() {
  return inspirationsRepo.findPublished();
}

async function getInspirationById(id) {
  return inspirationsRepo.findById(id);
}

async function generateFromMood(mood) {
  const templates = MOOD_TEMPLATES[mood] || MOOD_TEMPLATES.calm;
  const content = templates[Math.floor(Math.random() * templates.length)];
  const emojis = { calm: "🌿", hard: "💛", energetic: "⚡", tired: "🌙" };
  const titles = { calm: "Spokój", hard: "Siła", energetic: "Energia", tired: "Odpoczynek" };

  return inspirationsRepo.create({
    emoji: emojis[mood] || "✨",
    title: titles[mood] || "Inspiracja",
    content,
    source: "generator",
  });
}

async function getLastGenerated() {
  const all = await inspirationsRepo.findPublished();
  return all.find((i) => i.source === "generator") || null;
}

module.exports = {
  getPublishedInspirations,
  getInspirationById,
  generateFromMood,
  getLastGenerated,
};
