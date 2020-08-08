import Joueur from "./joueur";

export function creerUneBoucleDe(
  joueurs: Joueur[]
): { prochainJoueur: () => Joueur } {
  const INDICE_DE_DEBUT_DU_TABLEAU = 0;
  const INDICE_DE_FIN_DU_TABLEAU = joueurs.length;
  const PAS_ENTRE_LES_INDICES = 1;
  let indiceCourant = INDICE_DE_DEBUT_DU_TABLEAU;

  return {
    prochainJoueur() {
      const joueurARetourner = joueurs[indiceCourant];

      const INDICE_DU_PROCHAIN_ELEMENT = indiceCourant + PAS_ENTRE_LES_INDICES;
      indiceCourant =
        INDICE_DU_PROCHAIN_ELEMENT === INDICE_DE_FIN_DU_TABLEAU
          ? INDICE_DE_DEBUT_DU_TABLEAU
          : INDICE_DU_PROCHAIN_ELEMENT;

      return joueurARetourner;
    },
  };
}
