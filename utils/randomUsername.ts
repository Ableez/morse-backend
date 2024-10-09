export function generateUsername(): string {
  const adjectives = ["Happy", "Clever", "Brave", "Mighty", "Wise", "Kind"];
  const nouns = ["Panda", "Tiger", "Eagle", "Dolphin", "Wolf", "Lion"];
  const randomNumber = Math.floor(Math.random() * 1000);

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective}${randomNoun}${randomNumber}`;
}
