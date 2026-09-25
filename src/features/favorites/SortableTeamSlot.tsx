import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {TeamSlot} from "@/src/features/favorites/TeamSlot";
import styles from './TeamPanel.module.css';

interface SortableTeamSlotProps {
  pokemonId: number;
  position: number;
}

export function SortableTeamSlot({pokemonId, position}: SortableTeamSlotProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: pokemonId,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
      <div
          ref={setNodeRef}
          style={style}
          className={`${styles.dragItem} ${isDragging ? styles.dragging : ''}`}
      >
        <button
            type="button"
            className={styles.dragHandle}
            {...attributes}
            {...listeners}
            aria-label={`Reorganizar Pokémon en posición ${position}`}
            title="Reorganizar Pokémon"
        >
          <svg
              className={styles.handleIcon}
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
              width="16"
              height="16"
          >
            <circle cx="5" cy="3" r="1.5"/>
            <circle cx="11" cy="3" r="1.5"/>
            <circle cx="5" cy="8" r="1.5"/>
            <circle cx="11" cy="8" r="1.5"/>
            <circle cx="5" cy="13" r="1.5"/>
            <circle cx="11" cy="13" r="1.5"/>
          </svg>
        </button>

        <TeamSlot pokemonId={pokemonId} position={position}/>
      </div>
  );
}
