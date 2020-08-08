export default class Carte {
  static creer(couleur: string, chiffre: string, points: number): Carte {
    return new Carte(couleur, chiffre, points);
  }

  static aPartirDe(carte: Carte): Carte {
    return new Carte(carte.couleur, carte.chiffre, carte.points);
  }

  constructor(
    public readonly couleur: string,
    public readonly chiffre: string,
    public readonly points: number
  ) {}

  toString(): string {
    return `${this.chiffre} de ${this.couleur} (${this.points} point(s))`;
  }

  equals(carte: Carte): boolean {
    return this.chiffre === carte.chiffre;
  }

  copy(): Carte {
    return Carte.aPartirDe(this);
  }
}
