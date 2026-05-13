export const cuisineTranslations: Record<string, string> = {
  Italian: "Italiana",
  Japanese: "Japonesa",
  Mexican: "Mexicana",
  Indian: "India",
  Chinese: "China",
  Thai: "Tailandesa",
  French: "Francesa",
  Spanish: "Española",
  Korean: "Coreana",
  Vietnamese: "Vietnamita",
  Mediterranean: "Mediterránea",
  American: "Americana",
  Brazilian: "Brasileña",
  Peruvian: "Peruana",
  Ethiopian: "Etíope",
  Turkish: "Turca",
  Lebanese: "Libanesa",
  Greek: "Griega",
  Caribbean: "Caribeña",
  Other: "Otra",
};

export function translateCuisine(name: string | null | undefined): string {
  if (!name) return "Otra";
  return cuisineTranslations[name] ?? name;
}