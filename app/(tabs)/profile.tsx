import OrangeMapIcon from '@/components/icons/OrangeMapIcon';
import OrangeTiltedDumbell from '@/components/icons/OrangeTiltedDumbell';
import OrangeTimeClock from '@/components/icons/OrangeTimeClock';
import { useProfileStore, type UserProfile } from '@/utils/profile-store';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    const { profile } = useProfileStore();
    const name = `${profile.firstName || 'John'} ${profile.lastName || 'Doe'}`; // Age hardcoded for demo
    const bio = 'Chasing gains, crushing limits. The grind is my happy place.'; // Demo bio
    const badges = badgeData(profile);
    return (
        <View style={styles.container}>
            {/* Header */}
            {/* <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton}>
                    <Text style={styles.backButtonText}>{'←'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ width: 32 }} />
            </View> */}
            <ScrollView contentContainerStyle={{ alignItems: 'center', height: '100%' }} style={{ height: 200 }} showsVerticalScrollIndicator={false}>
                {/* Profile Image */}
                <View style={styles.avatarWrap}>
                    <Image
                        source={profile.image ? { uri: profile.image } : require('@/assets/images/icon.png')}
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
                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editButtonText}>✏️ Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.previewButton}>
                        <Text style={styles.previewButtonText}>Preview</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100,
        backgroundColor: '#F7F7FA',
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
        gap: 12,
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
});

export default Profile;