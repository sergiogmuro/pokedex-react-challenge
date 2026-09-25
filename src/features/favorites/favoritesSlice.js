import {createSlice} from '@reduxjs/toolkit';

export const MAX_TEAM_SIZE = 6;

const initialState = {
    pokemonIds: []
};

const favoritesSlice = createSlice({
    name: 'favorites', initialState, reducers: {
        addFavorite: (state, action) => {
            const pokemonId = action.payload;

            if (state.pokemonIds.includes(pokemonId)) {
                return;
            }

            if (state.pokemonIds.length >= MAX_TEAM_SIZE) {
                return;
            }

            state.pokemonIds.push(pokemonId);
        },

        removeFavorite: (state, action) => {
            state.pokemonIds = state.pokemonIds.filter((id) => id !== action.payload);
        },

        toggleFavorite: (state, action) => {
            const pokemonId = action.payload;

            const index = state.pokemonIds.indexOf(pokemonId);

            if (index >= 0) {
                state.pokemonIds.splice(index, 1);
                return;
            }

            if (state.pokemonIds.length >= MAX_TEAM_SIZE) {
                return;
            }

            state.pokemonIds.push(pokemonId);
        },

        reorderFavorites: (state, action) => {
            const uniqueIds = [...new Set(action.payload)];

            state.pokemonIds = uniqueIds.slice(0, MAX_TEAM_SIZE);
        }
    }
});

export const {
    addFavorite, removeFavorite, toggleFavorite, reorderFavorites
} = favoritesSlice.actions;

export const favoritesReducer = favoritesSlice.reducer;
export const selectFavoriteIds = (state) => state.favorites.pokemonIds;
export const selectIsFavorite = (state, pokemonId) => state.favorites.pokemonIds.includes(pokemonId);
export const selectFavoriteCount = (state) => state.favorites.pokemonIds.length;
