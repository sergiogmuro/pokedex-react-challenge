import {Pokemon, PokemonListItem} from "@/src/types/pokemon.ts";

export function formatStatName(name: string): string {
  return name
      .split('-')
      .map((part) =>
          part.charAt(0).toUpperCase() +
          part.slice(1)
      )
      .join(' ');
}

export function formatHeight(height: number): string {
  return `${(height / 10).toFixed(1)} m`;
}

export function formatWeight(weight: number): string {
  return `${(weight / 10).toFixed(1)} kg`;
}

export function pokemonIDFormat(pokemon: PokemonListItem | Pokemon) {
  return `#${String(pokemon.id).padStart(3, '0')}`;
}
