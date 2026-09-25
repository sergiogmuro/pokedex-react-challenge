import {formatStatName, pokemonIDFormat} from '@/src/utils/formatters';

import styles from './CompareChart.module.css';

export function CompareChart({pokemonA, pokemonB}) {
    const stats = pokemonA.stats.map((stat, index) => ({
        key: stat.stat.name,
        label: formatStatName(stat.stat.name),
        valueA: stat.base_stat,
        valueB: pokemonB.stats[index]?.base_stat ?? 0
    }));

    return <section className={styles.container}>
        <header className={styles.header}>
            <div>
                <span className={styles.number}>{pokemonIDFormat(pokemonA)}</span>
                <h2>{pokemonA.name}</h2>
            </div>

            <span className={styles.vs}>VS</span>

            <div className={styles.right}>
                <span className={styles.number}>{pokemonIDFormat(pokemonB)}</span>
                <h2>{pokemonB.name}</h2>
            </div>
        </header>

        <div className={styles.stats}>
            {stats.map((stat) => (
                <div key={stat.key} className={styles.stat}>
                    <div className={styles.values}>
                        <strong>{stat.valueA}</strong>
                        <span>{stat.label}</span>
                        <strong>{stat.valueB}</strong>
                    </div>

                    <div className={styles.bars}>
                        <div className={styles.barLeft}>
                        <span style={{
                            width: `${Math.min(stat.valueA / 2.55, 100)}%`
                        }}/>
                        </div>

                        <div className={styles.barRight}>
                        <span style={{
                            width: `${Math.min(stat.valueB / 2.55, 100)}%`
                        }}/>
                        </div>
                    </div>
                </div>))}
        </div>
    </section>
}
