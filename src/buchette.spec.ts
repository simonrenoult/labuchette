import { describe, it } from "mocha";
import { expect } from "chai";

import Buchette from "./buchette";
import * as OuPiocher from "./ou_piocher";
import * as QuelleCarteJouer from "./quelle_carte_jouer";
import * as QuelleCarteRegarder from "./quelle_carte_regarder";
import * as QuiParticipe from "./qui_participe";
import Defausse from "./defausse";
import Pioche from "./pioche";
import {
  As,
  Cinq,
  Dame,
  Deux,
  Dix,
  Huit,
  Neuf,
  Roi,
  Sept,
  Six,
  Trois,
  Valet,
} from "./carte.fixture";
import Joueur from "./joueur";
import Carte from "./carte";

describe(Buchette.name, () => {
  describe(".creer()", async () => {
    it("initialise les joueurs", async () => {
      // Given
      const pioche = Pioche.creer();
      const defausse = Defausse.creer();
      const joueurs = QuiParticipe.QuatreJoueurs.creer(
        OuPiocher.ToujoursLaPioche.creer(pioche, defausse),
        QuelleCarteJouer.ToujoursLaPremiereCarte.creer(),
        QuelleCarteRegarder.ToujoursUneCarteAleatoire.creer()
      );

      // Given + When
      const unePartieDeBuchette = Buchette.creer(joueurs, pioche, defausse);

      // Then
      expect(unePartieDeBuchette.compterLesJoueurs()).to.equal(4);
    });
  });

  describe(".distribuerLesCartes()", async () => {
    it("donne autant de cartes que demandé à chaque joueur", async () => {
      // Given
      const pioche = Pioche.creer();
      const defausse = Defausse.creer();
      const joueurs = QuiParticipe.QuatreJoueurs.creer(
        OuPiocher.ToujoursLaPioche.creer(pioche, defausse),
        QuelleCarteJouer.ToujoursLaPremiereCarte.creer(),
        QuelleCarteRegarder.ToujoursUneCarteAleatoire.creer()
      );
      const unePartieDeBuchette = Buchette.creer(joueurs, pioche, defausse, {
        nombreDeCartesInitialParJoueur: 2,
      });

      // When
      unePartieDeBuchette.distribuerLesCartes();

      // Then
      joueurs.forEach((joueur: Joueur) => {
        expect(joueur.consulterLaMain()).to.have.length(2);
      });
    });

    it("aboutit à 52 - 16 cartes dans la pioche", async () => {
      // Given
      const pioche = Pioche.creer();
      const defausse = Defausse.creer();
      const joueurs = QuiParticipe.QuatreJoueurs.creer(
        OuPiocher.ToujoursLaPioche.creer(pioche, defausse),
        QuelleCarteJouer.ToujoursLaPremiereCarte.creer(),
        QuelleCarteRegarder.ToujoursUneCarteAleatoire.creer()
      );
      const unePartieDeBuchette = Buchette.creer(joueurs, pioche, defausse);

      // When
      unePartieDeBuchette.distribuerLesCartes();

      // Then
      expect(pioche.compterLesCartes()).to.equal(52 - 16);
    });
  });

  describe(".mettreAJourLesPointsDeChaqueJoueur()", async () => {
    [
      {
        contexte: "quand la main des joueurs est vide",
        titre: "les points restent à 0",
        quand: (joueurs: Joueur[]) =>
          joueurs.forEach((j) => j.constituerLaMainDeDepart([])),
        assertion: (joueurs: Joueur[]) =>
          joueurs.forEach((j) => {
            expect(j.compterLesPoints()).to.equal(0);
          }),
      },
      {
        contexte: "quand un joueur fait une chèvre",
        titre: "ses points redescendent à la valeur de la chèvre moins 5",
        quand: (joueurs: Joueur[]) => {
          joueurs[0].constituerLaMainDeDepart([
            Carte.creer("carreau", "As", 50),
          ]);
          joueurs[1].constituerLaMainDeDepart([
            Carte.creer("carreau", "Roi", 40),
          ]);
        },
        assertion: (joueurs: Joueur[]) => {
          expect(joueurs[0].compterLesPoints()).to.equal(45);
          expect(joueurs[1].compterLesPoints()).to.equal(40);
        },
      },
      {
        contexte: "quand un joueur fait une buchette",
        titre: "ses points redescendent à la moitié du seuil",
        quand: (joueurs: Joueur[]) => {
          joueurs[0].constituerLaMainDeDepart([
            Carte.creer("carreau", "As", 100),
          ]);
          joueurs[1].constituerLaMainDeDepart([
            Carte.creer("carreau", "Roi", 90),
          ]);
        },
        assertion: (joueurs: Joueur[]) => {
          expect(joueurs[0].compterLesPoints()).to.equal(50);
          expect(joueurs[1].compterLesPoints()).to.equal(90);
        },
      },
      {
        contexte: "quand un joueur atteint un nombre de points fixe",
        titre: "ses points sont correctement comptés",
        quand: (joueurs: Joueur[]) => {
          joueurs[0].constituerLaMainDeDepart([
            Trois.de.Trefle(),
            Roi.de.Pique(),
          ]);
          joueurs[1].constituerLaMainDeDepart([
            Deux.de.Coeur(),
            Six.de.Pique(),
          ]);
        },
        assertion: (joueurs: Joueur[]) => {
          expect(joueurs[0].compterLesPoints()).to.equal(
            Trois.de.Trefle().points + Roi.de.Pique().points
          );
          expect(joueurs[1].compterLesPoints()).to.equal(
            Deux.de.Coeur().points + Six.de.Pique().points
          );
        },
      },
    ].forEach(({ contexte, titre, quand, assertion }) => {
      describe(contexte, () => {
        it(titre, () => {
          // Given
          const pioche = Pioche.creer();
          const defausse = Defausse.creer();
          const joueurs = QuiParticipe.DeuxJoueurs.creer(
            OuPiocher.ToujoursLaPioche.creer(pioche, defausse),
            QuelleCarteJouer.ToujoursLaPremiereCarte.creer(),
            QuelleCarteRegarder.ToujoursUneCarteAleatoire.creer()
          );
          const unePartieDeBuchette = Buchette.creer(
            joueurs,
            pioche,
            defausse,
            { seuilDePointsADepasser: 100 }
          );

          // When
          quand(joueurs);
          unePartieDeBuchette.mettreAJourLesPointsDeChaqueJoueur();

          // Then
          assertion(joueurs);
        });
      });
    });
  });

  describe(".commencerUneManche()", () => {
    describe("quand la pioche se vide avant que les joueurs ne vident leur main", () => {
      let unePartieDeBuchette: Buchette;
      let joueurs: Joueur[];
      let defausse: Defausse;
      let pioche: Pioche;

      beforeEach(async () => {
        // Given
        pioche = Pioche.creer([
          As.de.Trefle(),
          Deux.de.Pique(),
          Trois.de.Coeur(),
        ]);
        defausse = Defausse.creer();
        joueurs = QuiParticipe.DeuxJoueurs.creer(
          OuPiocher.ToujoursLaPioche.creer(pioche, defausse),
          QuelleCarteJouer.ToujoursLaPremiereCarte.creer(),
          QuelleCarteRegarder.ToujoursUneCarteAleatoire.creer()
        );
        unePartieDeBuchette = Buchette.creer(joueurs, pioche, defausse, {
          nombreDeCartesInitialParJoueur: 1,
        });
        unePartieDeBuchette.distribuerLesCartes();
        await unePartieDeBuchette.revelerDesCartesAChaqueJoueur();

        // When
        await unePartieDeBuchette.jouerUneManche();
      });

      it("interrompt la manche", async () => {
        // Then
        expect(unePartieDeBuchette.laMancheEstTerminee()).to.equal(true);
      });

      it("la pioche est effectivement vide", async () => {
        // Then
        expect(pioche.compterLesCartes()).to.equal(0);
      });

      it("la défausse contient les bonnes cartes", async () => {
        // Then
        expect(defausse.getCartes()).to.deep.equal([As.de.Trefle()]);
      });

      it("les points sont correctement comptabilisés", async () => {
        // Then
        expect(joueurs[0].compterLesPoints()).to.equal(Trois.de.Coeur().points);
        expect(joueurs[1].compterLesPoints()).to.equal(Deux.de.Pique().points);
      });
    });

    describe("quand un joueur vide sa main le premier", () => {
      let unePartieDeBuchette: Buchette;
      let joueurs: Joueur[];
      let defausse: Defausse;
      let pioche: Pioche;

      beforeEach(async () => {
        // Given
        pioche = Pioche.creer([
          As.de.Trefle(),
          As.de.Coeur(),
          Deux.de.Pique(),
          Trois.de.Carreau(),
        ]);
        defausse = Defausse.creer();
        joueurs = QuiParticipe.DeuxJoueurs.creer(
          OuPiocher.ToujoursLaPioche.creer(pioche, defausse),
          QuelleCarteJouer.ToujoursLaPremiereCarte.creer(),
          QuelleCarteRegarder.ToujoursUneCarteAleatoire.creer()
        );
        unePartieDeBuchette = Buchette.creer(joueurs, pioche, defausse, {
          nombreDeCartesInitialParJoueur: 1,
        });
        unePartieDeBuchette.distribuerLesCartes();
        await unePartieDeBuchette.revelerDesCartesAChaqueJoueur();

        // When
        await unePartieDeBuchette.jouerUneManche();
      });

      it("interrompt la manche", () => {
        // Then
        expect(unePartieDeBuchette.laMancheEstTerminee()).to.equal(true);
      });

      it("la pioche contient les bonnes cartes", () => {
        // Then
        expect(pioche.getCartes()).to.deep.equal([Trois.de.Carreau()]);
      });

      it("la défausse contient les bonnes cartes", () => {
        // Then
        expect(defausse.getCartes()).to.deep.equal([
          As.de.Trefle(),
          As.de.Coeur(),
        ]);
      });

      it("les points sont correctement comptabilisés", () => {
        // Then
        expect(joueurs[0].compterLesPoints()).to.equal(Deux.de.Pique().points);
        expect(joueurs[1].compterLesPoints()).to.equal(0);
      });
    });
  });

  describe(".commencerUnePartie()", () => {
    describe("quand la pioche se vide avant que les joueurs ne vident leur main", () => {
      let unePartieDeBuchette: Buchette;
      let joueurs: Joueur[];
      let defausse: Defausse;
      let pioche: Pioche;

      beforeEach(async () => {
        // Given
        pioche = Pioche.creer([
          Neuf.de.Trefle(),
          Dix.de.Pique(),
          Valet.de.Coeur(),
          Dame.de.Carreau(),
          Neuf.de.Coeur(),
          Dix.de.Carreau(),
          Valet.de.Pique(),
          Dame.de.Trefle(),
          Cinq.de.Pique(),
          Six.de.Trefle(),
          Sept.de.Carreau(),
          Huit.de.Coeur(),
        ]);
        defausse = Defausse.creer();
        joueurs = QuiParticipe.DeuxJoueurs.creer(
          OuPiocher.ToujoursLaPioche.creer(pioche, defausse),
          QuelleCarteJouer.ToujoursLaPremiereCarte.creer(),
          QuelleCarteRegarder.ToujoursUneCarteAleatoire.creer()
        );
        unePartieDeBuchette = Buchette.creer(joueurs, pioche, defausse, {
          seuilDePointsADepasser: 20,
          nombreDeCartesInitialParJoueur: 2,
          nombreDeCartesAReveler: 2,
        });

        // When
        await unePartieDeBuchette.jouerUnePartie();
      });

      it("interrompt la partie", async () => {
        // Then
        expect(unePartieDeBuchette.laPartieEstTerminee()).to.equal(true);
      });

      it("les points sont correctement comptabilisés", () => {
        // Then
        expect(joueurs[0].compterLesPoints()).to.equal(11);
        expect(joueurs[1].compterLesPoints()).to.equal(22);
      });
    });
  });
});
