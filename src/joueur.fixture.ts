import Joueur from "./joueur";
import * as OuPiocher from "./ou_piocher";
import * as QuelleCarteJouer from "./quelle_carte_jouer";
import * as QuelleCarteRegarder from "./quelle_carte_regarder";
import Defausse from "./defausse";
import Pioche from "./pioche";

export type UnJoueurArgs = {
  nom?: string;
  defausse?: Defausse;
  pioche?: Pioche;
};

export function unJoueur(args: UnJoueurArgs = {}): Joueur {
  const defaults = {
    nom: "Simon",
    defausse: Defausse.creer(),
    pioche: Pioche.creer(),
  };
  const options = { ...defaults, ...args };

  return Joueur.creer(
    options.nom,
    OuPiocher.ToujoursLaPioche.creer(options.pioche, options.defausse),
    QuelleCarteJouer.ToujoursLaPremiereCarte.creer(),
    QuelleCarteRegarder.ToujoursUneCarteAleatoire.creer()
  );
}
