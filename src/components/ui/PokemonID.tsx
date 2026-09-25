export function PokemonID({pokemon}) {
  return `#${String(pokemon.id).padStart(3, '0')}`;
}
