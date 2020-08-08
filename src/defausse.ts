import Carte from "./carte";
import Piochable from "./piochable";
import Pioche from "./pioche";

export default class Defausse implements Piochable {
  static creer(): Defausse {
    return new Defausse();
  }

  constructor(private cartes: Carte[] = []) {}

  ajouter(carte: Carte): Defausse {
    this.cartes.push(carte);
    return this;
  }

  carteVisible(): Carte | null {
    if (this.cartes.length === 0) return null;
    return this.cartes[this.cartes.length - 1];
  }

  compterLesCartes(): number {
    return this.cartes.length;
  }

  retirerUneCarte(): Carte {
    const carte = this.cartes.shift();
    if (!carte) throw new Error("La défausse est vide");
    return carte;
  }

  getCartes(): Carte[] {
    return this.cartes;
  }

  mettreDansLa(pioche: Pioche): void {
    this.cartes.forEach((c) => pioche.ajouter(c));
    this.cartes = [];
  }
}
