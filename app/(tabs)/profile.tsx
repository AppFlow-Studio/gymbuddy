import OrangeMapIcon from '@/components/icons/OrangeMapIcon';
import OrangeTiltedDumbell from '@/components/icons/OrangeTiltedDumbell';
import OrangeTimeClock from '@/components/icons/OrangeTimeClock';
import { useProfileStore, type UserProfile } from '@/utils/profile-store';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const badgeData = (profile: UserProfile) => [
    {
        icon: <OrangeTiltedDumbell />, label: profile.experience ? capitalize(profile.experience) : 'N/A',
    },
    {
        icon: <OrangeMapIcon />, label: profile.gym || 'N/A',
    },
    {
        icon: <OrangeTimeClock />, label: profile.availability.length > 0 ? profile.availability.join(', ') : 'N/A',
    },
];

function capitalize(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const Profile = () => {
    const { profile, setProfile, setFirstName, setLastName, setGym, setExperience, setAvailability, setTrainingPreferences, setImage } = useProfileStore();
    const router = useRouter();
    const name = `${profile.firstName || 'John'} ${profile.lastName || 'Doe'}`;
    const bio = 'Chasing gains, crushing limits. The grind is my happy place.';
    const badges = badgeData(profile);
    const bottomTabBarHeight = useBottomTabBarHeight();

    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [editData, setEditData] = useState({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        gym: profile.gym || '',
        experience: (profile.experience || 'beginner') as 'beginner' | 'intermediate' | 'advanced',
        availability: profile.availability || [],
        trainingPreferences: profile.trainingPreferences || []
    });

    const experienceOptions = ['beginner', 'intermediate', 'advanced'] as const;
    const availabilityOptions = ['Morning', 'Afternoon', 'Evening', 'Weekdays', 'Weekend'];
    const trainingOptions = ['Strength Training', 'Cardio', 'Yoga', 'CrossFit', 'Bodybuilding', 'Powerlifting', 'Functional Training', 'Sports', 'HIIT'];

    const handleSaveEdit = () => {
        setFirstName(editData.firstName);
        setLastName(editData.lastName);
        setGym(editData.gym);
        setExperience(editData.experience);
        setAvailability(editData.availability);
        setTrainingPreferences(editData.trainingPreferences);
        setShowEditModal(false);
        Alert.alert('Success', 'Profile updated successfully!');
    };

    const toggleAvailability = (option: string) => {
        setEditData(prev => ({
            ...prev,
            availability: prev.availability.includes(option)
                ? prev.availability.filter(item => item !== option)
                : [...prev.availability, option]
        }));
    };

    const toggleTrainingPreference = (option: string) => {
        setEditData(prev => ({
            ...prev,
            trainingPreferences: prev.trainingPreferences.includes(option)
                ? prev.trainingPreferences.filter(item => item !== option)
                : [...prev.trainingPreferences, option]
        }));
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Beta Disclaimer */}
            <View style={styles.betaDisclaimer}>
                <Text style={styles.betaText}>🚧 Beta Build - Features in Development</Text>
            </View>

            <ScrollView contentContainerStyle={{ alignItems: 'center', height: '100%', paddingBottom: bottomTabBarHeight + 100 }} style={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                {/* Profile Image */}
                <View style={styles.avatarWrap}>
                    <Image
                        source={profile.image ? { uri: profile.image } : require('@/assets/images/gymbuddyicon.png')}
                        style={styles.avatar}
                    />
                    <View style={styles.avatarBorder} />
                </View>
                {/* Name & Bio */}
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.bio}>{bio}</Text>
                {/* Badges */}
                <View className='flex flex-row flex-wrap gap-4 justify-center items-center px-4' >
                    {badges.map((badge, idx) => (
                        <View key={idx} style={styles.badge}>
                            <View style={styles.badgeIcon}>{badge.icon}</View>
                            <Text style={styles.badgeLabel}>{badge.label}</Text>
                        </View>
                    ))}
                </View>
                {/* Interests */}
                <View style={styles.interestsSection}>
                    <Text style={styles.interestsTitle}>Interests</Text>
                    <View style={styles.interestsRow}>
                        {profile.trainingPreferences.map((interest: string, idx: number) => (
                            <View key={idx} style={styles.interestChip}>
                                <Text style={styles.interestChipText}>{interest}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                {/* Edit & Preview Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.editButton} onPress={() => setShowEditModal(true)}>
                        <Text style={styles.editButtonText}>✏️ Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.previewButton} onPress={() => setShowPreviewModal(true)}>
                        <Text style={styles.previewButtonText}>Preview</Text>
                    </TouchableOpacity>
                </View>

                {/* Workout Log Button */}
                <View style={styles.workoutLogButtonContainer}>
                    <TouchableOpacity style={styles.workoutLogButton} onPress={() => router.push('./workout-log')}>
                        <Text style={styles.workoutLogButtonText}>Workout Log</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Edit Modal */}
            <Modal
                visible={showEditModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowEditModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>

                        <ScrollView style={styles.modalScroll}>
                            {/* Profile Picture Section */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Profile Picture</Text>
                                <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
                                    <Image
                                        source={profile.image ? { uri: profile.image } : require('@/assets/images/gymbuddyicon.png')}
                                        style={styles.profileImageEdit}
                                    />
                                    <View style={styles.profileImageOverlay}>
                                        <Text style={styles.profileImageText}>Change Photo</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>First Name</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={editData.firstName}
                                    onChangeText={(text) => setEditData(prev => ({ ...prev, firstName: text }))}
                                    placeholder="Enter first name"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Last Name</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={editData.lastName}
                                    onChangeText={(text) => setEditData(prev => ({ ...prev, lastName: text }))}
                                    placeholder="Enter last name"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Gym</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={editData.gym}
                                    onChangeText={(text) => setEditData(prev => ({ ...prev, gym: text }))}
                                    placeholder="Enter your gym"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Experience Level</Text>
                                <View style={styles.optionsRow}>
                                    {experienceOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[
                                                styles.optionChip,
                                                editData.experience === option && styles.optionChipSelected
                                            ]}
                                            onPress={() => setEditData(prev => ({ ...prev, experience: option }))}
                                        >
                                            <Text style={[
                                                styles.optionChipText,
                                                editData.experience === option && styles.optionChipTextSelected
                                            ]}>
                                                {capitalize(option)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Availability</Text>
                                <View style={styles.optionsRow}>
                                    {availabilityOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[
                                                styles.optionChip,
                                                editData.availability.includes(option) && styles.optionChipSelected
                                            ]}
                                            onPress={() => toggleAvailability(option)}
                                        >
                                            <Text style={[
                                                styles.optionChipText,
                                                editData.availability.includes(option) && styles.optionChipTextSelected
                                            ]}>
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Training Preferences</Text>
                                <View style={styles.optionsRow}>
                                    {trainingOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[
                                                styles.optionChip,
                                                editData.trainingPreferences.includes(option) && styles.optionChipSelected
                                            ]}
                                            onPress={() => toggleTrainingPreference(option)}
                                        >
                                            <Text style={[
                                                styles.optionChipText,
                                                editData.trainingPreferences.includes(option) && styles.optionChipTextSelected
                                            ]}>
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowEditModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSaveEdit}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Preview Modal */}
            <Modal
                visible={showPreviewModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowPreviewModal(false)}
            >
                <View style={styles.previewModalOverlay}>
                    <TouchableOpacity
                        style={styles.previewModalBackground}
                        onPress={() => setShowPreviewModal(false)}
                    />
                    <View style={styles.previewCard}>
                        <View style={styles.previewCardContent}>
                            {/* Match Badge */}
                            <View style={styles.previewMatchBadge}>
                                <MaterialCommunityIcons name="account-search" size={18} color="white" />
                                <Text style={styles.previewMatchText}>85% Match</Text>
                            </View>

                            {/* Profile Image */}
                            <Image
                                source={profile.image ? { uri: profile.image } : require('@/assets/images/gymbuddyicon.png')}
                                style={styles.previewImage}
                                resizeMode="cover"
                            />

                            {/* Gradient + Blur Overlay */}
                            <View style={styles.previewBlurContainer}>
                                <BlurView intensity={40} style={StyleSheet.absoluteFill} />
                                <LinearGradient
                                    colors={["rgba(28,28,30,0.7)", "rgba(28,28,30,0)"]}
                                    start={{ x: 0.5, y: 1 }}
                                    end={{ x: 0.5, y: 0 }}
                                    style={styles.previewGradient}
                                />
                            </View>

                            {/* Card Content */}
                            <View style={styles.previewInfo}>
                                <Text style={styles.previewName}>{name} (25)</Text>
                                <View style={styles.previewDetailRow}>
                                    <Ionicons name="location-sharp" size={16} color="#FF6936" />
                                    <Text style={styles.previewDetailText}>Trains at {profile.gym || 'No gym set'}</Text>
                                </View>
                                <View style={styles.previewDetailRow}>
                                    <FontAwesome5 name="dumbbell" size={14} color="#FF6936" />
                                    <Text style={styles.previewDetailText}>Experience level: {profile.experience ? capitalize(profile.experience) : 'Beginner'}</Text>
                                </View>
                                {/* Tags */}
                                <View style={styles.previewTags}>
                                    {profile.trainingPreferences.slice(0, 3).map((pref, idx) => (
                                        <View key={idx} style={styles.previewTag}>
                                            <Text style={styles.previewTagText}>{pref}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7FA',
    },
    betaDisclaimer: {
        backgroundColor: '#FFF0E5',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#FF6936',
        alignItems: 'center',
    },
    betaText: {
        fontSize: 12,
        color: '#FF6936',
        fontWeight: '600',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 32,
        paddingHorizontal: 24,
        marginBottom: 8,
    },
    backButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 28,
        color: '#222',
        fontWeight: '400',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
    },
    avatarWrap: {
        marginTop: 8,
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#FF6936',
        backgroundColor: '#eee',
        zIndex: 2,
    },
    avatarBorder: {
        position: 'absolute',
        width: 128,
        height: 128,
        borderRadius: 64,
        borderWidth: 3,
        borderColor: '#FF6936',
        top: -4,
        left: -4,
        zIndex: 1,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#222',
        marginTop: 8,
        textAlign: 'center',
    },
    bio: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
        marginBottom: 16,
        textAlign: 'center',
        paddingHorizontal: 24,
    },
    badgesRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginBottom: 24,
        paddingHorizontal: 24,
    },
    badge: {
        backgroundColor: '#fff',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 18,
        paddingHorizontal: 18,
        alignItems: 'center',
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    badgeIcon: {
        marginBottom: 6,
    },
    badgeLabel: {
        fontSize: 16,
        color: '#222',
        fontWeight: '500',
        textAlign: 'center',
    },
    interestsSection: {
        width: '100%',
        paddingHorizontal: 24,
        marginTop: 8,
    },
    interestsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 12,
    },
    interestsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 0,
    },
    interestChip: {
        backgroundColor: '#fff',
        borderRadius: 32,
        paddingVertical: 10,
        paddingHorizontal: 22,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    interestChipText: {
        fontSize: 18,
        color: '#222',
        fontWeight: '500',
    },
    buttonRow: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 100,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: 24,
        gap: 16,
    },
    editButton: {
        flex: 1,
        backgroundColor: '#FF6936',
        borderRadius: 32,
        paddingVertical: 18,
        alignItems: 'center',
        marginRight: 8,
        shadowColor: '#FF6936',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    previewButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 32,
        paddingVertical: 18,
        alignItems: 'center',
        marginLeft: 8,
        borderWidth: 2,
        borderColor: '#FF6936',
    },
    previewButtonText: {
        color: '#FF6936',
        fontWeight: 'bold',
        fontSize: 18,
    },
    workoutLogButtonContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 30,
        paddingHorizontal: 24,
    },
    workoutLogButton: {
        backgroundColor: '#FF6936',
        borderRadius: 32,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#FF6936',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    workoutLogButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalScroll: {
        maxHeight: 400,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImageEdit: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#FF6936',
    },
    profileImageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingVertical: 4,
        alignItems: 'center',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
    },
    profileImageText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    optionChipSelected: {
        backgroundColor: '#FF6936',
        borderColor: '#FF6936',
    },
    optionChipText: {
        fontSize: 14,
        color: '#666',
    },
    optionChipTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#FF6936',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#FF6936',
        fontWeight: '600',
        fontSize: 16,
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#FF6936',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    // Preview modal styles
    previewModalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewModalBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    previewCard: {
        width: 320,
        height: 480,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#FF6936',
    },
    previewCardContent: {
        flex: 1,
        position: 'relative',
    },
    previewMatchBadge: {
        position: 'absolute',
        left: 12,
        top: 12,
        zIndex: 10,
        backgroundColor: '#FF6936',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    previewMatchText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 4,
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    previewBlurContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 90,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        overflow: 'hidden',
    },
    previewGradient: {
        ...StyleSheet.absoluteFillObject,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    previewInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 24,
    },
    previewName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    previewDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    previewDetailText: {
        fontSize: 16,
        color: '#fff',
        marginLeft: 8,
    },
    previewTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    previewTag: {
        backgroundColor: '#FF6936',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    previewTagText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
});

export default Profile;
