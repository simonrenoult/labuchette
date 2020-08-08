import Carte from "./carte";

export default class CarteDeLaMain extends Carte {
  retenue: boolean;

  static retenir(carte: Carte): CarteDeLaMain {
    const carteDeLaMain = new CarteDeLaMain(carte);
    carteDeLaMain.retenir();
    return carteDeLaMain;
  }

  static faceCachee(carte: Carte): CarteDeLaMain {
    return new CarteDeLaMain(carte);
  }

  constructor(carte: Carte) {
    super(carte.couleur, carte.chiffre, carte.points);
    this.retenue = false;
  }

  retenir(): void {
    this.retenue = true;
  }
}
