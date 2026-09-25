import styles from './TypeBadge.module.css';
import {TYPE_LABELS} from "@/src/app/constants.js";

export function TypeBadge({type}) {
    return <span className={`${styles.badge} ${styles[type] ?? styles.default}`}>{TYPE_LABELS[type] ?? type}</span>
}
