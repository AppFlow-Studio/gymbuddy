import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useProfileStore } from '@/utils/profile-store';
const options = [
    { label: 'Morning', value: 'morning' },
    { label: 'Afternoon', value: 'afternoon' },
    { label: 'Evening', value: 'evening' },
    { label: 'Weekdays', value: 'weekdays' },
    { label: 'Weekend', value: 'weekend' },
];

export default function AvailabilityScreen() {
    const { setAvailability, profile } = useProfileStore();
    const router = useRouter();

    const toggleOption = (value: string) => {
        setAvailability(profile.availability.includes(value) ? profile.availability.filter((v) => v !== value) : [...profile.availability, value]);
    };

    return (
        <View style={styles.container}>
            {/* Header with back button and step indicator */}
            <View style={styles.header} className='pt-10'>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>{'←'}</Text>
                </TouchableOpacity>
                <Text style={styles.stepText}>Step 5 of 5</Text>
                <View style={{ width: 40 }} />
            </View>
            <Text style={styles.title}>When are you free to train?</Text>
            <View style={{ marginTop: 32, marginBottom: 40 }}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[styles.option, profile.availability.includes(option.value) && styles.optionSelected]}
                        onPress={() => toggleOption(option.value)}
                    >
                        <Text style={[styles.optionText, profile.availability.includes(option.value) && styles.optionTextSelected]}>{option.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity
                style={[styles.nextButton, { opacity: profile.availability.length > 0 ? 1 : 0.5 }]}
                disabled={profile.availability.length === 0}
                onPress={() => router.replace('/(tabs)')}
            >
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7FA',
        padding: 24,
        justifyContent: 'flex-start',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 8,
        minHeight: 32,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 24,
        color: '#FF6936',
        fontWeight: 'bold',
    },
    stepText: {
        color: '#FF6936',
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
        textAlign: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 24,
        color: '#222',
        textAlign: 'center',
    },
    option: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 16,
    },
    optionSelected: {
        borderColor: '#FF6936',
        backgroundColor: '#FFF3ED',
    },
    optionText: {
        fontSize: 18,
        color: '#222',
        fontWeight: '500',
    },
    optionTextSelected: {
        color: '#FF6936',
        fontWeight: 'bold',
    },
    nextButton: {
        position: 'absolute',
        right: 24,
        bottom: 40,
        backgroundColor: '#FF6936',
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 32,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
}); 