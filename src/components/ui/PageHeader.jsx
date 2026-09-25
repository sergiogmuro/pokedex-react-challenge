import React from 'react';
import styles from './PageHeader.module.css';

export function PageHeader({eyebrow, title, description, counter, children}) {
    return (
        <header className={styles.header}>
            <div className={styles.content}>
                {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
                {title && <h1 className={styles.title}>{title}</h1>}
                {description && <p className={styles.description}>{description}</p>}

                {children}
            </div>

            {counter && <div className={styles.counter}>{counter}</div>}
        </header>
    );
}
