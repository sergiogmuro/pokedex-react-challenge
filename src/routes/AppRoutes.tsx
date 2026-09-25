import {BrowserRouter, Route, Routes} from 'react-router-dom';

import {PokemonList} from '../features/pokemonList/PokemonList';
import {PokemonDetail} from "@/src/features/pokemonDetail/PokemonDetail";
import {TeamPanel} from "@/src/features/favorites/TeamPanel";
import {Layout} from "@/src/components/layout/Layout";
import {ComparePage} from "@/src/features/compare/ComparePage";

export function AppRoutes() {
  return (
      <BrowserRouter>
        <Routes>
          <Route element={<Layout/>}>
            <Route path="/" element={<PokemonList/>}/>
            <Route path="/pokemon" element={<PokemonList/>}/>
            <Route path="/pokemon/:id" element={<PokemonDetail/>}/>
            <Route path="/team" element={<TeamPanel/>}/>
            <Route path="/compare" element={<ComparePage/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}
