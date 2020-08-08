import { describe, it } from "mocha";
import { expect } from "chai";

import Defausse from "./defausse";
import { As, Roi } from "./carte.fixture";

describe(Defausse.name, () => {
  describe(".creer()", () => {
    describe("avec les paramètres par défaut", () => {
      it("initialise un tas vide", () => {
        expect(Defausse.creer().compterLesCartes()).to.equal(0);
      });
    });
  });

  describe(".compterLesCartes()", () => {
    describe("quand il n'y a pas de carte", () => {
      it("retourne le nombre de cartes dans la défausse", () => {
        expect(Defausse.creer().compterLesCartes()).to.equal(0);
      });
    });

    describe("quand il y a plusieurs cartes", () => {
      it("retourne le nombre de cartes dans la défausse", () => {
        expect(
          Defausse.creer()
            .ajouter(As.de.Coeur())
            .ajouter(As.de.Trefle())
            .ajouter(Roi.de.Pique())
            .compterLesCartes()
        ).to.equal(3);
      });
    });
  });

  describe(".ajouter(carte)", () => {
    it("ajoute une carte au tas", () => {
      expect(
        Defausse.creer().ajouter(As.de.Trefle()).carteVisible()
      ).to.deep.equal(As.de.Trefle());
    });
  });

  describe(".carteVisible()", () => {
    describe("quand il n'y a pas de carte", () => {
      it("retourne null", () => {
        expect(Defausse.creer().carteVisible()).to.deep.equal(null);
      });
    });

    describe("quand il y a une seule carte", () => {
      it("révèle cette carte", () => {
        expect(
          Defausse.creer().ajouter(As.de.Coeur()).carteVisible()
        ).to.deep.equal(As.de.Coeur());
      });
    });

    describe("quand il y a une plusieurs cartes", () => {
      it("révèle la carte sur le dessus du tas", () => {
        expect(
          Defausse.creer()
            .ajouter(As.de.Coeur())
            .ajouter(As.de.Trefle())
            .ajouter(Roi.de.Pique())
            .carteVisible()
        ).to.deep.equal(Roi.de.Pique());
      });
    });
  });
});
