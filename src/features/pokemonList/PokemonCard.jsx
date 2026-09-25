import {Link} from 'react-router-dom';

import {PokemonImage} from '@/src/components/ui/PokemonImage';
import {TypeBadge} from '@/src/components/ui/TypeBadge';
import {useGetPokemonQuery} from '@/src/services/pokemonApi';
import {useFavoritePokemon} from '@/src/features/favorites/useFavoritePokemon';
import {pokemonIDFormat} from '@/src/utils/formatters';

import styles from './PokemonCard.module.css';

export function PokemonCard({pokemon}) {
    const {data: details} = useGetPokemonQuery(pokemon.id);
    const {isFavorite, toggle} = useFavoritePokemon(pokemon.id, pokemon.name);

    return <article className={styles.card}>
        <Link
            to={`/pokemon/${pokemon.id}`}
            className={styles.link}
        >
            <div className={styles.image}>
                <button
                    type="button"
                    className={`${styles.favorite} ${isFavorite ? styles.favoriteActive : ''}`}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        toggle();
                    }}
                    aria-label={isFavorite ? `Remove ${pokemon.name} from team` : `Add ${pokemon.name} to team`}
                    aria-pressed={isFavorite}
                >
                    ★
                </button>

                <PokemonImage
                    src={pokemon.sprite}
                    shiny={details?.sprites?.front_shiny ?? null}
                    alt={pokemon.name}
                />
            </div>

            <div className={styles.content}>
                <span className={styles.number}>{pokemonIDFormat(pokemon)}</span>
                <h2 className={styles.name}>{pokemon.name}</h2>
                <div className={styles.types}>
                    {pokemon.types.map((type) => (<TypeBadge
                        key={type}
                        type={type}
                    />))}
                </div>
            </div>
        </Link>
    </article>
}
