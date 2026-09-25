import React from 'react';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  counter?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader(
    {
      eyebrow,
      title,
      description,
      counter,
      children,
    }: PageHeaderProps) {
  return (
      <header className={styles.header}>
        <div className={styles.content}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
          {children}
        </div>

        {counter && <div className={styles.counter}>{counter}</div>}
      </header>
  );
}
