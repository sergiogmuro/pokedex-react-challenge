import {useCallback} from "react";
import {useSearchParams} from 'react-router-dom';
import {
  type PokemonFilters,
  type PokemonGeneration,
} from '@/src/types/filters';
import {isPokemonGeneration, isPokemonType} from "@/src/utils/filters";

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('q') ?? '';

  const types = searchParams
      .getAll('type')
      .filter(isPokemonType);

  const generations = searchParams
      .getAll('gen')
      .filter(isPokemonGeneration)
      .map(Number) as PokemonGeneration[];

  const filters: PokemonFilters = {
    search,
    types,
    generations,
  };

  const updateFilters = useCallback(
      (next: Partial<PokemonFilters>) => {
        const params = new URLSearchParams(searchParams);

        if (next.search !== undefined) {
          const value = next.search.trim();

          if (value) {
            params.set('q', value);
          } else {
            params.delete('q');
          }
        }

        if (next.types !== undefined) {
          params.delete('type');

          next.types.forEach((type) => {
            params.append('type', type);
          });
        }

        if (next.generations !== undefined) {
          params.delete('gen');

          next.generations.forEach((generation) => {
            params.append('gen', String(generation));
          });
        }

        setSearchParams(params, {
          replace: true,
        });
      },
      [searchParams, setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams({}, {replace: true});
  }, [setSearchParams]);

  return {
    filters,
    updateFilters,
    clearFilters,
  };
}
