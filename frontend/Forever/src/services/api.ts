// services/api.ts
export async function getDataFromApi<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error; // Re-throw to allow calling code to handle it
  }
}