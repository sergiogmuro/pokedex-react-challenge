import {combineReducers} from '@reduxjs/toolkit';
import {createTransform, persistReducer} from 'redux-persist';
import storage from '@/src/app/webStorage';
import {pokemonApi} from "@/src/services/pokemonApi";
import {favoritesReducer} from "@/src/features/favorites/favoritesSlice";

const persistStorage = storage;

const favoritesPersistConfig = {
  key: 'favorites',
  storage: persistStorage,
};

const pokemonApiTransform =
    createTransform((state: ReturnType<typeof pokemonApi.reducer>) => {
          return {
            ...state,

            queries: Object.fromEntries(
                Object.entries(state.queries ?? {})
                    .filter(([key]) =>
                        key.startsWith('getPokemonList(')
                    ),
            ),
          };
        },

        (state) => state,
    );

const pokemonApiReducer = (
    state: ReturnType<typeof pokemonApi.reducer> | undefined,
    action: any,
) => {
  return pokemonApi.reducer(state, action);
};

const pokemonApiPersistConfig = {
  key: 'pokemonApi',
  version: 2,
  storage: persistStorage,

  transforms: [
    pokemonApiTransform,
  ],
};

export const rootReducer = combineReducers({
  [pokemonApi.reducerPath]: persistReducer(
      pokemonApiPersistConfig,
      pokemonApiReducer,
  ),

  favorites: persistReducer(
      favoritesPersistConfig,
      favoritesReducer,
  ),
});

export type RootState = ReturnType<typeof rootReducer>;
