import CustomWorkoutSheet, { CustomWorkout } from '@/components/CreateCustomWorkout';
import { deleteCustomWorkout, loadCustomWorkouts, saveCustomWorkouts } from '@/utils/local-storage';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Easing, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
// @ts-ignore

const WorkoutLog = () => {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    // hooks
    const sheetRef = useRef<BottomSheet>(null);
    const customSheetRef = useRef<BottomSheet>(null);
    const calendarScrollRef = useRef<ScrollView>(null);
    const snapPoints = useMemo(() => ["25%", "50%", "75%", "90%"], []);
    const customSnapPoints = useMemo(() => ["90%"], []);
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const popupAnim = useRef(new Animated.Value(0)).current;
    const popupScale = useRef(new Animated.Value(0.5)).current;

    // State for motivational popup
    const [showMotivationPopup, setShowMotivationPopup] = useState(false);
    const [motivationMessage, setMotivationMessage] = useState('');
    const [nextExercise, setNextExercise] = useState<any>(null);

    // State for actual input modal
    const [showActualModal, setShowActualModal] = useState(false);
    const [pendingSet, setPendingSet] = useState<{ setId: number; exerciseId: number; workoutId: number; targetReps: number; targetWeight: number } | null>(null);
    const [actualReps, setActualReps] = useState(0);
    const [actualWeight, setActualWeight] = useState(0);

    // State for editing workouts
    const [editingWorkout, setEditingWorkout] = useState<any>(null);

    // State for incomplete workout popup
    const [showIncompletePopup, setShowIncompletePopup] = useState(false);
    const incompletePopupAnim = useRef(new Animated.Value(0)).current;
    const incompletePopupScale = useRef(new Animated.Value(0.5)).current;

    const motivationalMessages = [
        "Great job! 💪 Keep pushing!",
        "You're crushing it! 🔥",
        "Amazing work! Keep going! 🚀",
        "You're on fire! 🔥",
        "Incredible progress! 💯",
        "You're unstoppable! ⚡",
        "Fantastic effort! 🌟",
        "You're doing amazing! 🎯"
    ];

    // Animation functions
    const animateIn = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const animateOut = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 50,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const showMotivationPopupAnimation = () => {
        setShowMotivationPopup(true);
        Animated.parallel([
            Animated.timing(popupAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(popupScale, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const hideMotivationPopupAnimation = () => {
        Animated.parallel([
            Animated.timing(popupAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(popupScale, {
                toValue: 0.5,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShowMotivationPopup(false);
            if (nextExercise) {
                handleExerciseSelect(nextExercise.id);
                setNextExercise(null);
            }
        });
    };

    const showIncompleteWorkoutPopup = () => {
        setShowIncompletePopup(true);
        Animated.parallel([
            Animated.timing(incompletePopupAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(incompletePopupScale, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const hideIncompleteWorkoutPopup = () => {
        Animated.parallel([
            Animated.timing(incompletePopupAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(incompletePopupScale, {
                toValue: 0.5,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShowIncompletePopup(false);
        });
    };

    // callbacks
    const handleSnapPress = useCallback((index: number) => {
        sheetRef.current?.snapToIndex(index);
    }, []);
    const handleCustomWorkoutSnapPress = useCallback((index: number) => {
        customSheetRef.current?.snapToIndex(index);
    }, []);
    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
    }, []);

    // Load custom workouts from storage on component mount
    useEffect(() => {
        const loadWorkouts = () => {
            const customWorkouts = loadCustomWorkouts();
            if (customWorkouts.length > 0) {
                // Convert stored custom workouts to the workoutTypes format
                const convertedWorkouts = customWorkouts.map((workout: any, index: number) => ({
                    id: workout.id || Date.now() + index,
                    name: workout.name,
                    icon: workout.icon || '✨',
                    exercises: workout.exercises.map((ex: any, exIdx: number) => ({
                        id: ex.id || exIdx + 1000,
                        name: ex.name,
                        sets: ex.sets.map((set: any, setIdx: number) => ({
                            id: set.id || setIdx + 1,
                            reps: set.reps,
                            weight: set.weight,
                            completed: false,
                            actualReps: set.actualReps,
                            actualWeight: set.actualWeight
                        }))
                    }))
                }));

                setWorkoutTypes(prev => {
                    // Filter out any existing custom workouts and add the loaded ones
                    const defaultWorkouts = prev.filter(w => w.id <= 10); // Assuming default workouts have IDs 1-10
                    return [...defaultWorkouts, ...convertedWorkouts];
                });
            }
        };

        loadWorkouts();
    }, []);

    // Monitor editingWorkout changes
    useEffect(() => {
        console.log('editingWorkout state changed to:', editingWorkout);
    }, [editingWorkout]);

    // Move workoutTypes into state
    const [workoutTypes, setWorkoutTypes] = useState<Array<{
        id: number;
        name: string;
        icon: string;
        exercises: Array<{
            id: number;
            name: string;
            sets: Array<{ id: number; reps: number; weight: number; completed: boolean; actualReps?: number; actualWeight?: number }>;
        }>;
    }>>([
        {
            id: 1,
            name: 'Chest Day',
            icon: '💪',
            exercises: [
                {
                    id: 1,
                    name: 'Bench Press',
                    sets: [
                        { id: 1, reps: 10, weight: 135, completed: false },
                        { id: 2, reps: 10, weight: 135, completed: false },
                        { id: 3, reps: 8, weight: 145, completed: false },
                    ]
                },
                {
                    id: 2,
                    name: 'Chest Fly',
                    sets: [
                        { id: 1, reps: 12, weight: 25, completed: false },
                        { id: 2, reps: 12, weight: 25, completed: false },
                        { id: 3, reps: 10, weight: 30, completed: false },
                    ]
                },
                {
                    id: 3,
                    name: 'Incline Dumbbell Press',
                    sets: [
                        { id: 1, reps: 10, weight: 45, completed: false },
                        { id: 2, reps: 10, weight: 45, completed: false },
                        { id: 3, reps: 8, weight: 50, completed: false },
                    ]
                }
            ]
        },
        {
            id: 2,
            name: 'Back Day',
            icon: '🏋️',
            exercises: [
                {
                    id: 1,
                    name: 'Pull-ups',
                    sets: [
                        { id: 1, reps: 8, weight: 0, completed: false },
                        { id: 2, reps: 8, weight: 0, completed: false },
                        { id: 3, reps: 6, weight: 0, completed: false },
                    ]
                },
                {
                    id: 2,
                    name: 'Barbell Rows',
                    sets: [
                        { id: 1, reps: 10, weight: 95, completed: false },
                        { id: 2, reps: 10, weight: 95, completed: false },
                        { id: 3, reps: 8, weight: 105, completed: false },
                    ]
                }
            ]
        }
    ]);

    const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);
    const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);
    const [currentSetIdx, setCurrentSetIdx] = useState(0);
    const [showTimer, setShowTimer] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);

    const selectedWorkout = workoutTypes.find(workout => workout.id === selectedWorkoutId);
    const selectedExercise = selectedWorkout?.exercises.find(exercise => exercise.id === selectedExerciseId);
    const completedSets = selectedExercise?.sets.map(set => set.completed) || [];

    const handleWorkoutSelect = (workoutId: number) => {
        animateOut();
        setTimeout(() => {
            setSelectedWorkoutId(workoutId);
            setSelectedExerciseId(null);
            setCurrentSetIdx(0);
            setShowTimer(false);
            setTimerSeconds(0);
            sheetRef.current?.snapToIndex(2);
            setTimeout(() => {
                animateIn();
            }, 100);
        }, 200);
    };

    const handleExerciseSelect = (exerciseId: number) => {
        animateOut();
        setTimeout(() => {
            setSelectedExerciseId(exerciseId);
            setCurrentSetIdx(0);
            setShowTimer(false);
            setTimerSeconds(0);
            setTimeout(() => {
                animateIn();
            }, 100);
        }, 200);
    };

    // Update handleSetComplete to open modal
    const handleSetComplete = (setId: number) => {
        if (selectedWorkoutId !== null && selectedExerciseId !== null) {
            const selectedWorkout = workoutTypes.find(w => w.id === selectedWorkoutId);
            const selectedExercise = selectedWorkout?.exercises.find(e => e.id === selectedExerciseId);
            if (selectedExercise) {
                const set = selectedExercise.sets.find(s => s.id === setId);
                if (set) {
                    setPendingSet({
                        setId,
                        exerciseId: selectedExerciseId,
                        workoutId: selectedWorkoutId,
                        targetReps: set.reps,
                        targetWeight: set.weight
                    });
                    setActualReps(set.reps);
                    setActualWeight(set.weight);
                    setShowActualModal(true);
                }
            }
        }
    };
    // Confirm actual input and update set
    const handleConfirmActual = () => {
        if (pendingSet) {
            setWorkoutTypes(prevWorkouts => prevWorkouts.map(workout => {
                if (workout.id !== pendingSet.workoutId) return workout;
                return {
                    ...workout,
                    exercises: workout.exercises.map(exercise => {
                        if (exercise.id !== pendingSet.exerciseId) return exercise;
                        return {
                            ...exercise,
                            sets: exercise.sets.map(set =>
                                set.id === pendingSet.setId
                                    ? { ...set, completed: true, actualReps, actualWeight }
                                    : set
                            )
                        };
                    })
                };
            }));

            // Find the next incomplete set index after updating
            const selectedWorkout = workoutTypes.find(w => w.id === pendingSet.workoutId);
            const selectedExercise = selectedWorkout?.exercises.find(e => e.id === pendingSet.exerciseId);
            if (selectedExercise) {
                const setIndex = selectedExercise.sets.findIndex(set => set.id === pendingSet.setId);
                // Simulate the next state of sets
                const updatedSets = selectedExercise.sets.map(set =>
                    set.id === pendingSet.setId ? { ...set, completed: true, actualReps, actualWeight } : set
                );
                const nextIncompleteIdx = updatedSets.findIndex(set => !set.completed);
                if (nextIncompleteIdx !== -1) {
                    setCurrentSetIdx(nextIncompleteIdx);
                    setShowTimer(true);
                    setTimerSeconds(45); // Show rest timer for next set
                } else {
                    setCurrentSetIdx(updatedSets.length - 1); // Stay at last set if all complete
                    setShowTimer(false); // No timer after last set
                }
            }
            setShowActualModal(false);
            setPendingSet(null);
        }
    };

    const handleTimerComplete = () => {
        setShowTimer(false);
        setTimerSeconds(0);
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (showTimer && timerSeconds > 0) {
            interval = setInterval(() => {
                setTimerSeconds(prev => {
                    if (prev <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [showTimer, timerSeconds, currentSetIdx]);

    // Trigger initial animation when component mounts
    useEffect(() => {
        animateIn();
    }, []);

    // Motivational popup and next-exercise logic in useEffect
    useEffect(() => {
        if (selectedWorkoutId !== null && selectedExerciseId !== null) {
            const selectedWorkout = workoutTypes.find(w => w.id === selectedWorkoutId);
            const selectedExercise = selectedWorkout?.exercises.find(e => e.id === selectedExerciseId);
            if (!selectedExercise) return;
            const allSetsCompleted = selectedExercise.sets.every(set => set.completed);
            if (allSetsCompleted) {
                // Exercise completed - show motivation popup
                const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
                setMotivationMessage(randomMessage);
                // Find next exercise in the workout
                const currentExerciseIndex = selectedWorkout?.exercises.findIndex(ex => ex.id === selectedExercise.id);
                if (typeof currentExerciseIndex !== 'number' || currentExerciseIndex === -1) return;
                const nextExerciseInWorkout = selectedWorkout?.exercises[currentExerciseIndex + 1];
                if (nextExerciseInWorkout) {
                    setNextExercise(nextExerciseInWorkout);
                    showMotivationPopupAnimation();
                } else {
                    // Workout completed
                    setMotivationMessage("🎉 Workout Complete! Amazing job!");
                    setNextExercise(null);
                    showMotivationPopupAnimation();
                }
            }
        }
    }, [workoutTypes, selectedWorkoutId, selectedExerciseId]);

    // Dynamically generate 7 days centered on current date (3 before, current, 3 after)
    const getCurrentWeekDays = () => {
        const days = [];
        const today = new Date();

        // Calculate 3 days before today
        for (let i = -3; i <= 3; i++) {
            const day = new Date(today);
            day.setDate(today.getDate() + i);
            days.push({
                day: day.getDate(),
                label: day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
                fullLabel: day.toLocaleDateString('en-US', { weekday: 'long' }),
                isToday: day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear(),
            });
        }
        return days;
    };
    const calendarDays = getCurrentWeekDays();

    // Set selected date to today's date on component mount and center the calendar
    useEffect(() => {
        const today = new Date();
        setSelectedDate(today.getDate());

        // Center the calendar on the current day after a short delay
        setTimeout(() => {
            // Since we now have 7 days with current day in the middle (index 3), scroll to center it
            const scrollToX = 3 * 60; // 3rd position (current day) * 60px per day button
            calendarScrollRef.current?.scrollTo({ x: scrollToX - 120, animated: true }); // Center the current day
        }, 100);
    }, []);

    const openModal = () => {
        handleSnapPress(3);
    };

    const date = new Date();
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    // Animation for modal
    const modalAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (showActualModal) {
            modalAnim.setValue(0);
            Animated.timing(modalAnim, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }).start();
        }
    }, [showActualModal]);
    // Function to save custom workout
    const saveCustomWorkout = (workout: CustomWorkout) => {
        const newWorkout = {
            id: Number(workout.id) || Date.now(), // Convert to number for state compatibility
            name: workout.name,
            icon: workout.icon || '✨',
            exercises: workout.exercises.map((ex, exIdx) => ({
                id: Number(ex.id) || (exIdx + 1000), // Convert to number
                name: ex.name,
                sets: ex.sets.map((set, setIdx) => ({
                    id: setIdx + 1, // Always generate new ID for sets
                    reps: set.reps,
                    weight: set.weight,
                    completed: false,
                    actualReps: set.actualReps,
                    actualWeight: set.actualWeight
                }))
            }))
        };

        // Add to workoutTypes state
        setWorkoutTypes(prev => [...prev, newWorkout]);

        // Save to local storage - append to existing workouts
        const existingWorkouts = loadCustomWorkouts();
        const updatedWorkouts = [...existingWorkouts, workout]; // Save original workout object
        saveCustomWorkouts(updatedWorkouts);

        setEditingWorkout(null);
        customSheetRef.current?.close();
    };
    // Function to delete custom workout
    const deleteCustomWorkoutHandler = (workoutId: number) => {
        const workout = workoutTypes.find(w => w.id === workoutId);
        Alert.alert(
            'Delete Workout',
            `Are you sure you want to delete "${workout?.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        // Remove from workoutTypes state
                        setWorkoutTypes(prev => prev.filter(w => w.id !== workoutId));
                        sheetRef.current?.close();
                        // Remove from local storage using helper function
                        deleteCustomWorkout(workoutId);
                    }
                }
            ]
        );
    };

    // Function to edit custom workout
    const editCustomWorkout = (workout: any) => {
        console.log('Setting editingWorkout to:', workout);
        setEditingWorkout(workout);
        handleCustomWorkoutSnapPress(0);
    };

    // Function to update edited workout
    const updateCustomWorkout = (updatedWorkout: any) => {
        // Update in workoutTypes state
        setWorkoutTypes(prev => prev.map(w =>
            w.id === updatedWorkout.id
                ? {
                    ...w,
                    name: updatedWorkout.name,
                    icon: updatedWorkout.icon,
                    exercises: updatedWorkout.exercises.map((ex: any, exIdx: number) => ({
                        id: Number(ex.id) || exIdx + 1000,
                        name: ex.name,
                        sets: ex.sets.map((set: any, setIdx: number) => ({
                            id: setIdx + 1,
                            reps: set.reps,
                            weight: set.weight,
                            completed: false,
                            actualReps: set.actualReps,
                            actualWeight: set.actualWeight
                        }))
                    }))
                }
                : w
        ));

        // Update in local storage
        const customWorkouts = loadCustomWorkouts();
        const updatedCustomWorkouts = customWorkouts.map((w: any) =>
            w.id === updatedWorkout.id ? updatedWorkout : w
        );
        saveCustomWorkouts(updatedCustomWorkouts);

        setEditingWorkout(null);
        customSheetRef.current?.close();
    };

    // Function to check if a workout is complete
    const isWorkoutComplete = (workout: any) => {
        return workout.exercises.every((exercise: any) =>
            exercise.sets.every((set: any) => set.completed)
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Beta Disclaimer */}
            <View style={styles.betaDisclaimer}>
                <Text style={styles.betaText}>🚧 Beta Build - Features in Development</Text>
            </View>

            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.push('./profile')}>
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
                <View style={styles.calendarSection} className='px-[24px]'>
                    <View style={styles.monthHeaderRow}>
                        <TouchableOpacity style={styles.monthArrowButton}>
                            <View style={styles.roundedMonthArrow}>
                                <Svg width={5} height={8} viewBox="0 0 5 8" fill="none">
                                    <Path d="M4 1C4 1 1 2.776 1 4C1 5.22357 4 7 4 7" stroke="#FF6936" strokeLinecap="round" strokeLinejoin="round" />
                                </Svg>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.monthText}>{monthName} {year}</Text>
                        <TouchableOpacity style={styles.monthArrowButton}>
                            <View style={styles.roundedMonthArrow}>
                                <Svg width={5} height={8} viewBox="0 0 5 8" fill="none" style={{ transform: [{ scaleX: -1 }] }}>
                                    <Path d="M4 1C4 1 1 2.776 1 4C1 5.22357 4 7 4 7" stroke="#FF6936" strokeLinecap="round" strokeLinejoin="round" />
                                </Svg>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        ref={calendarScrollRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexDirection: 'row', alignItems: 'flex-end', position: 'relative', marginBottom: 10, paddingHorizontal: 24 }}
                        style={{ marginHorizontal: -24 }}
                        onLayout={() => {
                            // Scroll to center the current day (now at index 3)
                            const scrollToX = 3 * 60; // 3rd position (current day) * 60px per day button
                            calendarScrollRef.current?.scrollTo({ x: scrollToX - 120, animated: true }); // Center the current day
                        }}
                    >
                        {calendarDays.map((item, idx) => {
                            const isEdge = idx === 0 || idx === calendarDays.length - 1;
                            const isSelected = selectedDate === item.day;
                            const isToday = item.isToday;
                            return (
                                <TouchableOpacity
                                    key={item.day}
                                    activeOpacity={0.8}
                                    onPress={() => setSelectedDate(item.day)}
                                    style={[
                                        styles.dayButton,
                                        isSelected && styles.selectedDay,
                                        isToday && !isSelected && styles.todayButton,
                                        isEdge && !isSelected && styles.edgeDayUnselected
                                    ]}
                                >
                                    <Text style={[styles.dayLabel, isSelected && styles.selectedDayLabel, isToday && !isSelected && styles.todayLabel]}>{item.label}</Text>
                                    <Text style={[styles.dayText, isSelected && styles.selectedDayText, isToday && !isSelected && styles.todayText]}>{item.day}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                <Text style={styles.sectionTitle} className='px-[24px]'>Select workout Type</Text>
                <Text style={styles.sectionSubtitle} className='px-[24px] '>Choose your workout, chase your goals.</Text>

                <View className='px-[24px]'>
                    {workoutTypes.map((workout) => {
                        const isSelected = selectedWorkoutId === workout.id;
                        const isCustomWorkout = workout.id > 10; // Custom workouts have IDs > 10
                        return (
                            <View key={workout.id} style={styles.workoutCardContainer}>
                                <TouchableOpacity
                                    style={[styles.workoutTypeCard, isSelected && styles.workoutTypeCardSelected]}
                                    activeOpacity={0.85}
                                    onPress={() => handleWorkoutSelect(workout.id)}
                                >
                                    <View style={styles.workoutTypeLeft}>
                                        <View style={[styles.workoutIcon, { backgroundColor: '#FFF0E5' }]}>
                                            <Text style={styles.workoutIconText}>{workout.icon}</Text>
                                        </View>
                                        <View style={styles.workoutInfo}>
                                            <Text style={styles.workoutName}>{workout.name}</Text>
                                            <Text style={styles.workoutDetails}>{workout.exercises.length} exercises</Text>
                                        </View>
                                    </View>
                                    <View style={styles.workoutTypeRight}>
                                        <Text style={styles.caloriesText}>{workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)} sets</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        );
                    })}
                </View>

                <View className='px-[24px] w-full flex flex-col  justify-between'>
                    <TouchableOpacity
                        style={styles.createCustomButton}
                        onPress={() => {
                            setEditingWorkout(null); // Reset to null for new workout
                            handleCustomWorkoutSnapPress(0)
                        }}
                    >
                        <Text style={styles.createCustomText}>Create Custom Workout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.startWorkoutButton,
                            !selectedWorkoutId && { backgroundColor: '#E5E5E5' }
                        ]}
                        onPress={openModal}
                        disabled={!selectedWorkoutId}
                    >
                        <Text style={[
                            styles.startWorkoutText,
                            !selectedWorkoutId && { color: '#A1A1AA' }
                        ]}>
                            Start Workout
                        </Text>
                    </TouchableOpacity>
                </View>

                <BottomSheet
                    ref={sheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enableDynamicSizing={false}
                    enablePanDownToClose
                >
                    <BottomSheetScrollView contentContainerClassName={'pb-20'} className={''}>
                        <View className='w-full px-4 bg-white/50 py-4'>
                            {/* Motivational Popup */}
                            {showMotivationPopup && (
                                <Animated.View
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0,0,0,0)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        zIndex: 1000,
                                        opacity: popupAnim,
                                    }}

                                >
                                    <Animated.View
                                        style={{
                                            transform: [{ scale: popupScale }],
                                            backgroundColor: '#FF6936',
                                            borderRadius: 20,
                                            padding: 30,
                                            margin: 20,
                                            alignItems: 'center',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.3,
                                            shadowRadius: 8,
                                            elevation: 8,
                                        }}
                                    >
                                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10 }}>
                                            {motivationMessage}
                                        </Text>
                                        {nextExercise && (
                                            <Text style={{ fontSize: 16, color: '#fff', textAlign: 'center', opacity: 0.9 }}>
                                                Next: {nextExercise.name}
                                            </Text>
                                        )}
                                        <TouchableOpacity
                                            onPress={motivationMessage != 'Workout logged! 🎉' ? hideMotivationPopupAnimation : () => {
                                                handleClosePress()
                                                setSelectedWorkoutId(null)
                                                setSelectedExerciseId(null)
                                                setCurrentSetIdx(0)
                                                setShowTimer(false)
                                                setTimerSeconds(0)
                                            }}
                                            style={{
                                                marginTop: 20,
                                                backgroundColor: '#fff',
                                                paddingHorizontal: 24,
                                                paddingVertical: 12,
                                                borderRadius: 25,
                                            }}
                                        >
                                            <Text style={{ color: '#FF6936', fontSize: 16, fontWeight: '600' }}>
                                                {nextExercise ? 'Continue' : 'Finish'}
                                            </Text>
                                        </TouchableOpacity>
                                    </Animated.View>
                                </Animated.View>
                            )}

                            {/* Incomplete Workout Popup */}
                            {showIncompletePopup && (
                                <Animated.View
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        zIndex: 1000,
                                        opacity: incompletePopupAnim,
                                    }}
                                >
                                    <Animated.View
                                        style={{
                                            transform: [{ scale: incompletePopupScale }],
                                            backgroundColor: '#fff',
                                            borderRadius: 24,
                                            padding: 32,
                                            margin: 20,
                                            alignItems: 'center',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 8 },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 16,
                                            elevation: 12,
                                            maxWidth: 320,
                                        }}
                                    >
                                        <Text style={{ fontSize: 48, marginBottom: 16 }}>🏋️‍♂️</Text>
                                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#222', textAlign: 'center', marginBottom: 8 }}>
                                            Workout Not Complete
                                        </Text>
                                        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 24, lineHeight: 22 }}>
                                            To log a workout, please press an exercise and get started! Complete all sets to log your progress.
                                        </Text>
                                        <TouchableOpacity
                                            onPress={hideIncompleteWorkoutPopup}
                                            style={{
                                                backgroundColor: '#FF6936',
                                                paddingHorizontal: 32,
                                                paddingVertical: 14,
                                                borderRadius: 28,
                                                shadowColor: '#FF6936',
                                                shadowOpacity: 0.2,
                                                shadowRadius: 8,
                                                elevation: 4,
                                            }}
                                        >
                                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                                                Got It!
                                            </Text>
                                        </TouchableOpacity>
                                    </Animated.View>
                                </Animated.View>
                            )}

                            <Animated.View
                                style={{
                                    opacity: fadeAnim,
                                    transform: [
                                        { translateY: slideAnim },
                                        { scale: scaleAnim }
                                    ]
                                }}
                            >
                                {selectedWorkout && !selectedExerciseId && (
                                    <>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    handleClosePress()
                                                    setSelectedWorkoutId(null)
                                                    setSelectedExerciseId(null)
                                                    setCurrentSetIdx(0)
                                                    setShowTimer(false)
                                                    setTimerSeconds(0)
                                                }}
                                                style={{
                                                    backgroundColor: '#FF6936',
                                                    paddingHorizontal: 18,
                                                    paddingVertical: 8,
                                                    borderRadius: 20,
                                                }}
                                                activeOpacity={0.85}
                                            >
                                                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
                                                    ← Back
                                                </Text>
                                            </TouchableOpacity>

                                            {selectedWorkout.id > 10 && (
                                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                                    <TouchableOpacity
                                                        style={[styles.deleteWorkoutButton, { backgroundColor: '#FF6936' }]}
                                                        onPress={() => editCustomWorkout(selectedWorkout)}
                                                    >
                                                        <Text style={styles.deleteWorkoutText}>✏️</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={styles.deleteWorkoutButton}
                                                        onPress={() => deleteCustomWorkoutHandler(selectedWorkout.id)}
                                                    >
                                                        <Text style={styles.deleteWorkoutText}>🗑️</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={[styles.modalWorkoutName, { width: '100%', textAlign: 'center', alignSelf: 'center', fontWeight: '700' }]}>
                                            {selectedWorkout.name}
                                        </Text>
                                        <Text style={[styles.modalWorkoutSub, { width: '100%', textAlign: 'center', alignSelf: 'center', fontWeight: '500' }]}>
                                            Select an exercise to begin
                                        </Text>
                                        <View style={{ width: '100%', alignSelf: 'center', maxWidth: 400, padding: 0 }}>
                                            {selectedWorkout.exercises.map((exercise) => {
                                                const allSetsCompleted = exercise.sets.every(set => set.completed);
                                                return (
                                                    <TouchableOpacity
                                                        key={exercise.id}
                                                        style={[
                                                            styles.workoutTypeCard,
                                                            { marginBottom: 16 },
                                                            allSetsCompleted && { opacity: 0.6, borderColor: '#10B981', borderWidth: 2, backgroundColor: '#F0FFF4' }
                                                        ]}
                                                        activeOpacity={0.85}
                                                        onPress={() => handleExerciseSelect(exercise.id)}
                                                        disabled={allSetsCompleted}
                                                    >
                                                        <View style={styles.workoutTypeLeft}>
                                                            <View style={[styles.workoutIcon, { backgroundColor: '#FFF0E5' }]}><Text style={styles.workoutIconText}>{exercise.name.charAt(0)}</Text></View>
                                                            <View style={styles.workoutInfo}>
                                                                <Text style={styles.workoutName}>{exercise.name}</Text>
                                                                <Text style={styles.workoutDetails}>{exercise.sets.length} sets</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.workoutTypeRight}>
                                                            {allSetsCompleted ? (
                                                                <Text style={{ color: '#10B981', fontWeight: '700', fontSize: 16 }}>✓ Completed</Text>
                                                            ) : (
                                                                <Text style={styles.caloriesText}>{exercise.sets.length} sets</Text>
                                                            )}
                                                        </View>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                        {/* Reset and Log Workout buttons */}
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 }}>
                                            <TouchableOpacity
                                                style={{ flex: 1, borderWidth: 2, borderColor: '#FF6936', borderRadius: 32, paddingVertical: 16, alignItems: 'center', backgroundColor: '#fff' }}
                                                onPress={() => {
                                                    // Reset all sets in this workout
                                                    setWorkoutTypes(prevWorkouts => prevWorkouts.map(w =>
                                                        w.id === selectedWorkoutId
                                                            ? { ...w, exercises: w.exercises.map(ex => ({ ...ex, sets: ex.sets.map(set => ({ ...set, completed: false })) })) }
                                                            : w
                                                    ));
                                                    setCurrentSetIdx(0);
                                                    setShowTimer(false);
                                                    setTimerSeconds(0);
                                                }}
                                            >
                                                <Text style={{ color: '#FF6936', fontWeight: '600', fontSize: 18 }}>Reset</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[
                                                    { flex: 1, borderRadius: 32, paddingVertical: 16, alignItems: 'center' },
                                                    isWorkoutComplete(selectedWorkout)
                                                        ? { backgroundColor: '#FF6936' }
                                                        : { backgroundColor: '#E5E5E5' }
                                                ]}
                                                onPress={() => {
                                                    if (isWorkoutComplete(selectedWorkout)) {
                                                        // Placeholder: log workout (show a popup or toast)
                                                        setMotivationMessage('Workout logged! 🎉');
                                                        setNextExercise(null);
                                                        showMotivationPopupAnimation();
                                                    } else {
                                                        showIncompleteWorkoutPopup();
                                                    }
                                                }}
                                            >
                                                <Text style={[
                                                    { fontWeight: '600', fontSize: 18 },
                                                    isWorkoutComplete(selectedWorkout)
                                                        ? { color: '#fff' }
                                                        : { color: '#A1A1AA' }
                                                ]}>
                                                    Log Workout
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                                {selectedExercise && (
                                    <>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                            <TouchableOpacity
                                                onPress={() => setSelectedExerciseId(null)}
                                                style={{ marginRight: 12 }}
                                            >
                                                <Text style={{ color: '#FF6936', fontSize: 16 }}>← Back</Text>
                                            </TouchableOpacity>
                                            <Text style={[styles.modalWorkoutName, { textAlign: 'right', fontWeight: '700' }]}>
                                                {selectedExercise.name}
                                            </Text>
                                        </View>
                                        <View style={{ width: '100%', alignSelf: 'center', maxWidth: 400, padding: 0 }}>
                                            {selectedExercise.sets.map((set, index) => {
                                                const isCompleted = set.completed;
                                                const isCurrent = currentSetIdx === index;
                                                return (
                                                    <View
                                                        key={set.id}
                                                        style={[
                                                            styles.workoutTypeCard,
                                                            isCompleted && styles.workoutTypeCardCompleted,
                                                            isCurrent && !isCompleted && { borderColor: '#FF6936', borderWidth: 2 }
                                                        ]}
                                                    >
                                                        <View style={styles.workoutTypeLeft}>
                                                            <View style={[
                                                                styles.workoutIcon,
                                                                {
                                                                    backgroundColor: isCompleted ? '#10B981' : '#FFF0E5',
                                                                    width: 48,
                                                                    height: 48,
                                                                    borderRadius: 24
                                                                }
                                                            ]}>
                                                                {isCompleted ? (
                                                                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>✓</Text>
                                                                ) : (
                                                                    <Text style={{ color: '#FF6936', fontSize: 18, fontWeight: '600' }}>{index + 1}</Text>
                                                                )}
                                                            </View>
                                                            <View style={styles.workoutInfo}>
                                                                <Text style={[styles.workoutName, { fontSize: 20, fontWeight: '600' }]}>
                                                                    Set {index + 1}
                                                                </Text>
                                                                <Text style={styles.workoutDetails}>
                                                                    {set.reps} reps • {set.weight}lbs
                                                                </Text>
                                                                {isCompleted && (set.actualReps !== undefined || set.actualWeight !== undefined) && (
                                                                    <Text style={{ color: '#FF6936', fontSize: 14, marginTop: 2 }}>
                                                                        Actual: {set.actualReps ?? set.reps} reps @ {set.actualWeight ?? set.weight} lbs
                                                                    </Text>
                                                                )}
                                                            </View>
                                                        </View>
                                                        <View style={styles.workoutTypeRight}>
                                                            {!isCompleted && isCurrent && (
                                                                <TouchableOpacity
                                                                    style={[styles.logSetButton, { paddingHorizontal: 20, paddingVertical: 8 }]}
                                                                    onPress={() => handleSetComplete(set.id)}
                                                                >
                                                                    <Text style={styles.logSetButtonText}>Complete</Text>
                                                                </TouchableOpacity>
                                                            )}
                                                            {isCompleted && (
                                                                <Text style={[styles.caloriesText, { color: '#10B981' }]}>Completed</Text>
                                                            )}
                                                        </View>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                        {showTimer && (
                                            <View style={{ marginTop: 20, alignItems: 'center' }}>
                                                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
                                                    Rest Timer
                                                </Text>
                                                <Text style={{ fontSize: 36, fontWeight: '700', color: '#FF6936' }}>
                                                    {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                                                </Text>
                                                <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
                                                    Next set ready
                                                </Text>
                                            </View>
                                        )}
                                    </>
                                )}
                                {completedSets.every(Boolean) && selectedExercise && (
                                    <>
                                        <View style={{ alignItems: 'center', padding: 20 }}>
                                            <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 8 }}>
                                                Great job! 🎉
                                            </Text>
                                            <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center' }}>
                                                You've completed all sets for {selectedExercise.name}
                                            </Text>
                                        </View>
                                    </>
                                )}
                            </Animated.View>
                        </View>
                    </BottomSheetScrollView>
                </BottomSheet>
                {/* Custom Workout Creation Bottom Sheet */}
                <BottomSheet
                    ref={customSheetRef}
                    index={-1}
                    snapPoints={customSnapPoints}
                    enablePanDownToClose
                >
                    <BottomSheetScrollView
                        contentContainerStyle={{ paddingBottom: 200, flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <CustomWorkoutSheet
                            onClose={() => {
                                setEditingWorkout(null);
                                customSheetRef.current?.close();
                            }}
                            onSave={saveCustomWorkout}
                            onEdit={updateCustomWorkout}
                            editingWorkout={editingWorkout}
                        />
                    </BottomSheetScrollView>
                </BottomSheet>
                {/* Modal for actual input */}
                <Modal
                    visible={showActualModal}
                    transparent
                    animationType="none"
                    onRequestClose={() => setShowActualModal(false)}
                >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                        <Animated.View
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: 24,
                                padding: 28,
                                width: 340,
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.15,
                                shadowRadius: 16,
                                elevation: 8,
                                opacity: modalAnim,
                                transform: [
                                    { scale: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }
                                ]
                            }}
                        >
                            <Text style={{ fontSize: 32, marginBottom: 8 }}>🏋️‍♂️</Text>
                            <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 4 }}>Log Your Set</Text>
                            <Text style={{ fontSize: 15, color: '#6B7280', marginBottom: 16, textAlign: 'center' }}>
                                Enter the actual reps and weight you performed for this set.
                            </Text>
                            <View style={{ width: '100%', marginBottom: 12, alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, color: '#9CA3AF' }}>Target</Text>
                                <Text style={{ fontSize: 18, fontWeight: '600', color: '#FF6936' }}>{pendingSet?.targetReps} reps @ {pendingSet?.targetWeight} lbs</Text>
                            </View>
                            <View style={{ width: '100%', height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 }} />
                            <View style={{ width: '100%', marginBottom: 8 }}>
                                <Text style={{ fontSize: 16, marginBottom: 4 }}>Actual Reps</Text>
                                <TextInput
                                    value={String(actualReps)}
                                    onChangeText={v => setActualReps(Number(v))}
                                    keyboardType="numeric"
                                    style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 8 }}
                                />
                                <Text style={{ fontSize: 16, marginBottom: 4 }}>Actual Weight (lbs)</Text>
                                <TextInput
                                    value={String(actualWeight)}
                                    onChangeText={v => setActualWeight(Number(v))}
                                    keyboardType="numeric"
                                    style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 8 }}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', gap: 12, width: '100%', marginTop: 8 }}>
                                <TouchableOpacity
                                    style={{ flex: 1, borderWidth: 2, borderColor: '#FF6936', borderRadius: 32, paddingVertical: 14, alignItems: 'center', backgroundColor: '#fff' }}
                                    onPress={() => setShowActualModal(false)}
                                >
                                    <Text style={{ color: '#FF6936', fontWeight: '600', fontSize: 17 }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flex: 1, backgroundColor: '#FF6936', borderRadius: 32, paddingVertical: 14, alignItems: 'center', shadowColor: '#FF6936', shadowOpacity: 0.15, shadowRadius: 8 }}
                                    onPress={handleConfirmActual}
                                >
                                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 17 }}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
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
        paddingTop: 10,
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
    todayButton: {
        backgroundColor: '#FFE5D9',
        borderColor: '#FF6936',
        borderWidth: 1,
    },
    todayLabel: {
        color: '#FF6936',
    },
    todayText: {
        color: '#FF6936',
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
    workoutTypeCardCompleted: {
        borderColor: '#E5E5E5',
        backgroundColor: '#F5F5F5',
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
    workoutCardContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    deleteWorkoutButton: {

        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FF4444',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    deleteWorkoutText: {
        fontSize: 12,
        color: '#fff',
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


export default WorkoutLog;
