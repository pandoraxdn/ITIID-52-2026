import axios from 'axios';

const GRAPHQL_URL: string = 'https://api-azami.utvt.cloud/graphql';

export const pandoraApi = axios.create({
  baseURL: GRAPHQL_URL,
  headers: {'Content-Type': 'application/json'},
});
