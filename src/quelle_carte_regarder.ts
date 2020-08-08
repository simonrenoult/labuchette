import CarteDeLaMain from "./carte_de_la_main";

export interface QuelleCarteRegarder {
  choisir(cartesDeLaMain: CarteDeLaMain[]): Promise<CarteDeLaMain>;
}

export class ToujoursUneCarteAleatoire implements QuelleCarteRegarder {
  async choisir(cartesDeLaMain: CarteDeLaMain[]): Promise<CarteDeLaMain> {
    const indexAleatoire = Math.floor(Math.random() * cartesDeLaMain.length);
    return cartesDeLaMain[indexAleatoire];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static creer(): ToujoursUneCarteAleatoire {
    return new ToujoursUneCarteAleatoire();
  }
}
