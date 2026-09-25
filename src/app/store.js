import {configureStore} from '@reduxjs/toolkit';
import {persistStore} from 'redux-persist';

import {rootReducer} from '@/src/app/rootReducer';
import {pokemonApi} from '@/src/services/pokemonApi';

export const store = configureStore({
    reducer: rootReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: {
                ignoredPaths: [
                    pokemonApi.reducerPath
                ]
            },

            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE',
                    'persist/REGISTER',
                    'persist/FLUSH',
                    'persist/PAUSE',
                    'persist/PURGE'
                ]
            }
        }).concat(pokemonApi.middleware)
});

export const persistor = persistStore(store);
