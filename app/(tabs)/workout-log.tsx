import React, { useState, useRef } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';

const WorkoutLog = () => {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(20);

    const [showTimer, setShowTimer] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(15);
    const [timerRunning, setTimerRunning] = useState(true);
    const [currentSetIdx, setCurrentSetIdx] = useState(0);
    const [completedSets, setCompletedSets] = useState([false, false, false]);

    React.useEffect(() => {
        if (!showTimer || !timerRunning) return;
        if (timerSeconds <= 0) return;
        const interval = setInterval(() => {
            setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [showTimer, timerRunning, timerSeconds]);

    React.useEffect(() => {
        if (showTimer && timerSeconds === 0) {
            setTimeout(() => {
                setShowTimer(false);
                setTimerRunning(true);
                setTimerSeconds(15);
                setCompletedSets((prev) => {
                    const updated = [...prev];
                    updated[currentSetIdx] = true;
                    return updated;
                });
                if (currentSetIdx < 2) {
                    setCurrentSetIdx(currentSetIdx + 1);
                }
            }, 600);
        }
    }, [showTimer, timerSeconds, currentSetIdx]);

    const calendarDays = [
        { day: 17, label: 'MON' },
        { day: 18, label: 'TUE' },
        { day: 19, label: 'WED' },
        { day: 20, label: 'THU' },
        { day: 21, label: 'FRI' },
        { day: 22, label: 'SAT' },
        { day: 23, label: 'SUN' }
    ];

    const workoutTypes = [
        {
            id: 1,
            name: 'Push Day',
            sets: 3,
            reps: 10,
            weight: 680,
            additionalWeight: 25,
            icon: 'custom',
            iconBg: '#FFF0E5'
        },
        {
            id: 2,
            name: 'Legs',
            sets: 3,
            reps: 5,
            weight: 630,
            additionalWeight: 25,
            icon: 'x',
            iconBg: '#FFF0E5'
        },
        {
            id: 3,
            name: 'Full Body',
            sets: 3,
            reps: 8,
            weight: 450,
            additionalWeight: 25,
            icon: 'x',
            iconBg: '#FFF0E5'
        },
        {
            id: 4,
            name: 'Cardio',
            sets: 3,
            reps: 10,
            weight: 390,
            additionalWeight: 25,
            icon: 'x',
            iconBg: '#FFF0E5'
        },
        {
            id: 5,
            name: 'Cable Crossover Fly',
            sets: 4,
            reps: 10,
            weight: 50,
            additionalWeight: 5,
            icon: 'x',
            iconBg: '#FFF0E5'
        }
    ];

    const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const modalTranslateY = useRef(new Animated.Value(400)).current;

    const openModal = () => {
        setModalVisible(true);
        modalTranslateY.setValue(400);
        overlayOpacity.setValue(0);
        Animated.timing(modalTranslateY, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
        }).start(() => {
            Animated.timing(overlayOpacity, {
                toValue: 1,
                duration: 180,
                useNativeDriver: true,
            }).start();
        });
    };

    const closeModal = () => {
        Animated.timing(overlayOpacity, {
            toValue: 0,
            duration: 120,
            useNativeDriver: true,
        }).start(() => {
            Animated.timing(modalTranslateY, {
                toValue: 400,
                duration: 180,
                useNativeDriver: true,
            }).start(() => {
                setModalVisible(false);
            });
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <View style={styles.roundedBackButton}>
                        <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
                            <Path d="M6.46964 0.469655C6.76253 0.176788 7.2373 0.176775 7.53019 0.469655C7.82305 0.762541 7.82305 1.23731 7.53019 1.5302L2.06046 6.99993L7.53019 12.4697C7.82308 12.7625 7.82308 13.2373 7.53019 13.5302C7.2373 13.8231 6.76253 13.8231 6.46964 13.5302L0.46964 7.5302C0.176803 7.23731 0.176771 6.76253 0.46964 6.46966L6.46964 0.469655Z" fill="#49494B" />
                        </Svg>
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Workout Log</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 64 }}>
                <View style={styles.calendarSection}>
                    <View style={styles.monthHeaderRow}>
                        <TouchableOpacity style={styles.monthArrowButton}>
                            <View style={styles.roundedMonthArrow}>
                                <Svg width={5} height={8} viewBox="0 0 5 8" fill="none">
                                    <Path d="M4 1C4 1 1 2.776 1 4C1 5.22357 4 7 4 7" stroke="#FF6936" strokeLinecap="round" strokeLinejoin="round" />
                                </Svg>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.monthText}>January 2023</Text>
                        <TouchableOpacity style={styles.monthArrowButton}>
                            <View style={styles.roundedMonthArrow}>
                                <Svg width={5} height={8} viewBox="0 0 5 8" fill="none" style={{ transform: [{ scaleX: -1 }] }}>
                                    <Path d="M4 1C4 1 1 2.776 1 4C1 5.22357 4 7 4 7" stroke="#FF6936" strokeLinecap="round" strokeLinejoin="round" />
                                </Svg>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexDirection: 'row', alignItems: 'flex-end', position: 'relative', marginBottom: 10 }}
                        style={{ marginHorizontal: -24 }}
                    >
                        {calendarDays.map((item, idx) => {
                            const isEdge = idx === 0 || idx === calendarDays.length - 1;
                            const isSelected = selectedDate === item.day;
                            return (
                                <TouchableOpacity
                                    key={item.day}
                                    activeOpacity={0.8}
                                    onPress={() => setSelectedDate(item.day)}
                                    style={[
                                        styles.dayButton,
                                        isSelected && styles.selectedDay,
                                        isEdge && !isSelected && styles.edgeDayUnselected
                                    ]}
                                >
                                    <Text style={[styles.dayLabel, isSelected && styles.selectedDayLabel]}>{item.label}</Text>
                                    <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{item.day}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                <TouchableOpacity style={[styles.addPastWorkoutButton, { marginBottom: 16 }]}> 
                    <Text style={styles.addPastWorkoutText}>Add Past Workout</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Select workout Type</Text>
                <Text style={styles.sectionSubtitle}>Choose your workout, chase your goals.</Text>

                <View style={{ marginBottom: 16 }}>
                    {workoutTypes.map((workout) => {
                        const isSelected = selectedWorkoutId === workout.id;
                        return (
                            <TouchableOpacity
                                key={workout.id}
                                style={[styles.workoutTypeCard, isSelected && styles.workoutTypeCardSelected]}
                                activeOpacity={0.85}
                                onPress={() => setSelectedWorkoutId(workout.id)}
                            >
                                <View style={styles.workoutTypeLeft}>
                                    <View style={[styles.workoutIcon, { backgroundColor: workout.iconBg }]}> 
                                        <Svg width={18} height={19} viewBox="0 0 18 19" fill="none">
                                            <Path d="M12.2836 13.6779L4.55857 16.9329C3.75607 17.2704 3.05855 16.2729 3.65105 15.6354L9.50855 9.27539L12.546 12.3654C12.951 12.7704 12.8161 13.4604 12.2836 13.6779Z" fill="#FF6936"/>
                                            <Path d="M14.3792 3.32738L9.51173 9.27488L6.47423 6.19988C6.06923 5.78738 6.20422 5.09738 6.73672 4.87988L13.4417 2.06738C14.2217 1.73738 14.9192 2.67488 14.3792 3.32738Z" fill="#FF6936"/>
                                        </Svg>
                                    </View>
                                    <View style={styles.workoutInfo}>
                                        <Text style={styles.workoutName}>{workout.name}</Text>
                                        <Text style={styles.workoutDetails}>{workout.sets} sets • {workout.reps} reps</Text>
                                    </View>
                                </View>
                                <View style={styles.workoutTypeRight}>
                                    <Text style={styles.caloriesText}>{workout.weight}lbs</Text>
                                    <Text style={styles.additionalCaloriesMuted}>+{workout.additionalWeight}lbs</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity style={styles.createCustomButton}>
                    <Text style={styles.createCustomText}>Create Custom Workout</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.startWorkoutButton}
                    onPress={openModal}
                    disabled={!selectedWorkoutId}
                >
                    <Text style={styles.startWorkoutText}>Start Workout</Text>
                </TouchableOpacity>

                <Modal
                    visible={modalVisible}
                    animationType="none"
                    transparent={true}
                    onRequestClose={closeModal}
                >
                    <Animated.View style={[styles.modalOverlay, { opacity: overlayOpacity }]}>
                        <Pressable style={{ flex: 1 }} onPress={closeModal} />
                        <Animated.View style={[{
                                backgroundColor: '#fff',
                                borderTopLeftRadius: 28,
                                borderTopRightRadius: 28,
                                minHeight: !completedSets.every(Boolean) ? SCREEN_HEIGHT * 0.6 : SCREEN_HEIGHT * 0.3,
                                maxHeight: !completedSets.every(Boolean) ? SCREEN_HEIGHT * 0.6 : SCREEN_HEIGHT * 0.3,
                                paddingHorizontal: 24,
                                paddingTop: 16,
                                paddingBottom: 24,
                                shadowColor: '#000',
                                shadowOpacity: 0.08,
                                shadowRadius: 12,
                                elevation: 8,
                            }, { transform: [{ translateY: modalTranslateY }] }]}>
                            <View style={styles.modalHandle} />
                            {!completedSets.every(Boolean) &&
                                <>
                                    <Text style={[styles.modalWorkoutName, { width: '100%', textAlign: 'center', alignSelf: 'center', fontWeight: '700' }] }>
                                        {selectedWorkoutId ? workoutTypes.find(w => w.id === selectedWorkoutId)?.name : 'Workout'}
                                    </Text>
                                    <Text style={[styles.modalWorkoutSub, { width: '100%', textAlign: 'center', alignSelf: 'center', fontWeight: '500' }]}>3 sets • 10 reps</Text>
                                    <View style={{ width: '100%', alignSelf: 'center', maxWidth: 400, padding: 0 }}>
                                    {[0, 1, 2].map((idx, val) => {
                                        let status = 'upcoming';
                                        if (completedSets[idx]) status = 'completed';
                                        else if (idx === currentSetIdx) status = 'active';
                                        return (
                                            <View key={idx} style={{ marginBottom: idx < 2 ? 24 : 0, position: 'relative', opacity: status === 'upcoming' ? 0.6 : 1 }}>
                                                {idx < 2 && (
                                                    <>
                                                        <View style={{ position: 'absolute', left: 24, top: 50, width: 2, height: 20, backgroundColor: '#e5e7eb', zIndex: 0 }} />
                                                        <Svg width={16} height={16} style={{ position: 'absolute', left: 17, top: 65, zIndex: 0 }} viewBox="0 0 16 16" fill="none">
                                                            <Path d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0Z" fill="#FEFEFF" />
                                                            <Path d="M7.99973 3.09961C4.81306 3.09961 2.21973 5.69294 2.21973 8.87961C2.21973 12.0663 4.81306 14.6663 7.99973 14.6663C11.1864 14.6663 13.7797 12.0729 13.7797 8.88628C13.7797 5.69961 11.1864 3.09961 7.99973 3.09961ZM8.49973 8.66628C8.49973 8.93961 8.27306 9.16628 7.99973 9.16628C7.72639 9.16628 7.49973 8.93961 7.49973 8.66628V5.33294C7.49973 5.05961 7.72639 4.83294 7.99973 4.83294C8.27306 4.83294 8.49973 5.05961 8.49973 5.33294V8.66628Z" fill="#D2D2D2" />
                                                            <Path d="M9.92708 2.29967H6.07375C5.80708 2.29967 5.59375 2.08634 5.59375 1.81967C5.59375 1.55301 5.80708 1.33301 6.07375 1.33301H9.92708C10.1937 1.33301 10.4071 1.54634 10.4071 1.81301C10.4071 2.07967 10.1937 2.29967 9.92708 2.29967Z" fill="#D2D2D2" />
                                                        </Svg>
                                                        <View style={{ position: 'absolute', left: 24, top: 81, width: 2, height: 20, backgroundColor: '#e5e7eb', zIndex: 0 }} />
                                                    </>
                                                )}
                                                {idx === 2 && (
                                                    <>
                                                        <View style={{ position: 'absolute', left: 24, top: 50, width: 2, height: 20, backgroundColor: '#e5e7eb', zIndex: 0 }} />
                                                        <Svg width={32} height={32} style={{ position: 'absolute', left: 9.5, top: 65, zIndex: 0 }} viewBox="0 0 32 32" fill="none">
                                                            <Rect width="32" height="32" rx="16" fill="#FEFEFF" />
                                                            <Path d="M8 16H24" stroke="#FF6936" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                                                            <Path d="M16 24V8" stroke="#FF6936" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                                                        </Svg>
                                                    </>
                                                )}
                                                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
                                                    <View style={{ width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: status === 'completed' ? '#f97316' : '#111827', zIndex: 1 }}>
                                                        {status === 'completed' ? (
                                                            <Svg width={32} height={33} viewBox="0 0 32 33" fill="none">
                                                                <Path d="M16.0003 3.16699C8.65366 3.16699 2.66699 9.15366 2.66699 16.5003C2.66699 23.847 8.65366 29.8337 16.0003 29.8337C23.347 29.8337 29.3337 23.847 29.3337 16.5003C29.3337 9.15366 23.347 3.16699 16.0003 3.16699Z" fill="transparent"/>
                                                                <Path d="M22.3737 13.4337L14.8137 20.9937C14.627 21.1803 14.3737 21.287 14.107 21.287C13.8403 21.287 13.587 21.1803 13.4003 20.9937L9.62699 17.2203C9.24033 16.8337 9.24033 16.1937 9.62699 15.807C10.0137 15.4203 10.6537 15.4203 11.0403 15.807L14.107 18.8737L20.9603 12.0203C21.347 11.6337 21.987 11.6337 22.3737 12.0203C22.7603 12.407 22.7603 13.0337 22.3737 13.4337Z" fill="#fff"/>
                                                            </Svg>
                                                        ) : (
                                                            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>{idx + 1}</Text>
                                                        )}
                                                    </View>
                                                    <View style={{ flex: 1, paddingTop: 4 }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                            <Text style={{ fontSize: 36, fontWeight: '700', color: status === 'active' ? '#111827' : '#9ca3af' }}>10</Text>
                                                            <Text style={{ fontSize: 24, color: status === 'active' ? '#9ca3af' : '#d1d5db' }}>Reps</Text>
                                                            <Text style={{ fontSize: 24, color: status === 'active' ? '#9ca3af' : '#d1d5db', marginHorizontal: 8 }}>/</Text>
                                                            <Text style={{ fontSize: 36, fontWeight: '700', color: status === 'active' ? '#111827' : '#9ca3af' }}>65</Text>
                                                            <Text style={{ fontSize: 24, color: status === 'active' ? '#9ca3af' : '#d1d5db' }}>Pounds</Text>
                                                        </View>
                                                        {idx < 2 && (
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 21 }}>
                                                                <Text style={{ color: '#9ca3af', fontSize: 14 }}>0:15 Rest</Text>
                                                            </View>
                                                        )}
                                                        {idx === 2 && (
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 22.5 }}>
                                                                <Text style={{ color: '#f97316', fontSize: 24 }}>Add Set</Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                </View>
                                            </View>
                                        );
                                    })}
                                    </View>
                                    {showTimer && (
                                        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', alignItems: 'center', borderBottomLeftRadius: 28, borderBottomRightRadius: 28, zIndex: 10, paddingBottom: 32 }}>
                                            <View style={{ minWidth: 320, maxWidth: 400, width: '90%', backgroundColor: '#e5e7eb', borderRadius: 18, padding: 24, alignItems: 'center', elevation: 8 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 8 }}>
                                                    <Text style={{ fontWeight: '700', fontSize: 20, textAlign: 'center', width: '99%' }}>Reset</Text>
                                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                        <TouchableOpacity onPress={() => setShowTimer(false)} style={{ padding: 4 }}>
                                                            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                                                                <Path d="M15.7128 16.7726L7.22748 8.28728C6.93757 7.99737 6.93757 7.51653 7.22748 7.22662C7.5174 6.93671 7.99823 6.93671 8.28814 7.22662L16.7734 15.7119C17.0633 16.0018 17.0633 16.4826 16.7734 16.7726C16.4835 17.0625 16.0027 17.0625 15.7128 16.7726Z" fill="#1C1C1E"/>
                                                                <Path d="M7.22658 16.7726C6.93666 16.4826 6.93666 16.0018 7.22658 15.7119L15.7119 7.22662C16.0018 6.93671 16.4826 6.93671 16.7725 7.22662C17.0624 7.51653 17.0624 7.99737 16.7725 8.28728L8.28724 16.7726C7.99732 17.0625 7.51649 17.0625 7.22658 16.7726Z" fill="#1C1C1E"/>
                                                            </Svg>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', width: '100%', marginTop: 18, gap: 8 }}>
                                                    <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => setTimerSeconds(prev => Math.max(prev - 10, 0))}>
                                                        <Svg width={25} height={24} viewBox="0 0 25 24" fill="none">
                                                            <Path d="M12.5001 4.65039C7.72008 4.65039 3.83008 8.54039 3.83008 13.3204C3.83008 18.1004 7.72008 22.0004 12.5001 22.0004C17.2801 22.0004 21.1701 18.1104 21.1701 13.3304C21.1701 8.55039 17.2801 4.65039 12.5001 4.65039ZM13.2501 13.0004C13.2501 13.4104 12.9101 13.7504 12.5001 13.7504C12.0901 13.7504 11.7501 13.4104 11.7501 13.0004V8.00039C11.7501 7.59039 12.0901 7.25039 12.5001 7.25039C12.9101 7.25039 13.2501 7.59039 13.2501 8.00039V13.0004Z" fill="#777778"/>
                                                            <Path d="M15.3896 3.45H9.60965C9.20965 3.45 8.88965 3.13 8.88965 2.73C8.88965 2.33 9.20965 2 9.60965 2H15.3896C15.7896 2 16.1096 2.32 16.1096 2.72C16.1096 3.12 15.7896 3.45 15.3896 3.45Z" fill="#777778"/>
                                                        </Svg>
                                                        <Text style={{ fontSize: 14, color: '#222', marginTop: 2, fontWeight: '500' }}>Decrease 10 sec</Text>
                                                    </TouchableOpacity>
                                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: '800', fontSize: 44, color: '#222', marginBottom: 2 }}>{pad(timerSeconds)}</Text>
                                                    </View>
                                                    <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => setTimerSeconds(prev => prev + 10)}>
                                                        <Svg width={25} height={24} viewBox="0 0 25 24" fill="none">
                                                            <Path d="M12.5001 4.65039C7.72008 4.65039 3.83008 8.54039 3.83008 13.3204C3.83008 18.1004 7.72008 22.0004 12.5001 22.0004C17.2801 22.0004 21.1701 18.1104 21.1701 13.3304C21.1701 8.55039 17.2801 4.65039 12.5001 4.65039ZM13.2501 13.0004C13.2501 13.4104 12.9101 13.7504 12.5001 13.7504C12.0901 13.7504 11.7501 13.4104 11.7501 13.0004V8.00039C11.7501 7.59039 12.0901 7.25039 12.5001 7.25039C12.9101 7.25039 13.2501 7.59039 13.2501 8.00039V13.0004Z" fill="#777778"/>
                                                            <Path d="M15.3896 3.45H9.60965C9.20965 3.45 8.88965 3.13 8.88965 2.73C8.88965 2.33 9.20965 2 9.60965 2H15.3896C15.7896 2 16.1096 2.32 16.1096 2.72C16.1096 3.12 15.7896 3.45 15.3896 3.45Z" fill="#777778"/>
                                                        </Svg>
                                                        <Text style={{ fontSize: 14, color: '#222', marginTop: 2, fontWeight: '500' }}>Increase 10 sec</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ marginTop: 24, alignItems: 'center', width: '100%' }}>
                                                    <TouchableOpacity onPress={() => setTimerRunning(running => !running)} style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                        {timerRunning ? (
                                                            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                                                                <Rect x="5" y="4" width="4" height="16" rx="2" fill="#FF6936" />
                                                                <Rect x="15" y="4" width="4" height="16" rx="2" fill="#FF6936" />
                                                            </Svg>
                                                        ) : (
                                                            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                                                                <Path d="M8 5V19L19 12L8 5Z" fill="#FF6936" />
                                                            </Svg>
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                    {!showTimer && (
                                        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                                            <TouchableOpacity
                                                style={[styles.logSetButton, { width: '100%' }]} 
                                                onPress={() => {
                                                    if (!completedSets[currentSetIdx]) {
                                                        setShowTimer(true);
                                                        setTimerRunning(true);
                                                        setTimerSeconds(15);
                                                    }
                                                }}
                                                disabled={completedSets.every(Boolean)}
                                            >
                                                <Text style={styles.logSetButtonText}>{completedSets.every(Boolean) ? 'All Sets Completed' : 'Log Set'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </>
                            }
                            {completedSets.every(Boolean) && 
                                <>
                                    <Text style={{ fontWeight: '700', fontSize: 22, textAlign: 'center', marginBottom: 18 }}>Finish and log your workout?</Text>
                                    <View style={{ backgroundColor: '#f6f6f6', borderRadius: 18, padding: 18, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
                                        <View style={{ alignItems: 'center', flex: 1 }}>
                                            <Text style={{ color: '#9ca3af', fontWeight: '500', fontSize: 13 }}>DURATION</Text>
                                            <Text style={{ fontWeight: '700', fontSize: 20, marginTop: 2 }}>15:22</Text>
                                        </View>
                                        <View style={{ alignItems: 'center', flex: 1 }}>
                                            <Text style={{ color: '#9ca3af', fontWeight: '500', fontSize: 13 }}>EXERCISE</Text>
                                            <Text style={{ fontWeight: '700', fontSize: 20, marginTop: 2 }}>2</Text>
                                        </View>
                                        <View style={{ alignItems: 'center', flex: 1 }}>
                                            <Text style={{ color: '#9ca3af', fontWeight: '500', fontSize: 13 }}>VOLUME</Text>
                                            <Text style={{ fontWeight: '700', fontSize: 20, marginTop: 2 }}>650lbs</Text>
                                        </View>
                                        <View style={{ alignItems: 'center', flex: 1 }}>
                                            <Text style={{ color: '#9ca3af', fontWeight: '500', fontSize: 13 }}>CALORIES</Text>
                                            <Text style={{ fontWeight: '700', fontSize: 20, marginTop: 2 }}>65kcal</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 18 }}>
                                        <TouchableOpacity
                                            style={{ flex: 1, borderWidth: 2, borderColor: '#ff6936', borderRadius: 32, paddingVertical: 18, alignItems: 'center', backgroundColor: '#fff' }}
                                            onPress={closeModal}
                                        >
                                            <Text style={{ color: '#ff6936', fontWeight: '600', fontSize: 18 }}>Resume</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ flex: 1, backgroundColor: '#ff6936', borderRadius: 32, paddingVertical: 18, alignItems: 'center' }}
                                            onPress={() => {
                                                // TODO: Implement log workout functionality
                                                closeModal();
                                            }}
                                        >
                                            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 18 }}>Log Workout</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            }
                        </Animated.View>
                    </Animated.View>
                </Modal>
            </ScrollView>
        </View>
    );
};

const pad = (num: number) => {
    return num < 10 ? `0${num}` : `${num}`;
}



const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const styles = StyleSheet.create({
    setRowModalCurrent: {
        borderLeftWidth: 4,
        borderLeftColor: '#222',
        marginLeft: -16,
        paddingLeft: 12,
        backgroundColor: 'transparent',
    },
    setRepsInactive: {
        color: '#D1D1D1',
        fontWeight: 'bold',
        fontSize: 24,
    },
    setWeightInactive: {
        color: '#D1D1D1',
        fontWeight: 'bold',
        fontSize: 24,
    },
    setLabelInactive: {
        color: '#D1D1D1',
        fontSize: 12,
        marginTop: 2,
        fontWeight: '500',
    },
    setDividerInactive: {
        color: '#E5E5E5',
        fontSize: 24,
        marginHorizontal: 12,
        fontWeight: '300',
    },
    restTextInactive: {
        color: '#E5E5E5',
        fontSize: 13,
        marginLeft: 2,
        marginBottom: 8,
        marginTop: 2,
        fontWeight: '500',
    },
    setLabelCurrent: {
        color: '#222',
        fontSize: 12,
        marginTop: 2,
        fontWeight: 'bold',
    },
    setDividerCurrent: {
        color: '#222',
        fontSize: 24,
        marginHorizontal: 12,
        fontWeight: 'bold',
    },
    setsContainerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 18,
        paddingHorizontal: 4,
    },
    timelineCol: {
        width: 40,
        alignItems: 'center',
        position: 'relative',
        paddingTop: 8,
    },
    timelineLine: {
        width: 2,
        height: 32,
        backgroundColor: '#E5E5E5',
    },
    timelineCircleActive: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FF6936',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 4,
        shadowRadius: 4,
        elevation: 4,
    },
    timelineCheck: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    timelineCircleCurrent: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#222',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 4,
        shadowRadius: 3,
        elevation: 3,
    },
    timelineCurrentText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    timelineCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F5F5F5',
        borderWidth: 2,
        borderColor: '#E5E5E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 4,
    },
    timelineCircleText: {
        color: '#999',
        fontWeight: '600',
        fontSize: 16,
    },
    timelineAddSetRow: {
        marginTop: 8,
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timelineAddSetPlus: {
        color: '#FF6936',
        fontSize: 24,
        fontWeight: 'bold',
    },
    setsCol: {
        flex: 1,
        marginLeft: 16,
        paddingTop: 4,
    },
    setRowModal: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        paddingVertical: 2,
    },
    setDetailsModal: {
        alignItems: 'flex-start',
        minWidth: 65,
    },
    restTextModal: {
        color: '#999',
        fontSize: 12,
        marginLeft: 2,
        marginBottom: 8,
        marginTop: 2,
        fontWeight: '500',
    },
    addSetRowModal: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        paddingVertical: 4,
        gap: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.18)',
        justifyContent: 'flex-end',
    },
    workoutModal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        minHeight: SCREEN_HEIGHT * 0.6,
        maxHeight: SCREEN_HEIGHT * 0.6,
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
    },
    modalHandle: {
        width: 48,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#E5E5E5',
        alignSelf: 'center',
        marginBottom: 16,
    },
    modalWorkoutName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 4,
    },
    modalWorkoutSub: {
        fontSize: 15,
        color: '#666',
        marginBottom: 18,
    },
    setsContainer: {
        marginBottom: 18,
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    setCircleActive: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FF6936',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    setCircleCheck: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    setCircleCurrent: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#FF6936',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    setCircleCurrentText: {
        color: '#FF6936',
        fontWeight: 'bold',
        fontSize: 16,
    },
    setCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E5E5E5',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    setCircleText: {
        color: '#B0B0B0',
        fontWeight: 'bold',
        fontSize: 16,
    },
    setDetails: {
        alignItems: 'center',
        minWidth: 48,
    },
    setRepsActive: {
        color: '#FF6936',
        fontWeight: 'bold',
        fontSize: 24,
    },
    setRepsCurrent: {
        color: '#222',
        fontWeight: 'bold',
        fontSize: 24,
    },
    setReps: {
        color: '#B0B0B0',
        fontWeight: '600',
        fontSize: 24,
    },
    setWeightActive: {
        color: '#FF6936',
        fontWeight: 'bold',
        fontSize: 24,
    },
    setWeightCurrent: {
        color: '#222',
        fontWeight: 'bold',
        fontSize: 24,
    },
    setWeight: {
        color: '#B0B0B0',
        fontWeight: '600',
        fontSize: 24,
    },
    setLabel: {
        color: '#999',
        fontSize: 12,
        marginTop: 2,
        fontWeight: '500',
    },
    setDivider: {
        color: '#CCC',
        fontSize: 24,
        marginHorizontal: 12,
        fontWeight: '300',
    },
    restText: {
        color: '#B0B0B0',
        fontSize: 13,
        marginLeft: 44,
        marginBottom: 2,
    },
    addSetRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginLeft: 8,
    },
    addSetPlus: {
        color: '#FF6936',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    addSetText: {
        color: '#FF6936',
        fontSize: 15,
        fontWeight: '600',
    },
    logSetButton: {
        backgroundColor: '#FF6936',
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 12,
    },
    logSetButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    container: {
        flex: 1,
        backgroundColor: '#F7F7FA',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    backButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    roundedBackButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    roundedBackButtonText: {
        color: '#222',
        fontWeight: 'bold',
        fontSize: 22,
        lineHeight: 24,
        letterSpacing: -2,
        opacity: 0.7,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    calendarSection: {
        marginBottom: 20,
    },
    monthHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        gap: 16,
    },
    monthArrowButton: {
        padding: 0,
    },
    roundedMonthArrow: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFF0E5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    monthArrowText: {
        color: '#FF6936',
        fontWeight: 'bold',
        fontSize: 18,
        lineHeight: 20,
        letterSpacing: -2,
        opacity: 0.7,
    },
    monthText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginHorizontal: 16,
    },
    dayButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        marginHorizontal: 2,
    },
    selectedDay: {
        backgroundColor: '#FF6936',
        borderColor: '#FF6936',
    },
    dayLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
        textAlign: 'center',
    },
    selectedDayLabel: {
        color: '#fff',
    },
    dayText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
        marginTop: 2,
    },
    selectedDayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    addPastWorkoutButton: {
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 25,
        borderWidth: 2,
        borderColor: '#FF6936',
    },
    addPastWorkoutText: {
        color: '#FF6936',
        fontWeight: 'bold',
        fontSize: 16,
    },
    edgeDayUnselected: {
        opacity: 0.4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    workoutTypeCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: '#E5E5E5',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },

    workoutTypeCardSelected: {
        borderColor: '#FF6936',
    },
    workoutTypeLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    workoutIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    workoutIconText: {
        color: '#FF6936',
        fontWeight: 'bold',
        fontSize: 18,
    },
    workoutInfo: {
        flex: 1,
    },
    workoutName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
        marginBottom: 4,
    },
    workoutDetails: {
        fontSize: 14,
        color: '#666',
    },
    workoutTypeRight: {
        alignItems: 'flex-end',
    },
    caloriesText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF6936',
        textAlign: 'right',
    },
    additionalCalories: {
        fontSize: 14,
        color: '#FF6936',
        textAlign: 'right',
    },
    additionalCaloriesMuted: {
        fontSize: 14,
        color: '#B0B0B0',
        textAlign: 'right',
        marginTop: 2,
    },
    createCustomButton: {
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#FF6936',
    },
    createCustomText: {
        color: '#FF6936',
        fontWeight: 'bold',
        fontSize: 16,
    },
    startWorkoutButton: {
        backgroundColor: '#FF6936',
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 32,
    },
    startWorkoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default WorkoutLog;
