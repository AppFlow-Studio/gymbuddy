import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const EXERCISE_LIBRARY = [
    'Bench Press', 'Squat', 'Deadlift', 'Pull-up', 'Push-up', 'Chest Fly', 'Barbell Row', 'Overhead Press', 'Lateral Raise', 'Bicep Curl', 'Tricep Extension', 'Leg Press', 'Calf Raise', 'Crunch', 'Plank', 'Russian Twist', 'Burpee', 'Mountain Climber', 'Jump Rope', 'Dumbbell Lunge'
];

export default function CreateCustomWorkout() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [workoutName, setWorkoutName] = useState('');
    const [exercises, setExercises] = useState<any[]>([]);
    const [exerciseSearch, setExerciseSearch] = useState('');
    const [selectedExercise, setSelectedExercise] = useState('');
    const [setsForExercise, setSetsForExercise] = useState(3);
    const [repsForSet, setRepsForSet] = useState(10);
    const [weightForSet, setWeightForSet] = useState(0);
    const [reviewingExerciseIdx, setReviewingExerciseIdx] = useState<number | null>(null);

    // Step 1: Name workout
    if (step === 1) {
        return (
            <View style={{ flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' }}>
                <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 24 }}>Name your workout</Text>
                <TextInput
                    value={workoutName}
                    onChangeText={setWorkoutName}
                    placeholder="e.g. Push Day, Full Body, Custom..."
                    style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, fontSize: 18, marginBottom: 32 }}
                />
                <TouchableOpacity
                    style={{ backgroundColor: '#FF6936', borderRadius: 32, paddingVertical: 18, alignItems: 'center' }}
                    onPress={() => setStep(2)}
                    disabled={!workoutName.trim()}
                >
                    <Text style={{ color: '#fff', fontWeight: '600', fontSize: 18 }}>Next</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Step 2: Add exercises
    if (step === 2) {
        const filteredExercises = EXERCISE_LIBRARY.filter(e => e.toLowerCase().includes(exerciseSearch.toLowerCase()));
        return (
            <View style={{ flex: 1, padding: 24, backgroundColor: '#fff' }}>
                <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 12 }}>Add exercises</Text>
                <TextInput
                    value={exerciseSearch}
                    onChangeText={setExerciseSearch}
                    placeholder="Search or create exercise"
                    style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12 }}
                />
                <ScrollView style={{ maxHeight: 180, marginBottom: 12 }}>
                    {filteredExercises.map((ex, idx) => (
                        <TouchableOpacity
                            key={ex + idx}
                            style={{ padding: 12, borderBottomWidth: 1, borderColor: '#F3F4F6' }}
                            onPress={() => setSelectedExercise(ex)}
                        >
                            <Text style={{ fontSize: 16 }}>{ex}</Text>
                        </TouchableOpacity>
                    ))}
                    {exerciseSearch.length > 0 && !EXERCISE_LIBRARY.includes(exerciseSearch) && (
                        <TouchableOpacity
                            style={{ padding: 12, backgroundColor: '#FFF0E5', borderRadius: 8, marginTop: 8 }}
                            onPress={() => setSelectedExercise(exerciseSearch)}
                        >
                            <Text style={{ fontSize: 16, color: '#FF6936' }}>+ Create "{exerciseSearch}"</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
                {selectedExercise ? (
                    <View style={{ marginTop: 12, marginBottom: 24 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>{selectedExercise}</Text>
                        <Text>Sets:</Text>
                        <TextInput
                            value={String(setsForExercise)}
                            onChangeText={v => setSetsForExercise(Number(v))}
                            keyboardType="numeric"
                            style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 8, marginBottom: 8 }}
                        />
                        <Text>Reps per set:</Text>
                        <TextInput
                            value={String(repsForSet)}
                            onChangeText={v => setRepsForSet(Number(v))}
                            keyboardType="numeric"
                            style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 8, marginBottom: 8 }}
                        />
                        <Text>Weight per set (lbs):</Text>
                        <TextInput
                            value={String(weightForSet)}
                            onChangeText={v => setWeightForSet(Number(v))}
                            keyboardType="numeric"
                            style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 8, marginBottom: 8 }}
                        />
                        <TouchableOpacity
                            style={{ backgroundColor: '#FF6936', borderRadius: 24, paddingVertical: 12, alignItems: 'center', marginTop: 8 }}
                            onPress={() => {
                                setExercises(prev => [
                                    ...prev,
                                    {
                                        id: uuidv4(),
                                        name: selectedExercise,
                                        sets: Array.from({ length: setsForExercise }, () => ({ reps: repsForSet, weight: weightForSet }))
                                    }
                                ]);
                                setSelectedExercise('');
                                setSetsForExercise(3);
                                setRepsForSet(10);
                                setWeightForSet(0);
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Add Exercise</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
                <Text style={{ fontWeight: '700', fontSize: 16, marginTop: 12 }}>Exercises in this workout:</Text>
                <FlatList
                    data={exercises}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6, backgroundColor: '#F3F4F6', borderRadius: 8, padding: 8 }}>
                            <Text style={{ flex: 1, fontSize: 16 }}>{item.name} ({item.sets.length} sets)</Text>
                            <TouchableOpacity onPress={() => setExercises(prev => prev.filter((_, i) => i !== index))}>
                                <Text style={{ color: '#FF6936', fontWeight: '700', fontSize: 16 }}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
                <View style={{ flexDirection: 'row', marginTop: 24, gap: 12 }}>
                    <TouchableOpacity
                        style={{ flex: 1, borderWidth: 2, borderColor: '#FF6936', borderRadius: 32, paddingVertical: 16, alignItems: 'center', backgroundColor: '#fff' }}
                        onPress={() => setStep(1)}
                    >
                        <Text style={{ color: '#FF6936', fontWeight: '600', fontSize: 18 }}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: '#FF6936', borderRadius: 32, paddingVertical: 16, alignItems: 'center' }}
                        onPress={() => setStep(3)}
                        disabled={exercises.length === 0}
                    >
                        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 18 }}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Step 3: Review & Save
    if (step === 3) {
        return (
            <View style={{ flex: 1, padding: 24, backgroundColor: '#fff' }}>
                <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 12 }}>Review your workout</Text>
                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>{workoutName}</Text>
                <FlatList
                    data={exercises}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={{ marginBottom: 12, backgroundColor: '#F3F4F6', borderRadius: 8, padding: 10 }}>
                            <Text style={{ fontWeight: '700', fontSize: 16 }}>{item.name}</Text>
                            {item.sets.map((set: any, idx: number) => (
                                <Text key={idx} style={{ marginLeft: 8, color: '#6B7280' }}>Set {idx + 1}: {set.reps} reps @ {set.weight} lbs</Text>
                            ))}
                        </View>
                    )}
                />
                <View style={{ flexDirection: 'row', marginTop: 24, gap: 12 }}>
                    <TouchableOpacity
                        style={{ flex: 1, borderWidth: 2, borderColor: '#FF6936', borderRadius: 32, paddingVertical: 16, alignItems: 'center', backgroundColor: '#fff' }}
                        onPress={() => setStep(2)}
                    >
                        <Text style={{ color: '#FF6936', fontWeight: '600', fontSize: 18 }}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: '#FF6936', borderRadius: 32, paddingVertical: 16, alignItems: 'center' }}
                        onPress={() => {
                            // Save logic here (could add to Zustand or local storage)
                            // For now, just go back
                            router.back();
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 18 }}>Save Workout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return null;
} 