import Carte from "./carte";

type GenerateurDeCarte = {
  Trefle: () => Carte;
  Coeur: () => Carte;
  Pique: () => Carte;
  Carreau: () => Carte;
};

function creerUnGenerateurDeCarte(
  chiffre: string,
  point: number
): { de: GenerateurDeCarte } {
  return {
    de: {
      Trefle: () => Carte.creer("Trèfle", chiffre, point),
      Coeur: () => Carte.creer("Coeur", chiffre, point),
      Pique: () => Carte.creer("Pique", chiffre, point),
      Carreau: () => Carte.creer("Carreau", chiffre, point),
    },
  };
}

export const As = creerUnGenerateurDeCarte("1", 1);
export const Deux = creerUnGenerateurDeCarte("2", 2);
export const Trois = creerUnGenerateurDeCarte("3", 3);
export const Quatre = creerUnGenerateurDeCarte("4", 4);
export const Cinq = creerUnGenerateurDeCarte("5", 5);
export const Six = creerUnGenerateurDeCarte("6", 6);
export const Sept = creerUnGenerateurDeCarte("7", 7);
export const Huit = creerUnGenerateurDeCarte("8", 8);
export const Neuf = creerUnGenerateurDeCarte("9", 9);
export const Dix = creerUnGenerateurDeCarte("10", 10);
export const Valet = creerUnGenerateurDeCarte("Valet", 11);
export const Dame = creerUnGenerateurDeCarte("Dame", 12);
export const Roi = creerUnGenerateurDeCarte("Roi", 13);
