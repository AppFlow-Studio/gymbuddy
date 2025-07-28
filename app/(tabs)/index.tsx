import ProfileCard, { type Profile } from '@/components/ProfileCard';
import { TinderSwipeCards } from '@/components/TinderSwipeCards';
import { getProfiles } from '@/hooks/actions/get-profiles';
import { useProfileStore } from '@/utils/profile-store';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Randomizer functions
const getRandomGym = () => {
  const gyms = [
    'LA Fitness Queens', 'Planet Fitness Downtown', 'Gold\'s Gym Midtown', 'Anytime Fitness',
    '24 Hour Fitness', 'Crunch Fitness', 'Equinox', 'Blink Fitness', 'Retro Fitness',
    'Snap Fitness', 'YouFit', 'Planet Fitness Express', 'LA Fitness Premium',
    'Gold\'s Gym Elite', 'Anytime Fitness Plus', 'Crunch Signature', 'Equinox Sports Club'
  ];
  return gyms[Math.floor(Math.random() * gyms.length)];
};

const getRandomExperience = () => {
  const experiences = ['Beginner', 'Intermediate', 'Advanced'];
  return experiences[Math.floor(Math.random() * experiences.length)];
};

const getRandomTags = () => {
  const allTags = [
    'Bodybuilding', 'Calisthenics', 'Cardio', 'Yoga', 'Powerlifting', 'CrossFit',
    'HIIT', 'Strength Training', 'Olympic Lifting', 'Functional Training', 'Pilates',
    'Boxing', 'MMA', 'Swimming', 'Running', 'Cycling', 'Rock Climbing', 'Dance',
    'Martial Arts', 'Gymnastics', 'Weightlifting', 'Strongman', 'Endurance Training'
  ];

  // Randomly select 2-4 tags
  const numTags = Math.floor(Math.random() * 3) + 2; // 2-4 tags
  const shuffled = allTags.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numTags);
};

const getRandomMatch = () => {
  // Generate match percentage between 60-100
  return Math.floor(Math.random() * 41) + 60; // 60-100
};

// Function to transform RandomUser API data to GymBuddy format
const transformRandomUserToProfile = (randomUserData: any): Profile => {
  const user = randomUserData;
  const firstName = user.name.first;
  const lastName = user.name.last;
  const fullName = `${firstName} ${lastName}`;
  return {
    name: fullName,
    age: user.dob.age,
    gym: getRandomGym(),
    experience: getRandomExperience(),
    tags: getRandomTags(),
    image: user.picture.large,
    match: getRandomMatch(),
  };
};

// const profiles: Profile[] = [
//   {
//     name: 'Micheal Turner',
//     age: 27,
//     gym: 'LA Fitness Queens',
//     experience: 'Intermediate',
//     tags: ['Bodybuilding', 'Calisthenics'],
//     image: 'https://randomuser.me/api/portraits/men/32.jpg', // Placeholder for your profile image
//     match: 100,
//   },
//   // Example other profiles for swiping
//   {
//     name: 'Chris Evans',
//     age: 30,
//     gym: 'LA Fitness Queens',
//     experience: 'Intermediate',
//     tags: ['Calisthenics'],
//     image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&w=400',
//     match: 94,
//   },
//   {
//     name: 'Taylor Brooks',
//     age: 26,
//     gym: 'LA Fitness Queens',
//     experience: 'Intermediate',
//     tags: ['Bodybuilding', 'Calisthenics'],
//     image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&w=400',
//     match: 91,
//   },
//   {
//     name: 'Jordan Lee',
//     age: 29,
//     gym: 'LA Fitness Queens',
//     experience: 'Intermediate',
//     tags: ['Bodybuilding', 'Calisthenics'],
//     image: 'https://images.pexels.com/photos/733500/pexels-photo-733500.jpeg?auto=compress&w=400',
//     match: 89,
//   },
//   {
//     name: 'Morgan Smith',
//     age: 28,
//     gym: 'LA Fitness Queens',
//     experience: 'Intermediate',
//     tags: ['Bodybuilding'],
//     image: 'https://images.pexels.com/photos/4498290/pexels-photo-4498290.jpeg?auto=compress&w=400',
//     match: 87,
//   },
// ];

const userProfile = {
  name: 'You',
  image: 'https://randomuser.me/api/portraits/men/32.jpg', // Placeholder user image
};

// Example usage of the transformation function
// You can call this with RandomUser API data like:
// const randomUserResponse = await fetch('https://randomuser.me/api/');
// const randomUserData = await randomUserResponse.json();
// const gymBuddyProfile = transformRandomUserToProfile(randomUserData);

// Export the function for use in other components
export { getRandomExperience, getRandomGym, getRandomMatch, getRandomTags, transformRandomUserToProfile };

export default function HomeScreen() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useProfileStore();
  const router = useRouter();
  useEffect(() => {
    if (!profile.firstName) {
      router.replace('/auth/PersonalInfoScreen');
    }
    const fetchProfiles = async () => {
      setLoading(true);
      const FetchedProfiles = await getProfiles();
      const GymBuddyProfiles = FetchedProfiles.results.map((profile: any) => {
        const gymBuddyProfile = transformRandomUserToProfile(profile);
        return gymBuddyProfile;
      });
      setProfiles(GymBuddyProfiles);
    }
    fetchProfiles();
  }, []);

  const handleSwipeLeft = (profile: Profile) => {
    // TODO: Send to backend
  };
  const handleSwipeRight = (profile: Profile) => {
    // Handle right swipe logic here
    console.log('Right swipe on:', profile.name);
  };

  useEffect(() => {
    if (profiles.length > 0) {
      setLoading(false);
    }
  }, [profiles]);

  // Open modal when matchedProfile changes
  // This useEffect is no longer needed as matchedProfile is managed by TinderSwipeCards
  // useEffect(() => {
  //   if (matchedProfile) {
  //     setShowMatchModal(true);
  //   }
  // }, [matchedProfile]);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.betaDisclaimer}>
        <Text style={styles.betaText}>🚧 Beta Build - Features in Development</Text>
      </View>
      <View style={{ flexGrow: 1, paddingBottom: 100, paddingHorizontal: 4 }}>
        {/* Logo and Title */}
        <View className="items-center mb-6 mt-2">
          <View className="rounded-full p-2 mb-2">
            <Image source={require('@/assets/images/gymbuddyicon.png')} className="w-10 h-10 object-cover" />
          </View>
          <Text className="text-2xl font-bold text-[#FF6936]">Gym Buddy</Text>
        </View>

        {/* Search Bar */}
        {/* <View className="flex-row items-center bg-white rounded-full px-4 py-3 mb-6 shadow-sm">
          <Ionicons name="search" size={22} color="#B0B0B0" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-700"
            placeholder="Partners search"
            placeholderTextColor="#B0B0B0"
          />
          <View className="ml-2 bg-[#FF6936] rounded-full p-2">
            <Ionicons name="options-outline" size={20} color="white" />
          </View>
        </View> */}

        {/* Tinder Swipe Cards */}
        <View className="items-center justify-center mt-40">
          {loading ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', height: 300 }}>
              <ActivityIndicator size="large" color="#FF6936" />
              <Text style={{ marginTop: 12, color: '#FF6936', fontWeight: '600' }}>Loading profiles...</Text>
            </View>
          ) : (
            <>
              <Text style={{ color: '#FF6936', marginBottom: 10 }}>Profiles loaded: {profiles.length}</Text>
              <TinderSwipeCards
                data={profiles}
                renderCard={(profile, i, swiping, active) => <ProfileCard profile={profile} swiping={swiping} active={active} />}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            </>
          )}
        </View>

        {/* Match Modal */}

        {/* Action Buttons (optional, can be wired to swipe programmatically) */}
        {/*
        <View className="flex-row justify-center items-center gap-6 mt-4 mb-8">
          <Pressable className="bg-white w-14 h-14 rounded-full items-center justify-center border border-gray-200">
            <Ionicons name="close" size={28} color="#B0B0B0" />
          </Pressable>
          <Pressable className="bg-[#FF6936] w-14 h-14 rounded-full items-center justify-center">
            <Ionicons name="heart" size={28} color="white" />
          </Pressable>
          <Pressable className="bg-white w-14 h-14 rounded-full items-center justify-center border border-gray-200">
            <Ionicons name="person" size={28} color="#B0B0B0" />
          </Pressable>
        </View>
        */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingBottom: 50,
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
});