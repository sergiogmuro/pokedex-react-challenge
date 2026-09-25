# Pokedex Challenge React

## Testing Online
[https://pokedex-react-challenge.vercel.app/](https://pokedex-react-challenge.vercel.app/)

## Instrucciones de instalación y ejecución

### Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
### Instalación

```bash
git clone https://github.com/sergiogmuro/pokedex-react-challenge.git
cd pokedex-react-challenge
npm install
```

### Ejecución en desarrollo

```bash
npm run dev
```

La app queda disponible en `http://localhost:3000`

### Build de producción

```bash
npm run build
npm run preview  
```

---

## Decisiones tomadas

### Arquitectura de cache con RTK Query

**Cache por página, no cache acumulativo.** El listado principal usa
`getPokemonList({ offset, limit })`, donde **cada combinación de argumentos es
una entrada de cache independiente** (comportamiento nativo de RTK Query, sin
`serializeQueryArgs`/`merge` custom). La acumulación visual para el infinite
scroll (ir agregando páginas a la lista que ve el usuario) se resuelve en un
`Map` de estado local dentro de `useInfinitePokemon`, **no** dentro del cache
de RTK Query.
 
---

## Mejoras futuras identificadas
- Investigar como generar garbage collection del cache de paginas ya no visibles.
- Persistir el catalogo con una estrategia de invalidación explicita, por ejemplo, un TTL de varios dias
- Generar una app PWA para instalar facilmente o intentar migrar a flutter para convertir en nativa
- Testing (no implementado, marcado como bonus en el challenge)
- Revisar completamente el manejo de errores
