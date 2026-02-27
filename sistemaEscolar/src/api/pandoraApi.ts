import axios from 'axios';

const GRAPHQL_URL: string = 'http://localhost:3000/graphql';

export const pandoraApi = axios.create({
  baseURL: GRAPHQL_URL,
  headers: {'Content-Type': 'application/json'},
});
