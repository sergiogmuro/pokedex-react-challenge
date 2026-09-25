export const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

export const POKEMON_GENERATIONS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9,
] as const;

export type PokemonGeneration = (typeof POKEMON_GENERATIONS)[number];

export interface PokemonFilters {
  search: string;
  types: PokemonType[];
  generations: PokemonGeneration[];
}
