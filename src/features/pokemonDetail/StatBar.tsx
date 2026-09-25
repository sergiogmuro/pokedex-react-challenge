import {formatStatName} from "@/src/utils/formatters";

import styles from "./PokemonDetail.module.css";

interface StatBarProps {
  name: string;
  value: number;
}

export function StatBar({name, value}: StatBarProps) {
  const percentage = Math.min((value / 255) * 100, 100);

  return (
      <div className={styles.stat}>
        <div className={styles.statHeader}>
          <span>{formatStatName(name)}</span>
          <strong>{value}</strong>
        </div>

        <div className={styles.statTrack}
             role="progressbar"
             aria-label={formatStatName(name)}
             aria-valuenow={value}
             aria-valuemin={0}
             aria-valuemax={255}
        >
          <div className={styles.statValue}
               style={{
                 width: `${percentage}%`,
               }}
          />
        </div>
      </div>
  );
}
