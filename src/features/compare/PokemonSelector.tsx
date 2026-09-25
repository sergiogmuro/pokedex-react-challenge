import {useEffect, useRef, useState} from 'react';

import {useGetPokemonCatalogQuery} from '@/src/services/pokemonApi';

import type {PokemonListItem} from '@/src/types/pokemon';

import styles from './PokemonSelector.module.css';
import {pokemonIDFormat} from "@/src/utils/formatters.ts";

interface PokemonSelectorProps {
  value: number | null;
  onChange: (pokemonId: number | null) => void;
  excludeId?: number | null;
  error?: string;
  label: string;
}

export function PokemonSelector(
    {
      value,
      onChange,
      excludeId,
      error,
      label,
    }: PokemonSelectorProps) {
  const {data: catalog, isLoading} = useGetPokemonCatalogQuery();

  const pokemon = catalog?.items ?? [];

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const selectedPokemon = pokemon.find(
      (item) => item.id === value,
  );

  const filteredPokemon = pokemon
      .filter((item) => item.id !== excludeId)
      .filter((item) => {
        const normalizedQuery = query
            .trim()
            .toLowerCase();

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
      .slice(0, 30);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current &&
          !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (
      pokemon: PokemonListItem,
  ) => {
    onChange(pokemon.id);
    setQuery('');
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery('');
    setOpen(false);
  };

  return (
      <div ref={containerRef} className={styles.field}>
        <label className={styles.label}>
          {label}
        </label>

        <div className={styles.control}>
          {selectedPokemon && !open ? (
              <button
                  type="button"
                  className={styles.selected}
                  onClick={() => setOpen(true)}
              >
                <img
                    src={selectedPokemon.sprite}
                    alt=""
                    className={styles.sprite}
                />

                <span className={styles.selectedName}>
                  {pokemonIDFormat(selectedPokemon)}{' '}{selectedPokemon.name}
                </span>

                <span className={styles.change}>Change</span>
              </button>
          ) : (
              <input
                  type="text"
                  value={query}
                  placeholder="Search Pokémon..."
                  onFocus={() => setOpen(true)}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setOpen(true);
                  }}
                  className={styles.input}
              />
          )}

          {open && (
              <div className={styles.dropdown}>
                {isLoading ? (
                    <div className={styles.message}>Loading Pokémon...</div>
                ) : filteredPokemon.length === 0 ? (
                    <div className={styles.message}>No Pokémon found.</div>
                ) : (
                    filteredPokemon.map(
                        (item) => (
                            <button
                                key={item.id}
                                type="button"
                                className={styles.option}
                                onClick={() => handleSelect(item)}
                            >
                              <img src={item.sprite}
                                   alt=""
                                   className={styles.optionSprite}
                              />

                              <span>
                              <strong>{pokemonIDFormat(item)}</strong>{' '}{item.name}</span>
                            </button>
                        ),
                    )
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
