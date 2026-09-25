export function formatStatName(name) {
    return name
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export function formatHeight(height) {
    return `${(height / 10).toFixed(1)} m`;
}

export function formatWeight(weight) {
    return `${(weight / 10).toFixed(1)} kg`;
}

export function pokemonIDFormat(pokemon) {
    return `#${String(pokemon.id).padStart(3, '0')}`;
}
