import lesUnsApresLesAutres from "p-map-series";
import tantQue from "p-whilst";
import faireXFois from "p-times";

import Joueur from "./joueur";
import Pioche from "./pioche";
import Defausse from "./defausse";
import { creerUneBoucleDe } from "./util";

type BuchetteOptions = {
  nombreDeCartesInitialParJoueur: number;
  nombreDeCartesAReveler: number;
  seuilDePointsADepasser: number;
};

type BuchetteArgsOptions = {
  nombreDeCartesInitialParJoueur?: number;
  nombreDeCartesAReveler?: number;
  seuilDePointsADepasser?: number;
};

const DEFAULT_OPTIONS = {
  nombreDeCartesAReveler: 2,
  nombreDeCartesInitialParJoueur: 4,
  seuilDePointsADepasser: 100,
};

export default class Buchette {
  static creer(
    joueurs: Joueur[],
    pioche: Pioche,
    defausse: Defausse,
    options?: BuchetteArgsOptions
  ): Buchette {
    return new Buchette(joueurs, pioche, defausse, {
      ...DEFAULT_OPTIONS,
      ...options,
    });
  }

  constructor(
    private readonly joueurs: Joueur[],
    private readonly pioche: Pioche,
    private readonly defausse: Defausse,
    private readonly options: BuchetteOptions
  ) {}

  async jouerUnePartie(): Promise<void> {
    await tantQue(
      () => this.laPartieNEstPasTerminee(),
      async () => {
        this.regrouperLesCartesDansLaPioche();
        this.distribuerLesCartes();
        await this.revelerDesCartesAChaqueJoueur();
        await this.jouerUneManche();
      }
    );
  }

  regrouperLesCartesDansLaPioche(): void {
    this.defausse.mettreDansLa(this.pioche);
    this.joueurs.forEach((j) => j.mettreLaMainDans(this.pioche));
  }

  distribuerLesCartes(): void {
    this.joueurs.forEach((joueurActif: Joueur) => {
      if (this.pioche.estVide()) throw new Error("La pioche est vide");

      joueurActif.constituerLaMainDeDepart(
        Array.from(Array(this.options.nombreDeCartesInitialParJoueur), () =>
          this.pioche.retirerUneCarte()
        )
      );
    });
  }

  async revelerDesCartesAChaqueJoueur(): Promise<void> {
    await lesUnsApresLesAutres(this.joueurs, async (joueur: Joueur) => {
      await faireXFois(this.options.nombreDeCartesAReveler, async () =>
        joueur.seSouvenirDeLaCarte(await joueur.regarderUneCarteDeSaMain())
      );
    });
  }

  async jouerUneManche(): Promise<void> {
    const boucleDeJoueurs = creerUneBoucleDe(this.joueurs);
    await tantQue(
      () => this.laMancheNEstPasTerminee(),
      async () => {
        const joueurActif = boucleDeJoueurs.prochainJoueur();

        await joueurActif.piocher();
        await joueurActif.jouerUneCarte(this.defausse);

        const carteJouee = this.defausse.carteVisible();
        if (carteJouee === null) return;

        await lesUnsApresLesAutres(this.joueurs, async (joueur: Joueur) => {
          await joueur.seDefausser(carteJouee, this.defausse);
        });
      }
    );

    this.mettreAJourLesPointsDeChaqueJoueur();
  }

  mettreAJourLesPointsDeChaqueJoueur(): void {
    this.joueurs.forEach((j) => {
      j.ajouterPoints(j.compterLesPointsDeLaMain());

      // Faire une chèvre
      if (
        j.compterLesPoints() ===
        Math.round(this.options.seuilDePointsADepasser / 2)
      ) {
        j.setPoints(Math.round(this.options.seuilDePointsADepasser / 2) - 5);
      }

      // Faire une buchette
      if (j.compterLesPoints() === this.options.seuilDePointsADepasser) {
        j.setPoints(Math.round(this.options.seuilDePointsADepasser / 2));
      }
    });
  }

  compterLesJoueurs(): number {
    return this.joueurs.length;
  }

  laMancheEstTerminee(): boolean {
    const laPiocheEstVide = this.pioche.estVide();
    const unJoueurNAPlusDeCarteEnMain = this.joueurs.some((joueur: Joueur) =>
      joueur.nAPlusDeCartes()
    );
    return laPiocheEstVide || unJoueurNAPlusDeCarteEnMain;
  }

  laMancheNEstPasTerminee(): boolean {
    return this.laMancheEstTerminee() === false;
  }

  laPartieEstTerminee(): boolean {
    return this.joueurs.some(
      (j) => j.compterLesPoints() > this.options.seuilDePointsADepasser
    );
  }

  laPartieNEstPasTerminee(): boolean {
    return this.laPartieEstTerminee() === false;
  }
}
