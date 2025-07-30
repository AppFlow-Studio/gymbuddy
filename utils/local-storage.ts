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

export const deleteCustomWorkout = (workoutId: number) => {
    try {
        const customWorkoutsStr = storage.getString('customWorkouts');
        console.log('customWorkoutsStr', customWorkoutsStr);
        let customWorkouts = [];
        if (customWorkoutsStr) {
            customWorkouts = JSON.parse(customWorkoutsStr);
            console.log('customWorkouts', customWorkouts);
            const workoutToRemoveIndex = customWorkouts.findIndex((workout: any) => Number(workout.id) === workoutId);
            if (workoutToRemoveIndex > -1) {
                customWorkouts.splice(workoutToRemoveIndex, 1);
                storage.set('customWorkouts', JSON.stringify(customWorkouts));
            }
            
        }
        return true;
    } catch (error) {
        console.error('Error deleting custom workout from storage:', error);
        return false;
    }
};