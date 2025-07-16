import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PersonalInfoScreen" options={{ headerShown: false }} />
            <Stack.Screen name="GymScreen" options={{ headerShown: false }} />
            <Stack.Screen name="ExperienceScreen" options={{ headerShown: false }} />
            <Stack.Screen name="TrainingPreferencesScreen" options={{ headerShown: false }} />
            <Stack.Screen name="AvailabilityScreen" options={{ headerShown: false }} />
        </Stack>
    );
} 