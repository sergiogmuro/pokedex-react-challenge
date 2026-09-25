import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TypeBadge } from '@/src/components/ui/TypeBadge';
import { useGetPokemonQuery } from '@/src/services/pokemonApi';
import { formatHeight, formatWeight, pokemonIDFormat } from "@/src/utils/formatters";
import { StatBar } from "@/src/features/pokemonDetail/StatBar";
import { SpriteGallery } from "@/src/features/pokemonDetail/SpriteGallery";
import { useFavoritePokemon } from '@/src/features/favorites/useFavoritePokemon';

import styles from './PokemonDetail.module.css';

export function PokemonDetail() {
  const { id } = useParams<{ id: string }>();
  const pokemonId = Number(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const {
    data: pokemon,
    isLoading,
    isError,
  } = useGetPokemonQuery(pokemonId, {
    skip: !Number.isInteger(pokemonId),
  });

  const { isFavorite, toggle } = useFavoritePokemon(
      pokemonId,
      pokemon?.name ?? `Pokémon #${pokemonId}`,
  );

  if (!Number.isInteger(pokemonId)) {
    return (
        <main className={styles.container}>
          <h1>Invalid Pokémon</h1>
          <Link to="/pokemon">Back to Pokédex</Link>
        </main>
    );
  }

  if (isLoading) {
    return (
        <main className={styles.container}>
          <div className={styles.loading}>Loading Pokémon...</div>
        </main>
    );
  }

  if (isError || !pokemon) {
    return (
        <main className={styles.container}>
          <div className={styles.error}>
            <h1>Unable to load Pokémon</h1>
            <p>The requested Pokémon could not be loaded.</p>
            <Link to="/pokemon">Back to Pokédex</Link>
          </div>
        </main>
    );
  }

  return (
      <main className={styles.container}>
        <Link to="/pokemon" className={styles.back}>
          ← Back to Pokédex
        </Link>

        <article className={styles.detail}>
          <button
              type="button"
              className={`${styles.favorite} ${
                  isFavorite ? styles.favoriteActive : ''
              }`}
              onClick={toggle}
              aria-label={
                isFavorite
                    ? `Remove ${pokemon.name} from team`
                    : `Add ${pokemon.name} to team`
              }
              aria-pressed={isFavorite}
          >
            ★
          </button>

          <header className={styles.header}>
            <div>
            <span className={styles.number}>
              {pokemonIDFormat(pokemon)}
            </span>

              <h1 className={styles.name}>{pokemon.name}</h1>

              <div className={styles.types}>
                {pokemon.types.map(({ slot, type }) => (
                    <TypeBadge key={slot} type={type.name} />
                ))}
              </div>
            </div>
          </header>

          <SpriteGallery pokemon={pokemon} />

          <section className={styles.section}>
            <h2>Stats</h2>
            <div className={styles.stats}>
              {pokemon.stats.map(({ base_stat, stat }) => (
                  <StatBar key={stat.name} name={stat.name} value={base_stat} />
              ))}
            </div>
          </section>

          <section className={styles.columns}>
            <section className={styles.section}>
              <h2>Abilities</h2>
              <div className={styles.abilities}>
                {pokemon.abilities.map(({ ability, is_hidden }) => (
                    <div key={ability.name} className={styles.ability}>
                      <span>{ability.name}</span>
                      {is_hidden && <small>Hidden</small>}
                    </div>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <h2>Physical</h2>
              <dl className={styles.physical}>
                <div>
                  <dt>Height</dt>
                  <dd>{formatHeight(pokemon.height)}</dd>
                </div>
                <div>
                  <dt>Weight</dt>
                  <dd>{formatWeight(pokemon.weight)}</dd>
                </div>
              </dl>
            </section>
          </section>
        </article>
      </main>
  );
}
