import {useEffect, useMemo, useRef, useState} from 'react';

import {useGetPokemonCatalogQuery} from '@/src/services/pokemonApi';
import {pokemonIDFormat} from '@/src/utils/formatters';

import styles from './PokemonSelector.module.css';

const MAX_RESULTS = 30;

export function PokemonSelector(
    {
        value,
        onChange,
        excludeId,
        error,
        label
    }) {
    const {
        data: catalog,
        isLoading
    } = useGetPokemonCatalogQuery();

    const pokemon = catalog?.items ?? [];

    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);

    const containerRef = useRef(null);

    const selectedPokemon = useMemo(
        () => pokemon.find((item) => item.id === value),
        [pokemon, value]
    );

    const normalizedQuery = query
        .trim()
        .toLowerCase();

    const filteredPokemon = useMemo(() => {
        return pokemon
            .filter((item) => item.id !== excludeId)
            .filter((item) => {
                if (!normalizedQuery) {
                    return true;
                }

                return (
                    item.name
                        .toLowerCase()
                        .includes(normalizedQuery) ||
                    String(item.id).includes(normalizedQuery)
                );
            })
            .slice(0, MAX_RESULTS);
    }, [
        pokemon,
        excludeId,
        normalizedQuery
    ]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            'mousedown',
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

    const handleSelect = (pokemon) => {
        onChange(pokemon.id);
        setQuery('');
        setOpen(false);
    };

    const handleClear = () => {
        onChange(null);
        setQuery('');
        setOpen(false);
    };

    const handleSearch = (event) => {
        setQuery(event.target.value);
        setOpen(true);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <div
            ref={containerRef}
            className={styles.field}
        >
            <label className={styles.label}>
                {label}
            </label>

            <div className={styles.control}>
                {selectedPokemon && !open ? (
                    <button
                        type="button"
                        className={styles.selected}
                        onClick={handleOpen}
                    >
                        <img
                            src={selectedPokemon.sprite}
                            alt=""
                            className={styles.sprite}
                        />

                        <span className={styles.selectedName}>
                            {pokemonIDFormat(selectedPokemon)}{' '}
                            {selectedPokemon.name}
                        </span>

                        <span className={styles.change}>
                            Change
                        </span>
                    </button>
                ) : (
                    <input
                        type="text"
                        value={query}
                        placeholder="Search Pokémon..."
                        onFocus={handleOpen}
                        onChange={handleSearch}
                        className={styles.input}
                    />
                )}

                {open && (
                    <div className={styles.dropdown}>
                        {isLoading ? (
                            <div className={styles.message}>
                                Loading Pokémon...
                            </div>
                        ) : filteredPokemon.length === 0 ? (
                            <div className={styles.message}>
                                No Pokémon found.
                            </div>
                        ) : (
                            filteredPokemon.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={styles.option}
                                    onClick={() => handleSelect(item)}
                                >
                                    <img
                                        src={item.sprite}
                                        alt=""
                                        className={styles.optionSprite}
                                    />

                                    <span>
                                        <strong>
                                            {pokemonIDFormat(item)}
                                        </strong>{' '}
                                        {item.name}
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            {error && (
                <p className={styles.error}>
                    {error}
                </p>
            )}
        </div>
    );
}
