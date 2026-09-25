import {useRef} from "react";
import {Link, NavLink} from 'react-router-dom';

import {useAppSelector} from '@/src/hooks/redux';
import {selectFavoriteCount} from '@/src/features/favorites/favoritesSlice';
import {useOnlineStatus} from '@/src/hooks/useOnlineStatus';

import styles from './Header.module.css';

const LinkRow = ({href, isActive, label, counter = null}) => {
    return (
        <NavLink
            to={href}
            className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
            <span>{label}</span>

            {counter > 0 && (
                <span className={styles.badge}>
                    {counter}
                </span>
            )}
        </NavLink>
    );
};

export function Header() {
    const isOnline = useOnlineStatus();
    const hasFetchedFromNetworkRef = useRef(false);
    const favoriteCount = useAppSelector(selectFavoriteCount);

    return (<header className={styles.header}>
        <div className={styles.inner}>
            <Link to="/pokemon" className={styles.logo}>
                <span className={styles.logoMark}>P</span>
                <span className={styles.logoText}>Pokédex</span>
            </Link>

            <nav className={styles.nav} aria-label="Main navigation">
                <LinkRow href="/pokemon" label="Pokédex"/>
                <LinkRow href="/team" label="My Team" counter={favoriteCount}/>
                <LinkRow href="/compare" label="Compare"/>
                
                <div
                    className={`${styles.connectionStatus} ${isOnline ? styles.online : styles.offline}`}
                    title={isOnline ? 'Connected to the Internet' : 'No Internet connection'}
                    role="status"
                    aria-label={`Connection status: ${isOnline ? 'Online' : 'Offline'}`}
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
    </header>);
}
