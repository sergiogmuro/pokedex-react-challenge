import type {Generation, PokemonListItem} from './pokemon';

export interface NamedResource {
  name: string;
  url: string;
}

export interface NamedResourceListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedResource[];
}

export interface PokemonListQuery {
  offset?: number;
  limit?: number;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  items: PokemonListItem[];
}

export interface PokemonTypeResponse {
  id: number;
  name: string;
  pokemon: Array<{
    slot: number;
    pokemon: NamedResource;
  }>;
}

export interface GenerationResponse extends Generation {
  abilities: NamedResource[];
  main_region: NamedResource;
  pokemon_species: NamedResource[];
}
