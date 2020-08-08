import Defausse from "./defausse";
import Pioche from "./pioche";

export interface OuPiocher {
  choisir(): Promise<Pioche | Defausse>;
}

export class ToujoursLaPioche implements OuPiocher {
  public static creer(pioche: Pioche, defausse: Defausse): ToujoursLaPioche {
    return new ToujoursLaPioche(pioche, defausse);
  }

  private constructor(
    private readonly pioche: Pioche,
    private readonly defausse: Defausse
  ) {}

  async choisir(): Promise<Pioche | Defausse> {
    return this.pioche;
  }
}
