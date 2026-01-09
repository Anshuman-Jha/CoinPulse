'use server';

import qs from 'query-string';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error('Could not get base url');
if (!API_KEY) throw new Error('Could not get api key');

const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 1000; // 1 second

// Helper to detect correct header based on base URL
const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (API_KEY) {
    // If using the Pro API URL
    if (BASE_URL?.includes('pro-api.coingecko.com')) {
      headers['x-cg-pro-api-key'] = API_KEY;
    } else {
      // Logic for Demo API or Public API with key
      headers['x-cg-demo-api-key'] = API_KEY;
    }
  }
  return headers;
};

// Sleep helper
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true },
  );

  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      const response = await fetch(url, {
        headers: getAuthHeaders(),
        next: { revalidate },
      });

      if (response.ok) {
        return response.json();
      }

      // Handle 429 (Too Many Requests) specifically
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : INITIAL_BACKOFF * Math.pow(2, attempt); // Exponential backoff

        console.warn(`Rate limited. Retrying in ${waitTime}ms... (Attempt ${attempt + 1}/${MAX_RETRIES})`);
        await sleep(waitTime);
        attempt++;
        continue;
      }

      // Handle other errors
      const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status}: ${errorBody.error || response.statusText}`);

    } catch (error: any) {
      // If we've exhausted retries or it's a non-retryable error (unless it was a fetch network error which we might want to retry)
      // For now, only retry on 429 loop or network errors if we wanted (but catch block catches the throw above too)

      // If it was our own thrown error (4xx/5xx), rethrow immediately unless it was handled in loop
      if (error.message?.startsWith('API Error')) {
        throw error;
      }

      // Network errors etc
      console.warn(`Fetch error on attempt ${attempt + 1}:`, error);
      if (attempt < MAX_RETRIES - 1) {
        await sleep(INITIAL_BACKOFF * Math.pow(2, attempt));
        attempt++;
        continue;
      }
      throw error;
    }
  }

  throw new Error(`Failed to fetch after ${MAX_RETRIES} attempts`);
}

export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null,
): Promise<PoolData> {
  const fallback: PoolData = {
    id: '',
    address: '',
    name: '',
    network: '',
  };

  if (network && contractAddress) {
    try {
      const poolData = await fetcher<{ data: PoolData[] }>(
        `/onchain/networks/${network}/tokens/${contractAddress}/pools`,
      );

      return poolData.data?.[0] ?? fallback;
    } catch (error) {
      console.log(error);
      return fallback;
    }
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>('/onchain/search/pools', { query: id });

    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}

export async function searchCoins(query: string): Promise<SearchCoin[]> {
  try {
    const data = await fetcher<{ coins: SearchCoin[] }>('/search', { query });
    return data.coins || [];
  } catch (error) {
    console.error('Search API Error:', error);
    return [];
  }
}
