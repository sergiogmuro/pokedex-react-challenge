import {useUrlFilters} from '@/src/features/search/useUrlFilters';
import {POKEMON_GENERATIONS, POKEMON_TYPES, TYPE_LABELS} from "@/src/app/constants.js";

import styles from './FiltersPanel.module.css';

export function FiltersPanel() {
    const {filters, updateFilters, clearFilters} = useUrlFilters();

    const toggleType = (type) => {
        const types = filters.types.includes(type) ? filters.types.filter((current) => current !== type) : [...filters.types, type];

        updateFilters({types});
    };

    const toggleGeneration = (generation) => {
        const generations = filters.generations.includes(generation) ? filters.generations.filter((current) => current !== generation) : [...filters.generations, generation];

        updateFilters({generations});
    };

    const hasFilters = filters.search.length > 0 || filters.types.length > 0 || filters.generations.length > 0;

    return <aside className={styles.panel}>
        <section className={styles.section}>
            <h2 className={styles.title}>
                Type
            </h2>

            <div className={styles.options}>
                {POKEMON_TYPES.map((type) => {
                    const selected = filters.types.includes(type);

                    return (<button
                        key={type}
                        type="button"
                        className={`${styles.option} ${selected ? styles.selected : ''}`}
                        aria-pressed={selected}
                        onClick={() => toggleType(type)}
                    >
                        {TYPE_LABELS[type]}
                    </button>);
                })}
            </div>
        </section>

        <section className={styles.section}>
            <h2 className={styles.title}>
                Generation
            </h2>

            <div className={styles.options}>
                {POKEMON_GENERATIONS.map((generation) => {
                    const selected = filters.generations.includes(generation);

                    return (<button
                        key={generation}
                        type="button"
                        className={`${styles.option} ${selected ? styles.selected : ''}`}
                        aria-pressed={selected}
                        onClick={() => toggleGeneration(generation)}
                    >
                        Gen {generation}
                    </button>);
                })}
            </div>
        </section>

        {hasFilters && (<button
            type="button"
            className={styles.clear}
            onClick={clearFilters}
        >
            Clear filters
        </button>)}
    </aside>
}
