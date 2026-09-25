import {useState} from 'react';
import {useGetPokemonQuery} from '@/src/services/pokemonApi';
import {CompareForm} from '@/src/features/compare/CompareForm';
import {CompareChart} from '@/src/features/compare/CompareChart';
import {PageHeader} from '@/src/components/ui/PageHeader';

import styles from './ComparePage.module.css';

export function ComparePage() {
    const [isChanged, setIsChanged] = useState(false);

    const [comparison, setComparison] = useState(null);

    const {
        data: dataA,
        isFetching: isFetchingA,
        isLoading: isLoadingA
    } = useGetPokemonQuery(comparison?.pokemonA ?? 0, {
        skip: !comparison?.pokemonA, refetchOnMountOrArgChange: true
    });

    const {
        data: dataB,
        isFetching: isFetchingB,
        isLoading: isLoadingB
    } = useGetPokemonQuery(comparison?.pokemonB ?? 0, {
        skip: !comparison?.pokemonB, refetchOnMountOrArgChange: true
    });

    const isDataReady = Boolean(dataA && dataB);

    const isComparing = !isChanged && (isLoadingA || isLoadingB || isFetchingA || isFetchingB);

    const isChangedHandler = (isChanged) => {
        setIsChanged(isChanged);
    };

    return (<main className={styles.container}>
        <PageHeader
            eyebrow="Comparison"
            title="Compare Pokémon"
            description="Select two Pokémon to compare their base stats."
        />

        <CompareForm
            isChangedHandler={isChangedHandler}
            onCompare={(pokemonA, pokemonB) => {
                setIsChanged(false);
                setComparison({
                    pokemonA, pokemonB
                });
            }}
        />

        {isComparing && (<div className={styles.loading}>
            Updating comparison stats...
        </div>)}

        {!isChanged && !isComparing && isDataReady && dataA && dataB && (<CompareChart
            pokemonA={dataA}
            pokemonB={dataB}
        />)}
    </main>);
}
