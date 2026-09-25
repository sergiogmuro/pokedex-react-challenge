import {createApi} from '@reduxjs/toolkit/query/react';
import {REHYDRATE} from 'redux-persist';
import {apiClient} from './apiClient';
import {extractResourceId, getPokemonSpriteUrl, mapPokemonListResponse} from '@/src/utils/pokemon';

export const POKEMON_PAGE_SIZE = 20;

export const pokemonApi = createApi({
    reducerPath: 'pokemonApi',

    baseQuery: apiClient,

    extractRehydrationInfo(action, {reducerPath}) {
        if (action.type !== REHYDRATE) {
            return undefined;
        }

        if (action.key === reducerPath) {
            return action.payload;
        }

        return undefined;
    },

    tagTypes: ['Pokemon', 'PokemonList', 'PokemonType', 'Generation'],

    endpoints: (builder) => ({
        getPokemonList: builder.query({
            async queryFn({
                              offset = 0, limit = POKEMON_PAGE_SIZE
                          }, _api, _extraOptions, baseQuery) {
                const listResponse = await baseQuery({
                    url: 'pokemon', params: {
                        offset, limit
                    }
                });

                if (listResponse.error) {
                    return {
                        error: listResponse.error
                    };
                }

                const response = listResponse.data;

                const details = await Promise.all(response.results.map(async (pokemon) => {
                    const id = extractResourceId(pokemon.url);

                    const detailResponse = await baseQuery(`pokemon/${id}`);

                    if (detailResponse.error) {
                        return null;
                    }

                    return detailResponse.data;
                }));

                return {
                    data: mapPokemonListResponse(response, details.filter((pokemon) => pokemon !== null))
                };
            },

            providesTags: (result, _error, arg) => [{
                type: 'PokemonList', id: `page-${arg.offset ?? 0}`
            },

                ...(result?.items ?? []).map((pokemon) => ({
                    type: 'Pokemon', id: pokemon.id
                }))],

            keepUnusedDataFor: 300
        }),

        getPokemon: builder.query({
            async queryFn(id, _api, _extraOptions, baseQuery) {
                const response = await baseQuery(`pokemon/${id}`);

                if (response.error) {
                    return {
                        error: response.error
                    };
                }

                const pokemon = response.data;

                return {
                    data: {
                        ...pokemon, game_indices: [], moves: []
                    }
                };
            },

            providesTags: (result) => result ? [{
                type: 'Pokemon', id: result.id
            }] : [],

            keepUnusedDataFor: 300
        }),

        getPokemonTypes: builder.query({
            async queryFn(types, _api, _extraOptions, baseQuery) {
                const results = [];

                for (const type of types) {
                    const response = await baseQuery(`type/${type}`);

                    if (response.error) {
                        return {
                            error: response.error
                        };
                    }

                    results.push(response.data);
                }

                return {
                    data: results
                };
            },

            providesTags: (result) => result?.map((type) => ({
                type: 'PokemonType', id: type.name
            })) ?? [],

            keepUnusedDataFor: 3600
        }),

        getPokemonType: builder.query({
            query: (type) => `type/${type}`,

            providesTags: (_result, _error, type) => [{
                type: 'PokemonType', id: type
            }],

            keepUnusedDataFor: 3600
        }),

        getGenerations: builder.query({
            query: () => 'generation',

            transformResponse: (response) => response.results.map((generation) => ({
                id: extractResourceId(generation.url), name: generation.name, url: generation.url
            })),

            providesTags: [{
                type: 'Generation', id: 'LIST'
            }],

            keepUnusedDataFor: 300
        }),

        getGeneration: builder.query({
            query: (generation) => `generation/${generation}`,

            providesTags: (_result, _error, generation) => [{
                type: 'Generation', id: generation
            }],

            keepUnusedDataFor: 3600
        }),

        getSelectedGenerations: builder.query({
            async queryFn(generations, _api, _extraOptions, baseQuery) {
                const results = [];

                for (const generation of generations) {
                    const response = await baseQuery(`generation/${generation}`);

                    if (response.error) {
                        return {
                            error: response.error
                        };
                    }

                    results.push(response.data);
                }

                return {
                    data: results
                };
            },

            providesTags: (result) => result?.map((generation) => ({
                type: 'Generation', id: generation.id
            })) ?? [],

            keepUnusedDataFor: 3600
        }),

        getPokemonCatalog: builder.query({
            async queryFn(_arg, _api, _extraOptions, baseQuery) {
                const listResponse = await baseQuery({
                    url: 'pokemon', params: {
                        limit: 2000
                    }
                });

                if (listResponse.error) {
                    return {
                        error: listResponse.error
                    };
                }

                const response = listResponse.data;

                return {
                    data: {
                        count: response.count, next: response.next, previous: response.previous,

                        items: response.results.map((pokemon) => ({
                            id: extractResourceId(pokemon.url), name: pokemon.name,

                            sprite: getPokemonSpriteUrl(extractResourceId(pokemon.url)),

                            types: []
                        }))
                    }
                };
            },

            providesTags: [{
                type: 'PokemonList', id: 'CATALOG'
            }],

            keepUnusedDataFor: 3600
        })
    })
});

export const {
    useGetPokemonListQuery,
    useGetPokemonQuery,
    useGetPokemonTypesQuery,
    useGetPokemonTypeQuery,
    useGetGenerationsQuery,
    useGetGenerationQuery,
    useGetSelectedGenerationsQuery,
    useGetPokemonCatalogQuery
} = pokemonApi;
