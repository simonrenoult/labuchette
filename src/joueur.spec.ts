import { describe, it } from "mocha";
import { expect } from "chai";

import Joueur from "./joueur";
import Pioche from "./pioche";
import Defausse from "./defausse";
import CarteDeLaMain from "./carte_de_la_main";
import { Huit, Roi, Valet } from "./carte.fixture";
import { As } from "./carte.fixture";
import { unJoueur } from "./joueur.fixture";

describe(Joueur.name, () => {
  describe(".piocher()", () => {
    it("ajoute une carte de la pioche à la main du joueur", async () => {
      // Given
      const pioche = Pioche.creer([As.de.Coeur()]);
      const joueur = unJoueur({ pioche });

      // When
      await joueur.piocher();

      // Then
      expect(joueur.consulterLaMain()).to.deep.equal([
        CarteDeLaMain.retenir(As.de.Coeur()),
      ]);
    });

    it("enlève une carte de la pioche", async () => {
      // Given
      const pioche = Pioche.creer([As.de.Coeur()]);
      const joueur = unJoueur({ pioche });

      // When
      await joueur.piocher();

      // Then
      expect(pioche.compterLesCartes()).to.equal(0);
    });
  });

  describe(".constituerLaMainDeDepart(cartes)", () => {
    it("ajoute les cartes à la main sans les retenir", async () => {
      // Given
      const joueur = unJoueur();

      // When
      await joueur.constituerLaMainDeDepart([As.de.Carreau()]);

      // Then
      expect(joueur.consulterLaMain()).to.deep.equal([
        CarteDeLaMain.faceCachee(As.de.Carreau()),
      ]);
    });
  });

  describe(".jouerUneCarte()", () => {
    it("enlève la carte choisie de la main du joueur", async () => {
      // Given
      const defausse = Defausse.creer();
      const joueur = unJoueur({ defausse });
      joueur.constituerLaMainDeDepart([As.de.Coeur()]);

      // When
      await joueur.jouerUneCarte(defausse);

      // Then
      expect(joueur.consulterLaMain()).to.deep.equal([]);
    });

    it("ajoute la carte choisie au tas de jeu", async () => {
      // Given
      const defausse = Defausse.creer();
      const joueur = unJoueur({ defausse });
      joueur.constituerLaMainDeDepart([As.de.Coeur()]);

      // When
      await joueur.jouerUneCarte(defausse);

      // Then
      expect(defausse.getCartes()).to.deep.equal([As.de.Coeur()]);
    });
  });

  describe(".seDefausser(carteDeReference)", () => {
    describe("quand le chiffre de la carte de référence n'est pas dans la main", () => {
      it("ne modifie pas la main", async () => {
        // Given
        const defausse = Defausse.creer();
        const joueur = unJoueur({ defausse });
        joueur.constituerLaMainDeDepart([As.de.Coeur()]);

        // When
        await joueur.seDefausser(Roi.de.Pique(), defausse);

        // Then
        expect(joueur.consulterLaMain()).to.deep.equal([
          CarteDeLaMain.faceCachee(As.de.Coeur()),
        ]);
      });
    });

    describe("quand le chiffre de la carte de référence est présent dans une carte de la main", () => {
      it("retire cette carte de la main", async () => {
        // Given
        const defausse = Defausse.creer();
        const joueur = unJoueur({ defausse });
        joueur.constituerLaMainDeDepart([As.de.Coeur()]);

        // When
        await joueur.seDefausser(As.de.Pique(), defausse);

        // Then
        expect(joueur.consulterLaMain()).to.deep.equal([]);
      });

      it("ajoute cette carte au tas de jeu", async () => {
        // Given
        const defausse = Defausse.creer();
        const joueur = unJoueur({ defausse });
        joueur.constituerLaMainDeDepart([As.de.Coeur()]);

        // When
        await joueur.seDefausser(As.de.Pique(), defausse);

        // Then
        expect(defausse.getCartes()).to.deep.equal([As.de.Coeur()]);
      });
    });

    describe("quand le chiffre de la carte de référence est présent dans plusieurs cartes de la main", () => {
      it("retire ces cartes de le main", async () => {
        // Given
        const defausse = Defausse.creer();
        const joueur = unJoueur({ defausse });
        joueur.constituerLaMainDeDepart([As.de.Coeur(), As.de.Trefle()]);

        // When
        await joueur.seDefausser(As.de.Pique(), defausse);

        // Then
        expect(joueur.consulterLaMain()).to.deep.equal([]);
      });
    });
  });

  describe(".compterLesPointsDeLaMain()", () => {
    it("additione les points des cartes de la main", async () => {
      // Given
      const joueur = unJoueur();
      joueur.constituerLaMainDeDepart([
        As.de.Coeur(),
        Valet.de.Trefle(),
        Huit.de.Pique(),
      ]);

      // When
      const score = joueur.compterLesPointsDeLaMain();

      // Then
      expect(score).to.equal(20);
    });
  });
});
