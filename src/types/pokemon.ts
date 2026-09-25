export interface PokemonListItem {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  front_female?: string | null;
  front_shiny_female?: string | null;
  back_female?: string | null;
  back_shiny_female?: string | null;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
}

export interface PokemonTypeResource {
  id?: number;
  name: string;
  url: string;
}

export interface Generation {
  id: number;
  name: string;
  url: string;
}
