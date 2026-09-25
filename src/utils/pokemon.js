export function extractResourceId(url) {
    const segments = url.split('/').filter(Boolean);

    return Number(segments.at(-1));
}

export function getPokemonSpriteUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getPokemonArtworkUrl(pokemon) {
    return pokemon.sprites.front_default ?? null;
}

export function mapPokemonListResponse(response, details) {
    const detailsById = new Map(details
        .filter(Boolean)
        .map((pokemon) => [pokemon.id, pokemon,]),);

    return {
        count: response.count, next: response.next, previous: response.previous,

        items: response.results.map((pokemon) => {
            const id = extractResourceId(pokemon.url);
            const detail = detailsById.get(id);

            return {
                id, name: pokemon.name,

                sprite: detail ? getPokemonArtworkUrl(detail) ?? getPokemonSpriteUrl(id) : getPokemonSpriteUrl(id),

                types: detail?.types?.map(({type}) => type.name,) ?? [],
            };
        }),
    };
}
