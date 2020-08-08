import Joueur from "./joueur";
import { OuPiocher } from "./ou_piocher";
import { QuelleCarteJouer } from "./quelle_carte_jouer";
import { QuelleCarteRegarder } from "./quelle_carte_regarder";

export class DeuxJoueurs {
  static creer(
    ouPiocher: OuPiocher,
    quelleCarteJouer: QuelleCarteJouer,
    quelleCarteRegarder: QuelleCarteRegarder
  ): Joueur[] {
    return [
      Joueur.creer("Simon", ouPiocher, quelleCarteJouer, quelleCarteRegarder),
      Joueur.creer(
        "Clémence",
        ouPiocher,
        quelleCarteJouer,
        quelleCarteRegarder
      ),
    ];
  }
}

export class QuatreJoueurs {
  static creer(
    ouPiocher: OuPiocher,
    quelleCarteJouer: QuelleCarteJouer,
    quelleCarteRegarder: QuelleCarteRegarder
  ): Joueur[] {
    return [
      Joueur.creer("Simon", ouPiocher, quelleCarteJouer, quelleCarteRegarder),
      Joueur.creer(
        "Clemence",
        ouPiocher,
        quelleCarteJouer,
        quelleCarteRegarder
      ),
      Joueur.creer(
        "Baptiste",
        ouPiocher,
        quelleCarteJouer,
        quelleCarteRegarder
      ),
      Joueur.creer("Sarah", ouPiocher, quelleCarteJouer, quelleCarteRegarder),
    ];
  }
}
