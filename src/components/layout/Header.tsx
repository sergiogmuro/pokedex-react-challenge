import {useRef} from "react";
import {Link, NavLink} from 'react-router-dom';

import {useAppSelector} from '@/src/hooks/redux';
import {selectFavoriteCount} from '@/src/features/favorites/favoritesSlice';
import {useOnlineStatus} from '@/src/hooks/useOnlineStatus';

import styles from './Header.module.css';

export function Header() {
  const isOnline = useOnlineStatus();
  const hasFetchedFromNetworkRef = useRef(false);
  const favoriteCount = useAppSelector(selectFavoriteCount);

  return (
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link to="/pokemon" className={styles.logo}>
            <span className={styles.logoMark}>P</span>
            <span className={styles.logoText}>Pokédex</span>
          </Link>

          <nav className={styles.nav} aria-label="Main navigation">
            <NavLink
                to="/pokemon"
                className={({isActive}) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                }
            >
              Pokédex
            </NavLink>

            <NavLink
                to="/team"
                className={({isActive}) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                }
            >
              <span>Mi Equipo</span>
              {favoriteCount > 0 && (
                  <span className={styles.badge}>{favoriteCount}</span>
              )}
            </NavLink>

            <NavLink
                to="/compare"
                className={({isActive}) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                }
            >
              <span>Comparar</span>
            </NavLink>

            <div
                className={`${styles.connectionStatus} ${
                    isOnline ? styles.online : styles.offline
                }`}
                title={
                  isOnline
                      ? 'Conectado a Internet'
                      : 'Sin conexión a Internet'
                }
                role="status"
                aria-label={`Estado de conexión: ${isOnline ? 'Online' : 'Offline'}`}
            >
            <span className={styles.connectionDotContainer} aria-hidden="true">
              <span className={styles.connectionPing}/>
              <span className={styles.connectionDot}/>
            </span>

              <span className={styles.connectionText}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            </div>
          </nav>
        </div>
      </header>
  );
}
