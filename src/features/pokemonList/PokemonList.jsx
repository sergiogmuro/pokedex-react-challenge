import { useState, useEffect } from 'react';
import { useInfinitePokemon } from "@/src/features/pokemonList/useInfinitePokemon";
import { PokemonCardSkeleton } from "@/src/features/pokemonList/PokemonCardSkeleton";
import { PokemonCard } from "@/src/features/pokemonList/PokemonCard";
import { useUrlFilters } from "@/src/features/search/useUrlFilters";
import { SearchBar } from "@/src/features/search/SearchBar";
import { FiltersPanel } from "@/src/features/search/FiltersPanel";
import { PageHeader } from "@/src/components/ui/PageHeader";

import styles from './PokemonList.module.css';

const INITIAL_SKELETONS = 20;
const LOAD_MORE_SKELETONS = 4;

export function PokemonList() {
    const { filters } = useUrlFilters();
    const [showScrollTop, setShowScrollTop] = useState(false);

    const {
        pokemon,
        loadMoreRef,
        isLoading,
        isFetching,
        isError,
        hasMore,
        refetch,
        dataStatus,
    } = useInfinitePokemon(filters);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <main className={styles.container}>
            <PageHeader
                eyebrow="Pokédex"
                title="Pokémon"
                counter={`${pokemon.length} Pokémon`}
            />

            <div
                className={`${styles.dataStatus} ${styles[dataStatus]}`}
                aria-live="polite"
            >
        <span
            className={styles.dataStatusDot}
            aria-hidden="true"
        />

                {dataStatus === 'updating' && 'Actualizando datos…'}
                {dataStatus === 'cached' && 'Mostrando datos en caché'}
                {dataStatus === 'fresh' && 'Datos actualizados'}
                {dataStatus === 'offline' && 'Sin conexión'}
            </div>

            <div className={styles.filters}>
                <SearchBar />
                <FiltersPanel />
            </div>

            {isLoading && (
                <div className={styles.grid}>
                    {Array.from({ length: INITIAL_SKELETONS }).map((_, index) => (
                        <PokemonCardSkeleton key={index} />
                    ))}
                </div>
            )}

            {isError && (
                <div className={styles.error}>
                    <h2>Unable to load Pokémon</h2>
                    <p>Something went wrong while loading the Pokémon list.</p>
                    <button type="button" onClick={refetch}>
                        Retry
                    </button>
                </div>
            )}

            {!isLoading && !isError && (
                <>
                    {pokemon.length === 0 ? (
                        <div className={styles.empty}>
                            <h2>No Pokémon found</h2>
                            <p>Try changing your search or filters.</p>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {pokemon.map((item) => (
                                <PokemonCard key={item.id} pokemon={item} />
                            ))}
                        </div>
                    )}

                    {hasMore && (
                        <>
                            <div
                                ref={loadMoreRef}
                                className={styles.sentinel}
                                aria-hidden="true"
                            />

                            {isFetching && (
                                <div className={styles.grid}>
                                    {Array.from({ length: LOAD_MORE_SKELETONS }).map((_, index) => (
                                        <PokemonCardSkeleton key={index} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {!hasMore && pokemon.length > 0 && (
                        <p className={styles.endMessage}>
                            You have reached the end of the Pokédex.
                        </p>
                    )}
                </>
            )}

            {showScrollTop && (
                <button
                    type="button"
                    onClick={scrollToTop}
                    className={styles.scrollTopButton}
                    aria-label="Volver arriba"
                >
                    ↑
                </button>
            )}
        </main>
    );
}
