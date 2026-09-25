import {useEffect} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {PokemonSelector} from "@/src/features/compare/PokemonSelector";

import styles from './CompareForm.module.css';

interface CompareFormValues {
  pokemonA: number | null;
  pokemonB: number | null;
}

interface CompareFormProps {
  onCompare: (
      pokemonA: number,
      pokemonB: number,
  ) => void;
  isChangedHandler: (isChanged: boolean) => void;
}

const validationSchema =
    Yup.object<CompareFormValues>({
      pokemonA: Yup.number()
          .nullable()
          .required('Select a Pokémon.'),

      pokemonB: Yup.number()
          .nullable()
          .required('Select a Pokémon.')
          .test(
              'different-pokemon',
              'You cannot compare the same Pokémon.',
              function (value) {
                return value !== this.parent.pokemonA;
              },
          ),
    });

export function CompareForm({onCompare, isChangedHandler}: CompareFormProps) {
  const formik = useFormik<CompareFormValues>({
    initialValues: {
      pokemonA: null,
      pokemonB: null,
    },

    validationSchema,

    onSubmit: (values) => {
      if (
          values.pokemonA !== null &&
          values.pokemonB !== null &&
          values.pokemonA !== values.pokemonB
      ) {
        onCompare(values.pokemonA, values.pokemonB);
      }
    },
  });

  useEffect(() => {
    const {pokemonA, pokemonB} = formik.values;

    if (
        pokemonA !== null &&
        pokemonB !== null &&
        pokemonA !== pokemonB
    ) {
      isChangedHandler(true)
      // onCompare(pokemonA, pokemonB);
    }
  }, [formik.values.pokemonA, formik.values.pokemonB]);

  return (
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <div className={styles.selectors}>
          <PokemonSelector
              label="Pokémon 1"
              value={formik.values.pokemonA}
              excludeId={formik.values.pokemonB}
              onChange={(value) => {
                formik.setFieldValue('pokemonA', value);
                formik.setFieldTouched('pokemonA', true, false);
              }}
              error={
                formik.touched.pokemonA
                    ? formik.errors.pokemonA
                    : undefined
              }
          />

          <div className={styles.vs}>VS</div>

          <PokemonSelector
              label="Pokémon 2"
              value={formik.values.pokemonB}
              excludeId={formik.values.pokemonA}
              onChange={(value) => {
                formik.setFieldValue('pokemonB', value);
                formik.setFieldTouched('pokemonB', true, false);
              }}
              error={
                formik.touched.pokemonB
                    ? formik.errors.pokemonB
                    : undefined
              }
          />
        </div>

        <button type="submit"
                className={styles.button}
                disabled={!formik.values.pokemonA || !formik.values.pokemonB || formik.values.pokemonA === formik.values.pokemonB}
        >
          Compare Pokémon
        </button>
      </form>
  );
}
