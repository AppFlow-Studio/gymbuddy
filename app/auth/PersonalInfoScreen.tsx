import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useProfileStore } from '@/utils/profile-store';

export default function PersonalInfoScreen() {
    const { setFirstName, setLastName, setImage, setVideo, profile } = useProfileStore();
    const router = useRouter();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const pickVideo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,
            quality: 0.7,
        });
        if (!result.canceled && result.assets.length > 0) {
            setVideo(result.assets[0].uri);
        }
    };

    const canContinue = !!profile.firstName && !!profile.lastName && !!profile.image;

    return (
        <View style={styles.container}>
            {/* Header with step indicator */}
            <View style={styles.header} className='pt-10'>
                <Text style={styles.stepText}>Step 1 of 5</Text>
            </View>
            <Text style={styles.title}>Personal Info</Text>
            <Text style={styles.subtitle}>Upload a profile picture and tell us about yourself</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {profile.image ? (
                    <Image source={{ uri: profile.image }} style={styles.image} />
                ) : (
                    <Text style={styles.imagePickerText}>Upload Profile Picture</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.videoPicker} onPress={pickVideo}>
                <Text style={styles.videoPickerText}>{profile.video ? 'Video Uploaded!' : 'Upload a video of your best lift (optional)'}</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={profile.firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={profile.lastName}
                onChangeText={setLastName}
            />
            <TouchableOpacity
                style={[styles.nextButton, { opacity: canContinue ? 1 : 0.5 }]}
                disabled={!canContinue}
                onPress={() => router.push('/auth/GymScreen')}
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
        marginBottom: 24,
        textAlign: 'center',
    },
    imagePicker: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#FF6936',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 20,
        overflow: 'hidden',
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    imagePickerText: {
        color: '#FF6936',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    videoPicker: {
        alignSelf: 'center',
        marginBottom: 24,
    },
    videoPickerText: {
        color: '#FF6936',
        fontSize: 14,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#eee',
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