import {Link} from 'react-router-dom';
import {useGetPokemonQuery} from '@/src/services/pokemonApi';
import {PokemonImage} from '@/src/components/ui/PokemonImage';
import {TypeBadge} from '@/src/components/ui/TypeBadge';
import {pokemonIDFormat} from "@/src/utils/formatters";
import {useFavoritePokemon} from "@/src/features/favorites/useFavoritePokemon";

import styles from './TeamSlot.module.css';

interface TeamSlotProps {
  pokemonId: number;
  position: number;
}

export function TeamSlot({pokemonId, position}: TeamSlotProps) {
  const {
    data: pokemon,
    isLoading,
    isError,
  } = useGetPokemonQuery(pokemonId);

  const pokemonName = pokemon?.name ?? `Pokémon #${pokemonId}`;

  const {remove} = useFavoritePokemon(
      pokemonId,
      pokemonName,
  );

  return (
      <article className={styles.slot}>
        <div className={styles.position} aria-label={`Posición ${position}`}>
          {position}
        </div>

        {isLoading && (
            <div className={styles.skeletonContainer}>
              <div className={`${styles.skeleton} ${styles.skeletonImage}`}/>
              <div className={`${styles.skeleton} ${styles.skeletonNumber}`}/>
              <div className={`${styles.skeleton} ${styles.skeletonName}`}/>
              <div className={styles.skeletonBadgeGroup}>
                <div className={`${styles.skeleton} ${styles.skeletonBadge}`}/>
                <div className={`${styles.skeleton} ${styles.skeletonBadge}`}/>
              </div>
            </div>
        )}

        {isError && (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>Unable to load Pokémon</p>
              <button
                  type="button"
                  className={styles.removeButton}
                  onClick={remove}
                  aria-label={`Remove ${pokemonName} from team`}
              >
                Remove
              </button>
            </div>
        )}

        {!isLoading && !isError && pokemon && (
            <>
              <Link to={`/pokemon/${pokemon.id}`} className={styles.link}>
                <div className={styles.image}>
                  <PokemonImage
                      src={pokemon.sprites.front_default ?? ''}
                      shiny={pokemon.sprites.front_shiny}
                      alt={pokemon.name}
                  />
                </div>

                <div className={styles.content}>
              <span className={styles.number}>
                {pokemonIDFormat(pokemon)}
              </span>

                  <h2 className={styles.name}>{pokemon.name}</h2>

                  <div className={styles.types}>
                    {pokemon.types.map(({slot, type}) => (
                        <TypeBadge key={slot} type={type.name}/>
                    ))}
                  </div>
                </div>
              </Link>

              <button
                  type="button"
                  className={styles.removeButton}
                  onClick={remove}
                  aria-label={`Remove ${pokemon.name} from team`}
              >
                Remove
              </button>
            </>
        )}
      </article>
  );
}
