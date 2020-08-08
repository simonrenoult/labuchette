import Carte from "./carte";

export interface QuelleCarteJouer {
  choisir(cartes: Carte[]): Promise<Carte>;
}

export class ToujoursLaPremiereCarte implements QuelleCarteJouer {
  async choisir(cartes: Carte[]): Promise<Carte> {
    return cartes[0];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static creer(): ToujoursLaPremiereCarte {
    return new ToujoursLaPremiereCarte();
  }
}
