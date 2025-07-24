import MatchModal from '@/components/MatchModal';
import ProfileCard, { type Profile } from '@/components/ProfileCard';
import { TinderSwipeCards } from '@/components/TinderSwipeCards';
import { useProfileStore } from '@/utils/profile-store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Text, TextInput, View } from 'react-native';
const profiles: Profile[] = [
  {
    name: 'Micheal Turner',
    age: 27,
    gym: 'LA Fitness Queens',
    experience: 'Intermediate',
    tags: ['Bodybuilding', 'Calisthenics'],
    image: 'https://randomuser.me/api/portraits/men/32.jpg', // Placeholder for your profile image
    match: 100,
  },
  // Example other profiles for swiping
  {
    name: 'Chris Evans',
    age: 30,
    gym: 'LA Fitness Queens',
    experience: 'Intermediate',
    tags: ['Calisthenics'],
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&w=400',
    match: 94,
  },
  {
    name: 'Taylor Brooks',
    age: 26,
    gym: 'LA Fitness Queens',
    experience: 'Intermediate',
    tags: ['Bodybuilding', 'Calisthenics'],
    image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&w=400',
    match: 91,
  },
  {
    name: 'Jordan Lee',
    age: 29,
    gym: 'LA Fitness Queens',
    experience: 'Intermediate',
    tags: ['Bodybuilding', 'Calisthenics'],
    image: 'https://images.pexels.com/photos/733500/pexels-photo-733500.jpeg?auto=compress&w=400',
    match: 89,
  },
  {
    name: 'Morgan Smith',
    age: 28,
    gym: 'LA Fitness Queens',
    experience: 'Intermediate',
    tags: ['Bodybuilding'],
    image: 'https://images.pexels.com/photos/4498290/pexels-photo-4498290.jpeg?auto=compress&w=400',
    match: 87,
  },
];

const userProfile = {
  name: 'You',
  image: 'https://randomuser.me/api/portraits/men/32.jpg', // Placeholder user image
};

export default function HomeScreen() {
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const { profile } = useProfileStore();
  const router = useRouter();
  // useEffect(() => {
  //   if (!profile.firstName) {
  //     router.replace('/auth/PersonalInfoScreen');
  //   }
  //   console.log(profile);
  // }, []);
  const handleSwipeLeft = (profile: Profile) => {
    setMatchedProfile(null);
    setShowMatchModal(false);
    console.log('Disliked:', profile.name);
    // TODO: Send to backend
  };
  const handleSwipeRight = (profile: Profile) => {
    // Simulate a match with 90% probability
    if (Math.random() < 0.9) {
      setMatchedProfile(profile);
    }
    // TODO: Send to backend
  };

  // Open modal when matchedProfile changes
  React.useEffect(() => {
    if (matchedProfile) {
      setShowMatchModal(true);
    }
  }, [matchedProfile]);

  // Add debugging to see current profile
  console.log('Total profiles:', profiles.length);
  console.log('Profile names:', profiles.map(p => p.name));

  return (
    <View className="flex-1 bg-[#F7F7FA] px-4 pt-10">
      {/* Logo and Title */}
      <View className="items-center mb-6 mt-8">
        <View className="rounded-full p-2 mb-2">
          <Image source={require('@/assets/images/gymbuddyicon.png')} className="w-10 h-10 object-cover" />
        </View>
        <Text className="text-2xl font-bold text-[#FF6936]">Gym Buddy</Text>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center bg-white rounded-full px-4 py-3 mb-6 shadow-sm">
        <Ionicons name="search" size={22} color="#B0B0B0" />
        <TextInput
          className="flex-1 ml-2 text-base text-gray-700"
          placeholder="Partners search"
          placeholderTextColor="#B0B0B0"
        />
        <View className="ml-2 bg-[#FF6936] rounded-full p-2">
          <Ionicons name="options-outline" size={20} color="white" />
        </View>
      </View>

      {/* Tinder Swipe Cards */}
      <View className="items-center justify-center mt-40">
        <TinderSwipeCards
          data={profiles}
          renderCard={(profile, i, swiping, active) => <ProfileCard profile={profile} swiping={swiping} active={active} />}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          setMatchedProfile={setMatchedProfile}
        />
      </View>

      {/* Match Modal */}
      <MatchModal
        visible={showMatchModal}
        onClose={() => {
          setShowMatchModal(false);
          setMatchedProfile(null);
        }}
        userProfile={userProfile}
        matchedProfile={matchedProfile}
      />

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
  );
}
