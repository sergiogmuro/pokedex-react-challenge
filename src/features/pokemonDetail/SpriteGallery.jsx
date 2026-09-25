import styles from './PokemonDetail.module.css';

export function SpriteGallery({pokemon}) {
  const primarySprite = pokemon.sprites.front_default;

  const alternativeSprites = [
    {
      label: 'Front',
      src: pokemon.sprites.front_default,
    },
    {
      label: 'Shiny',
      src: pokemon.sprites.front_shiny,
    },
    {
      label: 'Back',
      src: pokemon.sprites.back_default,
    },
    {
      label: 'Back Shiny',
      src: pokemon.sprites.back_shiny,
    },
  ].filter((sprite) => Boolean(sprite.src));

  return primarySprite && (
    <section className={styles.hero}>
      <div className={styles.mainImage}>
        <img
          src={primarySprite}
          alt={pokemon.name}
        />
      </div>

      <div className={styles.sprites}>
        <h2>Sprites</h2>

        <div className={styles.spriteGrid}>
          {alternativeSprites.map(({label, src}) => (
            <div key={label} className={styles.sprite}>
              <img
                src={src}
                alt={`${pokemon.name} ${label}`}
              />

              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
