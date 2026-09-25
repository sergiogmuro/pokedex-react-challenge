import styles from './PokemonCard.module.css';

export function PokemonCardSkeleton() {
  return (
      <article
          className={`${styles.card} ${styles.cardSkeleton}`}
          aria-hidden="true"
      >
        <div
            className={`${styles.image} ${styles.skeleton}`}
        />

        <div className={styles.content}>
          <div
              className={`${styles.skeleton} ${styles.skeletonNumber}`}
          />

          <div
              className={`${styles.skeleton} ${styles.skeletonName}`}
          />

          <div className={styles.types}>
            <div
                className={`${styles.skeleton} ${styles.skeletonBadge}`}
            />

            <div
                className={`${styles.skeleton} ${styles.skeletonBadge}`}
            />
          </div>
        </div>
      </article>
  );
}
