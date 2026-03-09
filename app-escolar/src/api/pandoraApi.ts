import axios from 'axios';

// URL base de tu servidor NestJS
const BASE_URL = 'http://localhost:3000/graphql';

// Cliente axios configurado para GraphQL
// GraphQL siempre usa POST y siempre apunta al mismo endpoint
export const pandoraApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función helper para hacer cualquier query o mutation
// query    → string con la query/mutation de GraphQL
// variables → objeto con los parámetros que necesita la query
export const graphqlRequest = async <T>(
  query: string,
  variables?: object
): Promise<T> => {
  try {
    const response = await pandoraApi.post('', {query, variables});
    //console.log('RESPONSE:', JSON.stringify(response.data, null, 2));

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data as T;

  } catch (error: any) {
    // Captura el cuerpo del 400
    //console.log('ERROR STATUS:', error.response?.status);
    //console.log('ERROR BODY:', JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
};
