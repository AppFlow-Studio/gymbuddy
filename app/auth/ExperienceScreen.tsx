import OrangeTiltedDumbell from '@/components/icons/OrangeTiltedDumbell';
import { useProfileStore } from '@/utils/profile-store';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const levels = [
    { label: 'Beginner', value: 'beginner', numOfBells: 1, sub: 'Just getting started and looking for guidance', icon: 'Confident in my routine, looking to improve' },
    { label: 'Intermediate', value: 'intermediate', numOfBells: 2, sub: '3-4 times a week', icon: 'Confident in my routine, looking to improve' },
    { label: 'Advanced', value: 'advanced', numOfBells: 3, sub: '5+ times a week', icon: 'Confident in my routine, looking to improve' },
];

export default function ExperienceScreen() {
    const { setExperience, profile } = useProfileStore();
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header with back button and step indicator */}
            <View style={styles.header} className='pt-10'>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>{'←'}</Text>
                </TouchableOpacity>
                <Text style={styles.stepText}>Step 3 of 5</Text>
                <View style={{ width: 40 }} />
            </View>
            <Text style={styles.title}>What's your experience level?</Text>
            <Text style={styles.subtitle}>Help us create your personalized plan</Text>
            <View style={{ marginTop: 32, marginBottom: 40 }}>
                {levels.map((level) => (
                    <TouchableOpacity
                        key={level.value}
                        style={[styles.option, profile.experience === level.value && styles.optionSelected]}
                        onPress={() => setExperience(level.value)}
                        className=' flex flex-col items-center justify-center gap-y-4'
                    >
                        <View className='flex flex-row items-center justify-center gap-2'>
                            {Array.from({ length: level.numOfBells }).map((_, index) => (
                                <OrangeTiltedDumbell key={index} />
                            ))}
                        </View>
                        <Text style={[styles.optionText, profile.experience === level.value && styles.optionTextSelected]}>{level.label}</Text>
                        <Text style={styles.optionSubText} className='text-center'>{level.sub}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity
                style={[styles.nextButton, { opacity: profile.experience ? 1 : 0.5 }]}
                disabled={!profile.experience}
                onPress={() => router.push('/auth/TrainingPreferencesScreen')}
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
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
        textAlign: 'center',
    },
    option: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingTop: 40,
        flexDirection: 'column',
        paddingHorizontal: 32,
        paddingBottom: 18,
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
    optionSubText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '400',
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