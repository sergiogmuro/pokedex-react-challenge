import {useState} from 'react';
import {Link} from 'react-router-dom';
import {closestCenter, DndContext, PointerSensor, TouchSensor, useSensor, useSensors} from '@dnd-kit/core';
import {horizontalListSortingStrategy, SortableContext, arrayMove} from '@dnd-kit/sortable';
import {useAppDispatch, useAppSelector} from '@/src/hooks/redux';
import {SortableTeamSlot} from '@/src/features/favorites/SortableTeamSlot';
import {PageHeader} from '@/src/components/ui/PageHeader';
import {reorderFavorites, selectFavoriteIds} from '@/src/features/favorites/favoritesSlice';

import styles from './TeamPanel.module.css';

export function TeamPanel() {
    const dispatch = useAppDispatch();
    const pokemonIds = useAppSelector(selectFavoriteIds);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {distance: 8}
    }), useSensor(TouchSensor, {
        activationConstraint: {
            delay: 180, tolerance: 8
        }
    }));

    const handleDragStart = ({active}) => {
        setActiveId(Number(active.id));
    };

    const handleDragEnd = ({active, over}) => {
        setActiveId(null);

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = pokemonIds.indexOf(Number(active.id));

        const newIndex = pokemonIds.indexOf(Number(over.id));

        if (oldIndex === -1 || newIndex === -1) {
            return;
        }

        dispatch(reorderFavorites(arrayMove(pokemonIds, oldIndex, newIndex)));
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    return (<main className={styles.container}>
        <PageHeader
            eyebrow="My Team"
            title="My Pokémon Team"
            description={pokemonIds.length > 1 ? 'Press and hold the icon to rearrange your team.' : undefined}
            counter={`${pokemonIds.length} / 6`}
        />

        {pokemonIds.length === 0 ? (<section className={styles.empty}>
            <div className={styles.emptyIcon}>☆</div>

            <h2>Your team is empty</h2>

            <p>
                Add up to 6 Pokémon from the Pokédex to build your team.
            </p>

            <Link
                to="/pokemon"
                className={styles.button}
            >
                Explore Pokémon
            </Link>
        </section>) : (<DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext
                items={pokemonIds}
                strategy={horizontalListSortingStrategy}
            >
                <section
                    className={styles.grid}
                    aria-label="Your Pokémon team"
                >
                    {pokemonIds.map((pokemonId, index) => (<SortableTeamSlot
                        key={pokemonId}
                        pokemonId={pokemonId}
                        position={index + 1}
                    />))}
                </section>
            </SortableContext>
        </DndContext>)}
    </main>);
}
