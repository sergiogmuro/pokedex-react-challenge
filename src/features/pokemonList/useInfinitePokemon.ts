import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  POKEMON_PAGE_SIZE,
  useGetPokemonCatalogQuery,
  useGetPokemonListQuery,
  useGetPokemonTypesQuery,
  useGetSelectedGenerationsQuery,
} from '@/src/services/pokemonApi';

import {useOnlineStatus} from '@/src/hooks/useOnlineStatus';

import type {PokemonFilters, PokemonType} from '@/src/types/filters';
import type {PokemonListItem} from '@/src/types/pokemon';

const ROOT_MARGIN = '200px 0px';

function extractResourceId(url: string): number {
  return Number(
      url
          .split('/')
          .filter(Boolean)
          .at(-1),
  );
}

export type PokemonDataStatus =
    | 'fresh'
    | 'cached'
    | 'updating'
    | 'offline';

export function useInfinitePokemon(
    filters: PokemonFilters,
) {
  const [offset, setOffset] = useState(0);

  const [pages, setPages] = useState<
      Map<number, PokemonListItem[]>
  >(() => new Map());

  const loadMoreRef =
      useRef<HTMLDivElement | null>(null);

  const paginationRef = useRef({
    nextOffset: POKEMON_PAGE_SIZE,
    isLoading: false,
    isIntersecting: false,
    hasMore: false,
    hasLoadedFirstPage: false,
  });

  const isOnline = useOnlineStatus();

  /*
   * --------------------------------------------------
   * DATA STATUS
   * --------------------------------------------------
   */

  const hasFetchedFromNetworkRef =
      useRef(false);

  const wasFetchingRef =
      useRef(false);

  const hasFilters =
      filters.search.trim().length > 0 ||
      filters.types.length > 0 ||
      filters.generations.length > 0;

  const typesKey = filters.types.join(',');
  const generationsKey =
      filters.generations.join(',');

  /*
   * --------------------------------------------------
   * PAGINATED API
   * --------------------------------------------------
   */
  const listQuery = useGetPokemonListQuery(
      {
        offset,
        limit: POKEMON_PAGE_SIZE,
      },
      {
        skip: hasFilters,
      },
  );

  /*
   * currentData is important here.
   *
   * `data` can temporarily contain the previous page
   * when the query argument changes.
   */
  const currentPage = listQuery.currentData;

  useEffect(() => {
    if (hasFilters || !currentPage) {
      return;
    }

    setPages((previous) => {
      const next = new Map(previous);

      next.set(offset, currentPage.items);

      return next;
    });

    if (offset === 0) {
      paginationRef.current.hasLoadedFirstPage = true;

      paginationRef.current.hasMore =
          Boolean(currentPage.next);
    }
  }, [
    hasFilters,
    currentPage,
    offset,
  ]);

  const listItems = useMemo(
      () =>
          Array.from(pages.entries())
              .sort(
                  ([a], [b]) => a - b,
              )
              .flatMap(([, page]) => page),
      [pages],
  );

  /*
   * --------------------------------------------------
   * FILTER DATA
   * --------------------------------------------------
   */
  const catalogQuery =
      useGetPokemonCatalogQuery(
          undefined,
          {
            skip: !hasFilters,
          },
      );

  const typesQuery =
      useGetPokemonTypesQuery(
          filters.types as PokemonType[],
          {
            skip:
                !hasFilters ||
                filters.types.length === 0,
          },
      );

  const generationsQuery =
      useGetSelectedGenerationsQuery(
          filters.generations,
          {
            skip:
                !hasFilters ||
                filters.generations.length === 0,
          },
      );

  /*
   * --------------------------------------------------
   * FILTERING
   * --------------------------------------------------
   */
  const filteredPokemon = useMemo(() => {
    if (!catalogQuery.data) {
      return [];
    }

    let result = catalogQuery.data.items;

    const search = filters.search
        .trim()
        .toLowerCase();

    if (search) {
      result = result.filter((pokemon) =>
          pokemon.name
              .toLowerCase()
              .includes(search),
      );
    }

    if (
        filters.types.length > 0 &&
        typesQuery.data
    ) {
      const ids = new Set<number>();

      for (const type of typesQuery.data) {
        for (const entry of type.pokemon) {
          const id = extractResourceId(
              entry.pokemon.url,
          );

          if (id > 0) {
            ids.add(id);
          }
        }
      }

      result = result.filter((pokemon) =>
          ids.has(pokemon.id),
      );
    }

    if (
        filters.generations.length > 0 &&
        generationsQuery.data
    ) {
      const names = new Set<string>();

      for (
          const generation of
          generationsQuery.data
          ) {
        for (
            const species of
        generation.pokemon_species ?? []
            ) {
          names.add(species.name);
        }
      }

      result = result.filter((pokemon) =>
          names.has(pokemon.name),
      );
    }

    return result;
  }, [
    catalogQuery.data,
    typesQuery.data,
    generationsQuery.data,
    filters.search,
    typesKey,
    generationsKey,
  ]);

  const visiblePokemon = useMemo(
      () =>
          filteredPokemon.slice(
              0,
              offset + POKEMON_PAGE_SIZE,
          ),
      [
        filteredPokemon,
        offset,
      ],
  );

  const pokemon = hasFilters
      ? visiblePokemon
      : listItems;

  /*
   * --------------------------------------------------
   * PAGINATION STATE
   * --------------------------------------------------
   */
  const hasMore = hasFilters
      ? visiblePokemon.length <
      filteredPokemon.length
      : Boolean(currentPage?.next);

  useEffect(() => {
    paginationRef.current.hasMore =
        hasMore;
  }, [hasMore]);

  const isLoading = hasFilters
      ? catalogQuery.isLoading ||
      typesQuery.isLoading ||
      generationsQuery.isLoading
      : listQuery.isLoading;

  const isFetching = hasFilters
      ? catalogQuery.isFetching ||
      typesQuery.isFetching ||
      generationsQuery.isFetching
      : listQuery.isFetching;

  const isError = hasFilters
      ? catalogQuery.isError ||
      typesQuery.isError ||
      generationsQuery.isError
      : listQuery.isError;

  /*
   * --------------------------------------------------
   * DATA STATUS
   * --------------------------------------------------
   *
   * A request starting means we are updating.
   *
   * Once that request finishes successfully,
   * the data is considered fresh.
   *
   * If data exists but no network request has been
   * completed during this session, it is considered
   * cached. This covers redux-persist hydration.
   */
  useEffect(() => {
    if (isFetching) {
      wasFetchingRef.current = true;

      return;
    }

    if (
        wasFetchingRef.current &&
        !isError
    ) {
      hasFetchedFromNetworkRef.current = true;
      wasFetchingRef.current = false;
    }
  }, [
    isFetching,
    isError,
  ]);

  const dataStatus: PokemonDataStatus =
      isFetching
          ? 'updating'
          : hasFetchedFromNetworkRef.current
              ? 'fresh'
              : pokemon.length > 0
                  ? 'cached'
                  : !isOnline
                      ? 'offline'
                      : 'updating';

  /*
   * --------------------------------------------------
   * RESET
   * --------------------------------------------------
   */
  const filtersKey = [
    filters.search.trim(),
    typesKey,
    generationsKey,
  ].join('|');

  const previousFiltersKeyRef =
      useRef(filtersKey);

  useEffect(() => {
    if (
        previousFiltersKeyRef.current ===
        filtersKey
    ) {
      return;
    }

    previousFiltersKeyRef.current =
        filtersKey;

    setOffset(0);

    paginationRef.current = {
      nextOffset: POKEMON_PAGE_SIZE,
      isLoading: false,
      isIntersecting: false,
      hasMore: true,
      hasLoadedFirstPage: false,
    };

    hasFetchedFromNetworkRef.current =
        false;

    wasFetchingRef.current = false;
  }, [filtersKey]);

  /*
   * --------------------------------------------------
   * LOAD MORE
   * --------------------------------------------------
   */
  const loadMore = useCallback(() => {
    const pagination =
        paginationRef.current;

    if (
        !pagination.hasLoadedFirstPage ||
        !pagination.hasMore ||
        pagination.isLoading ||
        isFetching
    ) {
      return;
    }

    const nextOffset =
        pagination.nextOffset;

    pagination.isLoading = true;

    pagination.nextOffset =
        nextOffset + POKEMON_PAGE_SIZE;

    setOffset(nextOffset);
  }, [isFetching]);

  useEffect(() => {
    paginationRef.current.isLoading =
        isFetching;

    if (
        isFetching ||
        !paginationRef.current.isIntersecting ||
        !paginationRef.current.hasMore
    ) {
      return;
    }

    loadMore();
  }, [
    isFetching,
    offset,
    visiblePokemon.length,
    loadMore,
  ]);

  /*
   * --------------------------------------------------
   * INTERSECTION OBSERVER
   * --------------------------------------------------
   */
  useEffect(() => {
    const target =
        loadMoreRef.current;

    if (!target) {
      return;
    }

    const observer =
        new IntersectionObserver(
            ([entry]) => {
              paginationRef.current
                  .isIntersecting =
                  entry.isIntersecting;

              if (entry.isIntersecting) {
                loadMore();
              }
            },
            {
              root: null,
              rootMargin: ROOT_MARGIN,
              threshold: 0,
            },
        );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [loadMore]);

  /*
   * --------------------------------------------------
   * REFETCH
   * --------------------------------------------------
   */
  const refetch = useCallback(() => {
    hasFetchedFromNetworkRef.current =
        false;

    if (hasFilters) {
      catalogQuery.refetch();

      if (filters.types.length > 0) {
        typesQuery.refetch();
      }

      if (filters.generations.length > 0) {
        generationsQuery.refetch();
      }

      return;
    }

    listQuery.refetch();
  }, [
    hasFilters,
    filters.types.length,
    filters.generations.length,
    catalogQuery.refetch,
    typesQuery.refetch,
    generationsQuery.refetch,
    listQuery.refetch,
  ]);

  return {
    pokemon,
    loadMoreRef,
    isLoading,
    isFetching,
    isError,
    hasMore,
    refetch,
    dataStatus,
  };
}
