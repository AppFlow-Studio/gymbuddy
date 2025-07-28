import { create } from 'zustand';

// {
//     id: 2,
//     name: 'Back Day',
//     icon: '🏋️',
//     exercises: [
//         {
//             id: 1,
//             name: 'Pull-ups',
//             sets: [
//                 { id: 1, reps: 8, weight: 0, completed: false },
//                 { id: 2, reps: 8, weight: 0, completed: false },
//                 { id: 3, reps: 6, weight: 0, completed: false },
//             ]
//         },
//         {
//             id: 2,
//             name: 'Barbell Rows',
//             sets: [
//                 { id: 1, reps: 10, weight: 95, completed: false },
//                 { id: 2, reps: 10, weight: 95, completed: false },
//                 { id: 3, reps: 8, weight: 105, completed: false },
//             ]
//         }
//     ]
// }


export type Workout = {
    id: number;
    name: string;
    icon: string;
    exercises: Array<{
        id: number;
        name: string;
        sets: Array<{ id: number; reps: number; weight: number; completed: boolean; actualReps?: number; actualWeight?: number }>;
    }>;
}

export type WorkoutStore = {
    workouts: Workout[];
    setWorkouts: (workouts: Workout[]) => void;
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
    workouts: [],
    setWorkouts: (workouts) => set({ workouts }),
}));    