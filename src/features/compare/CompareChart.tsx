import type {Pokemon} from '@/src/types/pokemon';
import {formatStatName} from "@/src/utils/formatters";

import styles from './CompareChart.module.css';

interface CompareChartProps {
  pokemonA: Pokemon;
  pokemonB: Pokemon;
}

interface Stat {
  key: string;
  label: string;
  valueA: number;
  valueB: number;
}

export function CompareChart({pokemonA, pokemonB}: CompareChartProps) {
  const stats: Stat[] = pokemonA.stats.map(
      (stat, index) => ({
        key: stat.stat.name,
        label: formatStatName(stat.stat.name),
        valueA: stat.base_stat,
        valueB:
            pokemonB.stats[index]?.base_stat ?? 0,
      }),
  );

  return (
      <section className={styles.container}>
        <header className={styles.header}>
          <div>
            <span className={styles.number}>
              # {String(pokemonA.id).padStart(3, '0',)}
            </span>

            <h2>{pokemonA.name}</h2>
          </div>

          <span className={styles.vs}>VS</span>

          <div className={styles.right}>
            <span className={styles.number}>
              # {String(pokemonB.id).padStart(3, '0',)}
            </span>

            <h2>{pokemonB.name}</h2>
          </div>
        </header>

        <div className={styles.stats}>
          {stats.map((stat) => (
              <div
                  key={stat.key}
                  className={styles.stat}
              >
                <div className={styles.values}>
                  <strong>
                    {stat.valueA}
                  </strong>

                  <span>
                                {stat.label}
                            </span>

                  <strong>
                    {stat.valueB}
                  </strong>
                </div>

                <div className={styles.bars}>
                  <div
                      className={
                        styles.barLeft
                      }
                  >
                                <span
                                    style={{
                                      width: `${Math.min(
                                          stat.valueA /
                                          2.55,
                                          100,
                                      )}%`,
                                    }}
                                />
                  </div>

                  <div
                      className={
                        styles.barRight
                      }
                  >
                                <span
                                    style={{
                                      width: `${Math.min(
                                          stat.valueB /
                                          2.55,
                                          100,
                                      )}%`,
                                    }}
                                />
                  </div>
                </div>
              </div>
          ))}
        </div>
      </section>
  );
}
