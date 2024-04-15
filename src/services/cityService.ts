// src/services/cityService.ts
const CITY_API_URL = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records`;

export const fetchCities = async (page = 1) => {
    try {
        const response = await fetch(`${CITY_API_URL}?page=${page}`);
        if (!response.ok) {
            throw new Error('Failed to fetch city data');
        }
        const data = await response.json();
        return data.results;  // Corrected path to the array of cities
    } catch (error) {
        console.error('Error fetching city data:', error);
        throw error;
    }
};