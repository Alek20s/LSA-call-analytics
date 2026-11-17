const API_URL = 'https://69b30b45e224ec066bdb55a0.mockapi.io/api/v1/cdr';

export async function fetchCalls() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('API request failed');
  }

  const data = await response.json();

  console.log('API call records:', data);

  return data;
}