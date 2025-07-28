import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV()

// Helper functions for custom workouts
export const saveCustomWorkouts = (workouts: any[]) => {
    storage.set('customWorkouts', JSON.stringify(workouts));
};

export const loadCustomWorkouts = () => {
    try {
        const stored = storage.getString('customWorkouts');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading custom workouts from storage:', error);
    }
    return [];
};