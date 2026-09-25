import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type {RootState} from '@/src/app/store';

export const MAX_TEAM_SIZE = 6;

interface FavoritesState {
  pokemonIds: number[];
}

const initialState: FavoritesState = {
  pokemonIds: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (
        state,
        action: PayloadAction<number>,
    ) => {
      const pokemonId = action.payload;

      if (state.pokemonIds.includes(pokemonId)) {
        return;
      }

      if (state.pokemonIds.length >= MAX_TEAM_SIZE) {
        return;
      }

      state.pokemonIds.push(pokemonId);
    },

    removeFavorite: (
        state,
        action: PayloadAction<number>,
    ) => {
      state.pokemonIds =
          state.pokemonIds.filter(
              (id) => id !== action.payload,
          );
    },

    toggleFavorite: (
        state,
        action: PayloadAction<number>,
    ) => {
      const pokemonId = action.payload;

      const index =
          state.pokemonIds.indexOf(pokemonId);

      if (index >= 0) {
        state.pokemonIds.splice(index, 1);
        return;
      }

      if (state.pokemonIds.length >= MAX_TEAM_SIZE) {
        return;
      }

      state.pokemonIds.push(pokemonId);
    },

    reorderFavorites: (
        state,
        action: PayloadAction<number[]>,
    ) => {
      const uniqueIds = [
        ...new Set(action.payload),
      ];

      state.pokemonIds = uniqueIds.slice(0, MAX_TEAM_SIZE);
    },
  },
});


export const {
  addFavorite,
  removeFavorite,
  toggleFavorite,
  reorderFavorites,
} = favoritesSlice.actions;

export const favoritesReducer =
    favoritesSlice.reducer;

export const selectFavoriteIds = (
    state: RootState,
) => state.favorites.pokemonIds;

export const selectIsFavorite = (
    state: RootState,
    pokemonId: number,
) =>
    state.favorites.pokemonIds.includes(
        pokemonId,
    );

export const selectFavoriteCount = (
    state: RootState,
) => state.favorites.pokemonIds.length;
