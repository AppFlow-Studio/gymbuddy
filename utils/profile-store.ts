import { create } from 'zustand';

export type UserProfile = {
    firstName: string;
    lastName: string;
    image: string | null;
    video: string | null;
    gym: string | null;
    experience: 'beginner' | 'intermediate' | 'advanced' | null;
    availability: string[];
    trainingPreferences: string[]; // NEW FIELD
};

type ProfileStore = {
    profile: UserProfile;
    setFirstName: (firstName: string) => void;
    setLastName: (lastName: string) => void;
    setImage: (image: string | null) => void;
    setVideo: (video: string | null) => void;
    setGym: (gym: string | null) => void;
    setExperience: (experience: 'beginner' | 'intermediate' | 'advanced' | null) => void;
    setAvailability: (availability: string[]) => void;
    setTrainingPreferences: (trainingPreferences: string[]) => void; // NEW SETTER
    setProfile: (profile: Partial<UserProfile>) => void;
    resetProfile: () => void;
};

const initialProfile: UserProfile = {
    firstName: 'Temur',
    lastName: 'Sayfutdinov',
    image: null,
    video: null,
    gym: 'LA Fitness',
    experience: 'intermediate',
    availability: ['morning', 'afternoon', 'evening'],
    trainingPreferences: ['strength', 'hypertrophy', 'endurance'], // NEW FIELD
};

export const useProfileStore = create<ProfileStore>((set) => ({
    profile: { ...initialProfile },
    setFirstName: (firstName) => set((state) => ({ profile: { ...state.profile, firstName } })),
    setLastName: (lastName) => set((state) => ({ profile: { ...state.profile, lastName } })),
    setImage: (image) => set((state) => ({ profile: { ...state.profile, image } })),
    setVideo: (video) => set((state) => ({ profile: { ...state.profile, video } })),
    setGym: (gym) => set((state) => ({ profile: { ...state.profile, gym } })),
    setExperience: (experience) => set((state) => ({ profile: { ...state.profile, experience } })),
    setAvailability: (availability) => set((state) => ({ profile: { ...state.profile, availability } })),
    setTrainingPreferences: (trainingPreferences) => set((state) => ({ profile: { ...state.profile, trainingPreferences } })), // NEW SETTER
    setProfile: (profile) => set((state) => ({ profile: { ...state.profile, ...profile } })),
    resetProfile: () => set({ profile: { ...initialProfile } }),
})); 