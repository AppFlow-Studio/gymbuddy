import ProfileCard, { type Profile } from '@/components/ProfileCard';
import { TinderSwipeCards } from '@/components/TinderSwipeCards';
import { Ionicons } from '@expo/vector-icons';
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
];

export default function HomeScreen() {
  const handleSwipeLeft = (profile: Profile) => {
    console.log('Disliked:', profile.name);
    // TODO: Send to backend
  };
  const handleSwipeRight = (profile: Profile) => {
    console.log('Liked:', profile.name);
    // TODO: Send to backend
  };

  return (
    <View className="flex-1 bg-[#F7F7FA] px-4 pt-10">
      {/* Logo and Title */}
      <View className="items-center mb-6">
        <View className="bg-[#FF6936] rounded-full p-3 mb-2">
          <Ionicons name="barbell" size={36} color="white" />
        </View>
        <Text className="text-3xl font-bold text-[#FF6936]">Gym Buddy</Text>
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
