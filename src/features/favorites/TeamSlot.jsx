import {useState} from 'react';
import {Link} from 'react-router-dom';

import {useGetPokemonQuery} from '@/src/services/pokemonApi';
import {PokemonImage} from '@/src/components/ui/PokemonImage';
import {TypeBadge} from '@/src/components/ui/TypeBadge';
import {pokemonIDFormat} from '@/src/utils/formatters';
import {useFavoritePokemon} from '@/src/features/favorites/useFavoritePokemon';

import styles from './TeamSlot.module.css';

export function TeamSlot({pokemonId, position}) {
    const {
        data: pokemon,
        isLoading,
        isError
    } = useGetPokemonQuery(pokemonId);

    const [showConfirm, setShowConfirm] = useState(false);

    const pokemonName =
        pokemon?.name ?? `Pokémon #${pokemonId}`;

    const {remove} = useFavoritePokemon(
        pokemonId,
        pokemonName
    );

    const handleConfirmRemove = () => {
        remove();
        setShowConfirm(false);
    };

    return (
        <>
            <article className={styles.slot}>
                <div
                    className={styles.position}
                    aria-label={`Position ${position}`}
                >
                    {position}
                </div>

                {isLoading && (
                    <div className={styles.skeletonContainer}>
                        <div
                            className={`${styles.skeleton} ${styles.skeletonImage}`}
                        />

                        <div
                            className={`${styles.skeleton} ${styles.skeletonNumber}`}
                        />

                        <div
                            className={`${styles.skeleton} ${styles.skeletonName}`}
                        />

                        <div className={styles.skeletonBadgeGroup}>
                            <div
                                className={`${styles.skeleton} ${styles.skeletonBadge}`}
                            />

                            <div
                                className={`${styles.skeleton} ${styles.skeletonBadge}`}
                            />
                        </div>
                    </div>
                )}

                {isError && (
                    <div className={styles.errorContainer}>
                        <p className={styles.errorText}>
                            Unable to load Pokémon
                        </p>

                        <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() => setShowConfirm(true)}
                            aria-label={`Remove ${pokemonName} from team`}
                        >
                            Remove
                        </button>
                    </div>
                )}

                {!isLoading && !isError && pokemon && (
                    <>
                        <Link
                            to={`/pokemon/${pokemon.id}`}
                            className={styles.link}
                        >
                            <div className={styles.image}>
                                <PokemonImage
                                    src={
                                        pokemon.sprites.front_default ?? ''
                                    }
                                    shiny={pokemon.sprites.front_shiny}
                                    alt={pokemon.name}
                                />
                            </div>

                            <div className={styles.content}>
                                <span className={styles.number}>
                                    {pokemonIDFormat(pokemon)}
                                </span>

                                <h2 className={styles.name}>
                                    {pokemon.name}
                                </h2>

                                <div className={styles.types}>
                                    {pokemon.types.map(({slot, type}) => (
                                        <TypeBadge
                                            key={slot}
                                            type={type.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Link>

                        <div className={styles.actions}>
                            <button
                                type="button"
                                className={styles.removeButton}
                                onClick={() => setShowConfirm(true)}
                                aria-label={`Remove ${pokemon.name} from team`}
                            >
                                Remove
                            </button>
                        </div>
                    </>
                )}
            </article>

            {showConfirm && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setShowConfirm(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-modal-title"
                >
                    <div
                        className={styles.modalContent}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3
                            id="confirm-modal-title"
                            className={styles.modalTitle}
                        >
                            Remove from your team?
                        </h3>

                        <p className={styles.modalText}>
                            Are you sure you want to remove{' '}
                            <strong className={styles.pokemonHighlight}>
                                {pokemonName}
                            </strong>{' '}
                            from your team?
                        </p>

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className={styles.confirmBtn}
                                onClick={handleConfirmRemove}
                            >
                                Yes, remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
