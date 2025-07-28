import { create } from 'zustand';
import { storage } from './local-storage';

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
    firstName: '',
    lastName: '',
    image: null,
    video: null,
    gym: '',
    experience: null,
    availability: [],
    trainingPreferences: [], // NEW FIELD
};

// Helper function to save profile to storage
const saveProfileToStorage = (profile: UserProfile) => {
    storage.set('profile', JSON.stringify(profile));
};

// Helper function to load profile from storage
const loadProfileFromStorage = (): UserProfile => {
    try {
        const stored = storage.getString('profile');
        if (stored) {
            const parsed = JSON.parse(stored);
            // Ensure all required fields exist
            return {
                ...initialProfile,
                ...parsed,
                // Ensure arrays are properly initialized
                availability: parsed.availability || [],
                trainingPreferences: parsed.trainingPreferences || [],
            };
        }
    } catch (error) {
        console.error('Error loading profile from storage:', error);
    }
    return { ...initialProfile };
};

export const useProfileStore = create<ProfileStore>((set, get) => ({
    profile: loadProfileFromStorage(),
    setFirstName: (firstName) => {
        const newProfile = { ...get().profile, firstName };
        set({ profile: newProfile });
        saveProfileToStorage(newProfile);
    },
    setLastName: (lastName) => {
        const newProfile = { ...get().profile, lastName };
        set({ profile: newProfile });
        saveProfileToStorage(newProfile);
    },
    setImage: (image) => {
        const newProfile = { ...get().profile, image };
        set({ profile: newProfile });
        saveProfileToStorage(newProfile);
    },
    setVideo: (video) => {
        const newProfile = { ...get().profile, video };
        set({ profile: newProfile });
        saveProfileToStorage(newProfile);
    },
    setGym: (gym) => {
        const newProfile = { ...get().profile, gym };
        set({ profile: newProfile });
        saveProfileToStorage(newProfile);
    },
    setExperience: (experience) => {
        const newProfile = { ...get().profile, experience };
        set({ profile: newProfile });
        saveProfileToStorage(newProfile);
    },
    setAvailability: (availability) => {
        const newProfile = { ...get().profile, availability };
        set({ profile: newProfile });
        saveProfileToStorage(newProfile);
    },
    setTrainingPreferences: (trainingPreferences) => {
        const newProfile = { ...get().profile, trainingPreferences };
        set({ profile: newProfile });
        saveProfileToStorage(newProfile);
    },
    setProfile: (profile) => {
        const newProfile = { ...get().profile, ...profile };
        set({ profile: newProfile });
        saveProfileToStorage(newProfile);
    },
    resetProfile: () => {
        set({ profile: { ...initialProfile } });
        saveProfileToStorage({ ...initialProfile });
    },
})); 