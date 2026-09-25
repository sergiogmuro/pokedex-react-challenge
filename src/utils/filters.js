import {POKEMON_GENERATIONS, POKEMON_TYPES} from "@/src/app/constants.js";

export function isPokemonType(value) {
    return POKEMON_TYPES.includes(value);
}

export function isPokemonGeneration(value) {
    return POKEMON_GENERATIONS.some((generation) => String(generation) === value);
}
