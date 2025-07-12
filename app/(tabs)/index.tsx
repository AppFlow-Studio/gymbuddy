import MatchModal from '@/components/MatchModal';
import ProfileCard, { type Profile } from '@/components/ProfileCard';
import { TinderSwipeCards } from '@/components/TinderSwipeCards';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

const profiles: Profile[] = [
  {
    name: 'Jessica Turner',
    age: 28,
    gym: 'Equinox Hurdson Yards',
    experience: 'Intermediate',
    tags: ['Powerlifting', 'Weightlifting', 'Bodybuilding'],
    image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&w=400',
    match: 92,
  },
  {
    name: 'Alex Kim',
    age: 25,
    gym: 'Crunch Fitness',
    experience: 'Beginner',
    tags: ['Crossfit', 'HIIT'],
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&w=400',
    match: 87,
  },
  {
    name: 'Maria Lopez',
    age: 31,
    gym: 'Planet Fitness',
    experience: 'Advanced',
    tags: ['Yoga', 'Pilates', 'Cardio'],
    image: 'https://images.pexels.com/photos/733500/pexels-photo-733500.jpeg?auto=compress&w=400',
    match: 95,
  },
  {
    name: 'Sarah Johnson',
    age: 26,
    gym: 'LA Fitness',
    experience: 'Intermediate',
    tags: ['Running', 'Cycling', 'Swimming'],
    image: 'https://images.pexels.com/photos/4498290/pexels-photo-4498290.jpeg?auto=compress&w=400',
    match: 89,
  },
  {
    name: 'Mike Chen',
    age: 29,
    gym: 'Gold\'s Gym',
    experience: 'Advanced',
    tags: ['Bodybuilding', 'Powerlifting', 'Strongman'],
    image: 'https://images.pexels.com/photos/4498291/pexels-photo-4498291.jpeg?auto=compress&w=400',
    match: 91,
  },
];

const userProfile = {
  name: 'You',
  image: 'https://randomuser.me/api/portraits/men/32.jpg', // Placeholder user image
};

export default function HomeScreen() {
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);

  const handleSwipeLeft = (profile: Profile) => {
    console.log('Disliked:', profile.name);
    // TODO: Send to backend
  };
  const handleSwipeRight = (profile: Profile) => {
    console.log('Liked:', profile.name);
    // Simulate a match with 50% probability
    if (Math.random() < 0.5) {
      setMatchedProfile(profile);
      setShowMatchModal(true);
    }
    // TODO: Send to backend
  };

  // Add debugging to see current profile
  console.log('Total profiles:', profiles.length);
  console.log('Profile names:', profiles.map(p => p.name));

  return (
    <View className="flex-1 bg-[#F7F7FA] px-4 pt-10">
      {/* Logo and Title */}
      <View className="items-center mb-6 mt-8">
        <View className="bg-[#FF6936] rounded-full p-2 mb-2">
          <Ionicons name="barbell" size={28} color="white" />
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
      <View className="flex-1 items-center justify-center">
        <TinderSwipeCards
          data={profiles}
          renderCard={(profile: Profile) => <ProfileCard profile={profile} />}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      </View>

      {/* Match Modal */}
      <MatchModal
        visible={showMatchModal}
        onClose={() => setShowMatchModal(false)}
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
