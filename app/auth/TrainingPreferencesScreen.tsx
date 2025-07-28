import { useProfileStore } from '@/utils/profile-store';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const trainingOptions = ['Strength Training', 'Cardio', 'Yoga', 'CrossFit', 'Bodybuilding', 'Powerlifting', 'Functional Training', 'Sports', 'HIIT'];


export default function TrainingPreferencesScreen() {
    const router = useRouter();
    const { profile, setTrainingPreferences } = useProfileStore();
    const selected = profile.trainingPreferences;

    const toggleOption = (option: string) => {
        if (selected.includes(option)) {
            setTrainingPreferences(selected.filter((o) => o !== option));
        } else {
            setTrainingPreferences([...selected, option]);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header with back button and step indicator */}
            <View style={styles.header} className='pt-10'>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>{'←'}</Text>
                </TouchableOpacity>
                <Text style={styles.stepText}>Step 4 of 5</Text>
                <View style={{ width: 40 }} />
            </View>
            <Text style={styles.title}>What are your preferred ways to train?</Text>
            <Text style={styles.subtitle}>You can select multiple options</Text>
            <View style={styles.optionsWrap}>
                {trainingOptions.map((option) => {
                    const isSelected = selected.includes(option);
                    return (
                        <TouchableOpacity
                            key={option}
                            style={[styles.option, isSelected && styles.optionSelected]}
                            onPress={() => toggleOption(option)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{option}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <TouchableOpacity
                style={[styles.nextButton, { opacity: selected.length > 0 ? 1 : 0.5 }]}
                disabled={selected.length === 0}
                onPress={() => router.push('/auth/AvailabilityScreen')}
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
        marginBottom: 8,
        color: '#222',
        textAlign: 'left',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 24,
        textAlign: 'left',
    },
    optionsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 40,
    },
    option: {
        backgroundColor: '#fff',
        borderRadius: 32,
        paddingVertical: 16,
        paddingHorizontal: 28,
        marginRight: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    optionSelected: {
        backgroundColor: '#FF6936',
        borderColor: '#FF6936',
    },
    optionText: {
        fontSize: 20,
        color: '#222',
        fontWeight: '500',
    },
    optionTextSelected: {
        color: '#fff',
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