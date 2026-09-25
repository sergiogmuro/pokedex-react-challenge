import {useCallback} from 'react';
import {useAppDispatch, useAppSelector} from '@/src/hooks/redux';
import {
    addFavorite, removeFavorite, selectIsFavorite, selectFavoriteCount, MAX_TEAM_SIZE
} from "@/src/features/favorites/favoritesSlice.js";
import {useToast} from "@/src/hooks/useToast.js";

export function useFavoritePokemon(pokemonId, pokemonName) {
    const dispatch = useAppDispatch();
    const {showToast} = useToast();

    const isFavorite = useAppSelector((state) => selectIsFavorite(state, pokemonId));

    const favoriteCount = useAppSelector(selectFavoriteCount);

    const add = useCallback(() => {
        if (isFavorite) {
            return;
        }

        if (favoriteCount >= MAX_TEAM_SIZE) {
            showToast('Your team already has 6 Pokémon.', 'error');
            return;
        }

        dispatch(addFavorite(pokemonId));
        showToast(`${pokemonName} added to your team.`, 'success');
    }, [dispatch, favoriteCount, isFavorite, pokemonId, pokemonName, showToast]);

    const remove = useCallback(() => {
        if (!isFavorite) {
            return;
        }

        dispatch(removeFavorite(pokemonId));
        showToast(`${pokemonName} removed from your team.`, 'info');
    }, [dispatch, isFavorite, pokemonId, pokemonName, showToast]);

    const toggle = useCallback(() => {
        if (isFavorite) {
            remove();
            return;
        }

        add();
    }, [add, isFavorite, remove]);

    return {
        isFavorite, favoriteCount, add, remove, toggle
    };
}
