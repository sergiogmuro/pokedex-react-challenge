import {useEffect, useState} from 'react';
import {useDebounce} from '@/src/hooks/useDebounce';
import {useUrlFilters} from './useUrlFilters';

import styles from './SearchBar.module.css';

export function SearchBar() {
    const {filters, updateFilters} = useUrlFilters();

    const [value, setValue] = useState(filters.search);

    const debouncedValue = useDebounce(value, 300);

    useEffect(() => {
        if (debouncedValue === filters.search) {
            return;
        }

        updateFilters({
            search: debouncedValue
        });
    }, [debouncedValue, filters.search, updateFilters]);

    useEffect(() => {
        setValue(filters.search);
    }, [filters.search]);

    return (<div className={styles.container}>
        <label
            htmlFor="pokemon-search"
            className={styles.label}
        >
            Search Pokémon
        </label>

        <input
            id="pokemon-search"
            type="search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search by name..."
            className={styles.input}
        />
    </div>);
}
