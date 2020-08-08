import Carte from "./carte";
import Piochable from "./piochable";
import { unJeuDe52Cartes } from "./pioche.fixture";

export default class Pioche implements Piochable {
  static creer(cartesDansLaPioche: Carte[] = unJeuDe52Cartes()): Pioche {
    return new Pioche(cartesDansLaPioche);
  }

  constructor(private cartes: Carte[] = []) {}

  compterLesCartes(): number {
    return this.cartes.length;
  }

  estVide(): boolean {
    return this.cartes.length === 0;
  }

  melanger(): Pioche {
    type CarteATrier = { sort: number; value: Carte };
    this.cartes = this.cartes
      .map((a: Carte) => ({ sort: Math.random(), value: a }))
      .sort((a: CarteATrier, b: CarteATrier) => a.sort - b.sort)
      .map((a: CarteATrier) => a.value);

    return this;
  }

  retirerUneCarte(): Carte {
    const carte = this.cartes.shift();
    if (!carte) throw new Error("La pioche est vide");
    return carte;
  }

  getCartes(): Carte[] {
    return this.cartes;
  }

  ajouter(carte: Carte): void {
    this.cartes.push(carte);
  }

  toString(): string {
    return this.cartes.map((c) => c.toString()).join(" ");
  }
}
