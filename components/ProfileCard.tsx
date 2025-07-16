import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const IMAGE_WIDTH = SCREEN_WIDTH * 0.80;
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.51;
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
    swiping?: boolean;
    active?: boolean
};

const styles = StyleSheet.create({
    card: {
        position: 'relative',
        width: IMAGE_WIDTH,
        height: SCREEN_HEIGHT * 0.50,
        alignSelf: 'center', // Centers horizontally
        marginTop: -100,     // Move up by 100px (adjust this value as needed)
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        marginTop: 16,
    },
    actionButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: 'white',
    },
    actionButtonPrimary: {
        backgroundColor: '#FF6936',
        borderColor: '#FF6936',
    },
    blurContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 90,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        overflow: 'hidden',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
});

export default function ProfileCard({ profile, swiping = false, active = false }: ProfileCardProps) {
    const opacityOnSwipe = useAnimatedStyle(() => ({
        opacity: withTiming(swiping ? 0 : 1, { duration: 300 }),
    }));
    return (
        <View className={`h-[${IMAGE_HEIGHT}px] relative pb-20 w-[${IMAGE_WIDTH}px]`}>
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
                {/* Gradient + Blur Overlay at Bottom for Readability */}
                <View style={styles.blurContainer} pointerEvents="none">
                    <BlurView intensity={40} style={StyleSheet.absoluteFill} />
                    <LinearGradient
                        colors={["rgba(28,28,30,0.7)", "rgba(28,28,30,0)"]}
                        start={{ x: 0.5, y: 1 }}
                        end={{ x: 0.5, y: 0 }}
                        style={styles.gradient}
                    />
                </View>
                {/* Card Content */}
                <View className="absolute bottom-0 left-0 right-0 px-6 pt-10 pb-6">
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

            {/* Action Buttons */}
            <View className={`absolute bottom-12 left-0 right-0 ${active ? 'flex' : 'hidden'}`}>
                <Animated.View
                    style={[styles.actionRow, opacityOnSwipe]}
                >
                    <Pressable style={styles.actionButton}>
                        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <G clip-path="url(#clip0_104_9790)">
                                <Path d="M23.7068 0.293275C23.5193 0.105804 23.2649 0.000488281 22.9998 0.000488281C22.7346 0.000488281 22.4803 0.105804 22.2928 0.293275L11.9998 10.5863L1.70679 0.293275C1.51926 0.105804 1.26495 0.000488281 0.999786 0.000488281C0.734622 0.000488281 0.480314 0.105804 0.292786 0.293275C0.105315 0.480802 0 0.735111 0 1.00027C0 1.26544 0.105315 1.51975 0.292786 1.70727L10.5858 12.0003L0.292786 22.2933C0.105315 22.4808 0 22.7351 0 23.0003C0 23.2654 0.105315 23.5197 0.292786 23.7073C0.480314 23.8947 0.734622 24.0001 0.999786 24.0001C1.26495 24.0001 1.51926 23.8947 1.70679 23.7073L11.9998 13.4143L22.2928 23.7073C22.4803 23.8947 22.7346 24.0001 22.9998 24.0001C23.2649 24.0001 23.5193 23.8947 23.7068 23.7073C23.8943 23.5197 23.9996 23.2654 23.9996 23.0003C23.9996 22.7351 23.8943 22.4808 23.7068 22.2933L13.4138 12.0003L23.7068 1.70727C23.8943 1.51975 23.9996 1.26544 23.9996 1.00027C23.9996 0.735111 23.8943 0.480802 23.7068 0.293275Z" fill="#374957" />
                            </G>
                            <Defs>
                                <ClipPath id="clip0_104_9790">
                                    <Rect width="24" height="24" fill="white" />
                                </ClipPath>
                            </Defs>
                        </Svg>
                    </Pressable>
                    <Pressable style={[styles.actionButton, styles.actionButtonPrimary]}>
                        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <G clip-path="url(#clip0_104_9793)">
                                <Path d="M17.5009 1.9165C16.3749 1.93402 15.2734 2.24836 14.3077 2.82778C13.342 3.40719 12.5463 4.23117 12.0009 5.2165C11.4556 4.23117 10.6599 3.40719 9.69417 2.82778C8.72848 2.24836 7.62698 1.93402 6.50094 1.9165C4.70588 1.99449 3.01464 2.77976 1.79672 4.10074C0.578794 5.42171 -0.0668157 7.17103 0.000934853 8.9665C0.000934853 13.5135 4.78693 18.4795 8.80093 21.8465C9.69715 22.5996 10.8303 23.0125 12.0009 23.0125C13.1716 23.0125 14.3047 22.5996 15.2009 21.8465C19.2149 18.4795 24.0009 13.5135 24.0009 8.9665C24.0687 7.17103 23.4231 5.42171 22.2052 4.10074C20.9872 2.77976 19.296 1.99449 17.5009 1.9165ZM13.9159 20.3165C13.3799 20.7679 12.7017 21.0154 12.0009 21.0154C11.3002 21.0154 10.622 20.7679 10.0859 20.3165C4.94793 16.0055 2.00093 11.8695 2.00093 8.9665C1.93258 7.70122 2.3673 6.46023 3.2103 5.5142C4.0533 4.56817 5.23617 3.99385 6.50094 3.9165C7.7657 3.99385 8.94857 4.56817 9.79157 5.5142C10.6346 6.46023 11.0693 7.70122 11.0009 8.9665C11.0009 9.23172 11.1063 9.48607 11.2938 9.67361C11.4814 9.86115 11.7357 9.9665 12.0009 9.9665C12.2662 9.9665 12.5205 9.86115 12.708 9.67361C12.8956 9.48607 13.0009 9.23172 13.0009 8.9665C12.9326 7.70122 13.3673 6.46023 14.2103 5.5142C15.0533 4.56817 16.2362 3.99385 17.5009 3.9165C18.7657 3.99385 19.9486 4.56817 20.7916 5.5142C21.6346 6.46023 22.0693 7.70122 22.0009 8.9665C22.0009 11.8695 19.0539 16.0055 13.9159 20.3125V20.3165Z" fill="#F4FCFA" />
                            </G>
                            <Defs>
                                <ClipPath id="clip0_104_9793">
                                    <Rect width="24" height="24" fill="white" />
                                </ClipPath>
                            </Defs>
                        </Svg>
                    </Pressable>
                    <Pressable style={[styles.actionButton, styles.actionButtonPrimary]}>
                        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <G clip-path="url(#clip0_104_9798)">
                                <Path d="M9 12C10.1867 12 11.3467 11.6481 12.3334 10.9888C13.3201 10.3295 14.0892 9.39246 14.5433 8.2961C14.9974 7.19975 15.1162 5.99335 14.8847 4.82946C14.6532 3.66558 14.0818 2.59648 13.2426 1.75736C12.4035 0.918247 11.3344 0.346802 10.1705 0.115291C9.00666 -0.11622 7.80026 0.00259972 6.7039 0.456726C5.60754 0.910851 4.67047 1.67989 4.01118 2.66658C3.35189 3.65328 3 4.81331 3 6C3.00159 7.59081 3.63424 9.11602 4.75911 10.2409C5.88399 11.3658 7.40919 11.9984 9 12ZM9 2C9.79113 2 10.5645 2.2346 11.2223 2.67412C11.8801 3.11365 12.3928 3.73836 12.6955 4.46927C12.9983 5.20017 13.0775 6.00444 12.9231 6.78036C12.7688 7.55629 12.3878 8.26902 11.8284 8.82843C11.269 9.38784 10.5563 9.7688 9.78036 9.92314C9.00444 10.0775 8.20017 9.99827 7.46927 9.69552C6.73836 9.39277 6.11365 8.88008 5.67412 8.22228C5.2346 7.56449 5 6.79113 5 6C5 4.93914 5.42143 3.92172 6.17157 3.17158C6.92172 2.42143 7.93913 2 9 2Z" fill="#F2F8FF" />
                                <Path d="M9 13.9998C6.61395 14.0027 4.32645 14.9518 2.63925 16.639C0.952057 18.3262 0.00291096 20.6137 0 22.9997C0 23.2649 0.105357 23.5193 0.292893 23.7068C0.48043 23.8944 0.734784 23.9997 1 23.9997C1.26522 23.9997 1.51957 23.8944 1.70711 23.7068C1.89464 23.5193 2 23.2649 2 22.9997C2 21.1432 2.7375 19.3627 4.05025 18.05C5.36301 16.7372 7.14348 15.9998 9 15.9998C10.8565 15.9998 12.637 16.7372 13.9497 18.05C15.2625 19.3627 16 21.1432 16 22.9997C16 23.2649 16.1054 23.5193 16.2929 23.7068C16.4804 23.8944 16.7348 23.9997 17 23.9997C17.2652 23.9997 17.5196 23.8944 17.7071 23.7068C17.8946 23.5193 18 23.2649 18 22.9997C17.9971 20.6137 17.0479 18.3262 15.3607 16.639C13.6735 14.9518 11.3861 14.0027 9 13.9998Z" fill="#F2F8FF" />
                                <Path d="M22.0002 7.875C21.4437 7.90272 20.9208 8.14977 20.546 8.56207C20.1712 8.97437 19.9749 9.51836 20.0002 10.075C20.0255 9.51836 19.8293 8.97437 19.4544 8.56207C19.0796 8.14977 18.5567 7.90272 18.0002 7.875C17.4437 7.90272 16.9208 8.14977 16.546 8.56207C16.1712 8.97437 15.9749 9.51836 16.0002 10.075C16.0002 11.805 18.2562 13.832 19.3802 14.734C19.5561 14.8749 19.7748 14.9516 20.0002 14.9516C20.2256 14.9516 20.4443 14.8749 20.6202 14.734C21.7442 13.834 24.0002 11.805 24.0002 10.075C24.0255 9.51836 23.8292 8.97437 23.4544 8.56207C23.0796 8.14977 22.5567 7.90272 22.0002 7.875Z" fill="#F2F8FF" />
                            </G>
                            <Defs>
                                <ClipPath id="clip0_104_9798">
                                    <Rect width="24" height="24" fill="white" />
                                </ClipPath>
                            </Defs>
                        </Svg>
                    </Pressable>
                </Animated.View>
            </View>
        </View>
    );
} 