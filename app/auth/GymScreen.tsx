import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useProfileStore } from '@/utils/profile-store';
const gyms = [
    { name: "Equinox Brooklyn Heights", address: "194 Joralemon St, Brooklyn, NY" },
    { name: "Blink Fitness Flatbush", address: "842 Flatbush Ave, Brooklyn, NY" },
    { name: "Planet Fitness Staten Island", address: "155 Bricktown Way, Staten Island, NY" },
    { name: "Crunch Fitness Crown Heights", address: "842 Lefferts Ave, Brooklyn, NY" },
    { name: "YMCA Greenpoint", address: "99 Meserole Ave, Brooklyn, NY" },
    { name: "Anytime Fitness Bay Ridge", address: "7110 3rd Ave, Brooklyn, NY" },
    { name: "24 Hour Fitness Sheepshead Bay", address: "945 Kings Hwy, Brooklyn, NY" },
    { name: "Retro Fitness Coney Island", address: "1612 Mermaid Ave, Brooklyn, NY" },
    { name: "The Edge Fitness Clubs Flatbush", address: "2101 Church Ave, Brooklyn, NY" },
    { name: "Youfit Health Clubs Canarsie", address: "8920 Ave D, Brooklyn, NY" },
    { name: "Club Pilates Williamsburg", address: "169 N 4th St, Brooklyn, NY" },
    { name: "Orangetheory Fitness Park Slope", address: "248 Flatbush Ave, Brooklyn, NY" },
    { name: "F45 Training Brooklyn Heights", address: "132 Montague St, Brooklyn, NY" },
    { name: "Barry's Bootcamp Williamsburg", address: "200 Kent Ave, Brooklyn, NY" },
    { name: "UFC Gym Brooklyn", address: "16 3rd Ave, Brooklyn, NY" },
    { name: "Chuze Fitness Staten Island", address: "2795 Richmond Ave, Staten Island, NY" },
    { name: "LA Fitness Brooklyn", address: "945 Flatbush Ave, Brooklyn, NY" },
    { name: "Gold's Gym Staten Island", address: "2071 Clove Rd, Staten Island, NY" },
    { name: "Snap Fitness Bay Ridge", address: "6819 3rd Ave, Brooklyn, NY" },
    { name: "Lifetime Fitness Queens", address: "133-40 79th St Ste B, Howard Beach, NY 11414" },

];

export default function GymScreen() {
    const [search, setSearch] = useState('');
    const { setGym, profile } = useProfileStore();
    const router = useRouter();

    const filteredGyms = gyms.filter(gym =>
        gym.name.toLowerCase().includes(search.toLowerCase()) ||
        gym.address.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Header with back button and step indicator */}
            <View style={styles.header} className='pt-10'>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>{'←'}</Text>
                </TouchableOpacity>
                <Text style={styles.stepText}>Step 2 of 5</Text>
                <View style={{ width: 40 }} />
            </View>
            <Text style={styles.title}>Where do you workout?</Text>
            <TextInput
                style={styles.input}
                placeholder="Search for your gym"
                value={search}
                onChangeText={setSearch}
            />
            {search.length > 0 && (
                <View style={styles.gymListContainer}>
                    <FlatList
                        data={filteredGyms}
                        keyExtractor={item => item.name + item.address}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.gymItem, profile.gym === item.name && styles.gymItemSelected]}
                                onPress={() => setGym(item.name)}
                            >
                                <Text style={[styles.gymName, profile.gym === item.name && styles.gymNameSelected]}>{item.name}</Text>
                                <Text style={styles.gymAddress}>{item.address}</Text>
                            </TouchableOpacity>
                        )}
                        keyboardShouldPersistTaps="handled"
                        style={{ maxHeight: 200 }}
                    />
                </View>
            )}
            <View style={styles.mapPlaceholder}>
                {/* <AppleMaps.View style={{flex : 1, width: '100%', height: '100%' }} /> */}
                <Image source={require('@/assets/images/map.png')} style={{ flex: 1, width: '100%', height: '100%' }} />
            </View>
            <TouchableOpacity className=' bg-[#FF6936] text-white rounded-full p-4 w-full'>
                <Text style={styles.homeButtonText} className='text-center text-white'>Find On Map</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeButton} className='w-full flex items-center justify-center mt-4'>
                <Text style={styles.homeButtonText} className='text-[#FF6936]'>I work out at a home/private gym</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.nextButton, { opacity: profile.gym ? 1 : 0.5 }]}
                onPress={() => profile.gym && router.push('/auth/ExperienceScreen')}
                disabled={!profile.gym}
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
    input: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    gymListContainer: {
        marginBottom: 12,
    },
    gymItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    gymItemSelected: {
        borderColor: '#FF6936',
        backgroundColor: '#FFF3ED',
    },
    gymName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
    },
    gymNameSelected: {
        color: '#FF6936',
    },
    gymAddress: {
        fontSize: 13,
        color: '#666',
    },
    mapPlaceholder: {
        backgroundColor: '#eaeaea',
        borderRadius: 16,
        height: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    homeButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        width: '100%',
        borderColor: '#FF6936',
        marginBottom: 40,
    },
    homeButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
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