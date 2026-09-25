import {useState} from 'react';

import styles from './PokemonImage.module.css';
import {Pokeball} from "@/src/components/ui/Pokeball.jsx";

export function PokemonImage({src, shiny, alt}) {
    const [baseLoaded, setBaseLoaded] = useState(false);
    const [shinyLoaded, setShinyLoaded] = useState(false);
    const [error, setError] = useState(false);

    if (!src || error) {
        return (
            <div
                className={styles.fallback}
                role="img"
                aria-label={`${alt} image unavailable`}
            >
                <Pokeball/>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {!baseLoaded && (
                <div
                    className={styles.placeholder}
                    aria-hidden="true"
                />
            )}

            <img
                className={`${styles.image} ${styles.baseImage} ${
                    baseLoaded
                        ? styles.loaded
                        : styles.loading
                }`}
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                onLoad={() => setBaseLoaded(true)}
                onError={() => setError(true)}
            />

            {shiny && (
                <img
                    className={`${styles.image} ${styles.shinyImage} ${
                        shinyLoaded
                            ? styles.loaded
                            : styles.loading
                    }`}
                    src={shiny}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setShinyLoaded(true)}
                    onError={() => setShinyLoaded(false)}
                />
            )}
        </div>
    );
}
