// https://randomuser.me/api/?page=3&results=10&seed=abc


// Function to generate a random 3-letter combination
function generateRandomSeed(): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 3; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return result;
}

export async function getProfiles() {
    const randomSeed = generateRandomSeed();
    const API_URL = `https://randomuser.me/api/?page=3&results=10&seed=${randomSeed}`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error: any) {
        // You can customize this error handling as needed for your app
        if (__DEV__) {
            console.error('Failed to fetch profiles:', error);
        }
        return { error: error?.message || 'Unknown error' };
    }
}
