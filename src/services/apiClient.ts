import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = 'https://pokeapi.co/api/v2/';

export const apiClient = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json');

    return headers;
  },
});
