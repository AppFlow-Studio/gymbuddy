import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const IMAGE_WIDTH = SCREEN_WIDTH * 0.90;
const IMAGE_HEIGHT = SCREEN_HEIGHT  * 0.60;
export type Profile = {
    name: string;
    age: number;
    gym: string;
    experience: string;
    tags: string[];
    image: string;
    match: number;
};

type ProfileCardProps = {
    profile: Profile;
};

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    card: {
        position: 'relative',
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        alignSelf: 'center', // Centers horizontally
        marginTop: -100,     // Move up by 100px (adjust this value as needed)
        // marginBottom: 'auto',
    },
});

export default function ProfileCard({ profile }: ProfileCardProps) {
    return (
        <View style={styles.card} className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-[#FF6936]">
            {/* Match Badge */}
            <View className="absolute left-3 top-3 z-10 bg-[#FF6936] rounded-full px-4 py-2 flex-row items-center">
                <MaterialCommunityIcons name="account-search" size={18} color="white" />
                <Text className="text-white font-semibold text-base ml-1">{profile.match}% Match</Text>
            </View>
            {/* User Image */}
            <Image
                source={{ uri: profile.image }}
                className="w-full h-full"
                resizeMode="cover"
            />
            {/* Card Content */}
            <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 pt-10 pb-6">
                <Text className="text-white text-xl font-bold mb-1">{profile.name} ({profile.age})</Text>
                <View className="flex-row items-center mb-1">
                    <Ionicons name="location-sharp" size={16} color="#FF6936" />
                    <Text className="text-white ml-2 text-base">Trains at {profile.gym}</Text>
                </View>
                <View className="flex-row items-center mb-3">
                    <FontAwesome5 name="dumbbell" size={14} color="#FF6936" />
                    <Text className="text-white ml-2 text-base">Experience level: {profile.experience}</Text>
                </View>
                {/* Tags */}
                <View className="flex-row flex-wrap gap-2 mb-4">
                    {profile.tags.map((tag, idx) => (
                        <View key={idx} className="bg-[#FF6936] rounded-full px-4 py-2">
                            <Text className="text-white font-semibold">{tag}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
} 