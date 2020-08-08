import CarteDeLaMain from "./carte_de_la_main";
import Carte from "./carte";
import Defausse from "./defausse";
import { OuPiocher } from "./ou_piocher";
import { QuelleCarteJouer } from "./quelle_carte_jouer";
import { QuelleCarteRegarder } from "./quelle_carte_regarder";
import Pioche from "./pioche";

export default class Joueur {
  static creer(
    nom: string,
    ouPiocher: OuPiocher,
    quelleCarteJouer: QuelleCarteJouer,
    quelleCarteRegarder: QuelleCarteRegarder
  ): Joueur {
    return new Joueur(nom, ouPiocher, quelleCarteJouer, quelleCarteRegarder);
  }

  private points = 0;
  private main: CarteDeLaMain[] = [];

  constructor(
    private readonly nom: string,
    private readonly ouPiocher: OuPiocher,
    private readonly quelleCarteJouer: QuelleCarteJouer,
    private readonly quelleCarteRegarder: QuelleCarteRegarder
  ) {}

  constituerLaMainDeDepart(cartes: Carte[]): void {
    this.main = cartes.map((carte: Carte) => CarteDeLaMain.faceCachee(carte));
  }

  async piocher(): Promise<void> {
    const carteDuDessusDeLaPioche = (
      await this.ouPiocher.choisir()
    ).retirerUneCarte();
    this.main.push(CarteDeLaMain.retenir(carteDuDessusDeLaPioche));
  }

  async jouerUneCarte(defausse: Defausse): Promise<void> {
    if (this.main.length === 0) throw new Error("La main est vide");

    const carteChoisie = await this.quelleCarteJouer.choisir(this.main);

    const indexDeLaCarte = this.main.findIndex((c: Carte) =>
      c.equals(carteChoisie)
    );
    this.main.splice(indexDeLaCarte, 1);

    defausse.ajouter(Carte.aPartirDe(carteChoisie));
  }

  async seDefausser(
    carteDeReference: Carte,
    defausse: Defausse
  ): Promise<void> {
    const cartesADefausser = this.main.filter((c: CarteDeLaMain) =>
      c.equals(carteDeReference)
    );
    cartesADefausser.forEach((c: CarteDeLaMain) =>
      defausse.ajouter(Carte.aPartirDe(c))
    );

    this.main = this.main.filter(
      (c: CarteDeLaMain) => !c.equals(carteDeReference)
    );
  }

  async regarderUneCarteDeSaMain(): Promise<CarteDeLaMain> {
    return this.quelleCarteRegarder.choisir(this.main);
  }

  seSouvenirDeLaCarte(carteDeLaMain: CarteDeLaMain): void {
    carteDeLaMain.retenir();
  }

  nAPlusDeCartes(): boolean {
    return this.main.length === 0;
  }

  equals(joueur: Joueur): boolean {
    return this.nom === joueur.nom;
  }

  consulterLaMain(): Carte[] {
    return this.main;
  }

  compterLesPointsDeLaMain(): number {
    return this.main
      .map((carte) => carte.points)
      .reduce((prev, cur) => prev + cur, 0);
  }

  getNom(): string {
    return this.nom;
  }

  ajouterPoints(points: number): void {
    this.points += points;
  }

  getPoints(): number {
    return this.points;
  }

  getMain(): CarteDeLaMain[] {
    return this.main;
  }

  mettreLaMainDans(pioche: Pioche): void {
    this.main.forEach((c) => pioche.ajouter(c));
    this.main = [];
  }

  toString(): string {
    return this.nom + " - " + this.points + "pts";
  }
}
