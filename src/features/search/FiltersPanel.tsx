import {
  POKEMON_GENERATIONS,
  POKEMON_TYPES,
  type PokemonGeneration,
  type PokemonType,
} from '@/src/types/filters';

import {useUrlFilters} from "@/src/features/search/useUrlFilters";

import styles from './FiltersPanel.module.css';

const TYPE_LABELS: Record<PokemonType, string> = {
  normal: 'Normal',
  fire: 'Fire',
  water: 'Water',
  electric: 'Electric',
  grass: 'Grass',
  ice: 'Ice',
  fighting: 'Fighting',
  poison: 'Poison',
  ground: 'Ground',
  flying: 'Flying',
  psychic: 'Psychic',
  bug: 'Bug',
  rock: 'Rock',
  ghost: 'Ghost',
  dragon: 'Dragon',
  dark: 'Dark',
  steel: 'Steel',
  fairy: 'Fairy',
};

export function FiltersPanel() {
  const {
    filters,
    updateFilters,
    clearFilters,
  } = useUrlFilters();

  const toggleType = (type: PokemonType) => {
    const types = filters.types.includes(type)
        ? filters.types.filter(
            (current) => current !== type,
        )
        : [...filters.types, type];

    updateFilters({ types });
  };

  const toggleGeneration = (
      generation: PokemonGeneration,
  ) => {
    const generations =
        filters.generations.includes(generation)
            ? filters.generations.filter(
                (current) => current !== generation,
            )
            : [...filters.generations, generation];

    updateFilters({ generations });
  };

  const hasFilters =
      filters.search.length > 0 ||
      filters.types.length > 0 ||
      filters.generations.length > 0;

  return (
      <aside className={styles.panel}>
        <section className={styles.section}>
          <h2 className={styles.title}>
            Type
          </h2>

          <div className={styles.options}>
            {POKEMON_TYPES.map((type) => {
              const selected =
                  filters.types.includes(type);

              return (
                  <button
                      key={type}
                      type="button"
                      className={`${styles.option} ${
                          selected
                              ? styles.selected
                              : ''
                      }`}
                      aria-pressed={selected}
                      onClick={() =>
                          toggleType(type)
                      }
                  >
                    {TYPE_LABELS[type]}
                  </button>
              );
            })}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.title}>
            Generation
          </h2>

          <div className={styles.options}>
            {POKEMON_GENERATIONS.map(
                (generation) => {
                  const selected =
                      filters.generations.includes(
                          generation,
                      );

                  return (
                      <button
                          key={generation}
                          type="button"
                          className={`${styles.option} ${
                              selected
                                  ? styles.selected
                                  : ''
                          }`}
                          aria-pressed={selected}
                          onClick={() =>
                              toggleGeneration(
                                  generation,
                              )
                          }
                      >
                        Gen {generation}
                      </button>
                  );
                },
            )}
          </div>
        </section>

        {hasFilters && (
            <button
                type="button"
                className={styles.clear}
                onClick={clearFilters}
            >
              Clear filters
            </button>
        )}
      </aside>
  );
}
