import { describe, it } from "mocha";
import { expect } from "chai";

import Pioche from "./pioche";
import Carte from "./carte";
import { As, Deux } from "./carte.fixture";

describe(Pioche.name, () => {
  describe(".creer()", () => {
    describe("avec les paramètres par défaut", () => {
      it("initialise la pioche avec 52 cartes", () => {
        expect(Pioche.creer().compterLesCartes()).to.equal(52);
      });
    });
  });

  describe(".melanger()", () => {
    it("mélange les cartes", () => {
      expect(
        Pioche.creer()
          .melanger()
          .getCartes()
          .map((c: Carte) => c.toString())
      ).not.to.deep.equal(
        Pioche.creer()
          .getCartes()
          .map((c: Carte) => c.toString())
      );
    });
  });

  describe(".retirerUneCarte()", () => {
    it("retourne la carte du dessus du paquet", () => {
      expect(
        Pioche.creer([As.de.Trefle(), Deux.de.Trefle()]).retirerUneCarte()
      ).to.deep.equal(As.de.Trefle());
    });

    it("enlève cette carte du paquet", () => {
      const pioche = Pioche.creer([As.de.Trefle(), Deux.de.Trefle()]);
      pioche.retirerUneCarte();
      expect(pioche.compterLesCartes()).to.equal(1);
    });

    it("préserve les bonnes cartes dans le paquet", () => {
      const pioche = Pioche.creer([As.de.Trefle(), Deux.de.Trefle()]);
      pioche.retirerUneCarte();
      expect(pioche.getCartes()).to.deep.equal([Deux.de.Trefle()]);
    });
  });
});
