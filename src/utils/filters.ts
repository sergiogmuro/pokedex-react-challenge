import {
  POKEMON_GENERATIONS,
  POKEMON_TYPES,
  type PokemonGeneration,
  type PokemonType,
} from '@/src/types/filters';

export function isPokemonType(value: string): value is PokemonType {
  return POKEMON_TYPES.includes(value as PokemonType);
}

export function isPokemonGeneration(value: string): value is `${PokemonGeneration}` {
  return POKEMON_GENERATIONS.some(
      (generation) => String(generation) === value,
  );
}
