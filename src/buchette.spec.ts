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
  Sept,
  Six,
  Trois,
  Valet,
} from "./carte.fixture";
import Joueur from "./joueur";

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
        expect(joueurs[0].getPoints()).to.equal(Trois.de.Coeur().points);
        expect(joueurs[1].getPoints()).to.equal(Deux.de.Pique().points);
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
        expect(joueurs[0].getPoints()).to.equal(Deux.de.Pique().points);
        expect(joueurs[1].getPoints()).to.equal(0);
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
        expect(joueurs[0].getPoints()).to.equal(11);
        expect(joueurs[1].getPoints()).to.equal(22);
      });
    });
  });
});
