import { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export type CustomWorkoutSheetProps = {
    onClose: () => void;
    onSave: (workout: CustomWorkout) => void;
    onEdit?: (workout: any) => void;
    editingWorkout?: any;
};
// Type for a custom workout
export interface CustomWorkout {
    id?: string;
    name: string;
    icon?: string;
    exercises: Array<{
        id: string;
        name: string;
        sets: Array<{ reps: number; weight: number; actualReps?: number; actualWeight?: number }>;
    }>;
}

const EXERCISE_LIBRARY: string[] = [
    'Bench Press', 'Squat', 'Deadlift', 'Pull-up', 'Push-up', 'Chest Fly', 'Barbell Row', 'Overhead Press', 'Lateral Raise', 'Bicep Curl', 'Tricep Extension', 'Leg Press', 'Calf Raise', 'Crunch', 'Plank', 'Russian Twist', 'Burpee', 'Mountain Climber', 'Jump Rope', 'Dumbbell Lunge'
];

export default function CustomWorkoutSheet({ onClose, onSave, onEdit, editingWorkout }: CustomWorkoutSheetProps) {
    const [step, setStep] = useState(1); // Start at step 1, useEffect will handle editing
    const [workoutName, setWorkoutName] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('💪');
    const [exercises, setExercises] = useState<any[]>([]);
    const [exerciseSearch, setExerciseSearch] = useState('');
    const [selectedExercise, setSelectedExercise] = useState('');
    const [setsForExercise, setSetsForExercise] = useState(3);
    const [repsForSet, setRepsForSet] = useState(10);
    const [weightForSet, setWeightForSet] = useState(0);
    const [customSets, setCustomSets] = useState<Array<{ reps: number; weight: number }>>([]);
    const [showCustomSets, setShowCustomSets] = useState(false);

    // Reset form when editingWorkout changes (for new workouts)
    useEffect(() => {
        console.log('useEffect triggered with editingWorkout:', editingWorkout);
        if (editingWorkout) {
            // When editing, populate the form with existing data
            console.log('Populating form with workout data:', editingWorkout);
            setWorkoutName(editingWorkout.name || '');
            setSelectedEmoji(editingWorkout.icon || '💪');
            setExercises(editingWorkout.exercises || []);
            setStep(3); // Go directly to edit mode
        } else {
            // When creating new, reset the form
            console.log('Resetting form for new workout');
            setWorkoutName('');
            setSelectedEmoji('💪');
            setExercises([]);
            setStep(1);
        }
    }, [editingWorkout]);

    console.log('editingWorkout prop:', editingWorkout);
    console.log('Current state - workoutName:', workoutName, 'exercises:', exercises.length);

    // Popular workout emojis
    const workoutEmojis = [
        '💪', '🏋️', '🔥', '⚡', '💯', '🎯', '🚀', '💎', '⭐', '🌟',
        '🏃', '🚴', '🏊', '🧘', '🤸', '🏆', '🥇', '💪🏽', '💪🏾', '💪🏿',
        '🏋️‍♂️', '🏋️‍♀️', '🤼', '🥊', '🥋', '🎽', '👟', '🏅', '🎖️', '🏵️'
    ];

    // Initialize custom sets when setsForExercise changes
    useEffect(() => {
        if (setsForExercise > 0) {
            setCustomSets(Array.from({ length: setsForExercise }, () => ({ reps: repsForSet, weight: weightForSet })));
        }
    }, [setsForExercise, repsForSet, weightForSet]);

    const updateCustomSet = (index: number, field: 'reps' | 'weight', value: number) => {
        setCustomSets(prev => prev.map((set, i) =>
            i === index ? { ...set, [field]: value } : set
        ));
    };

    // Check if we're in edit mode - more accurate detection
    const isEditMode = editingWorkout && editingWorkout.id;

    if (isEditMode && step === 3) {
        return (
            <View style={{ padding: 24, backgroundColor: '#fff' }}>
                {/* Edit Mode Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: '700' }}>Edit Workout</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={{ fontSize: 18, color: '#666' }}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Workout Icon and Name - Compact for Editing */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                        Workout Icon
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: 6,
                        marginBottom: 16
                    }}>
                        {workoutEmojis.map((emoji, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 18,
                                    backgroundColor: selectedEmoji === emoji ? '#FF6936' : '#F3F4F6',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: 2,
                                    borderColor: selectedEmoji === emoji ? '#FF6936' : 'transparent'
                                }}
                                onPress={() => setSelectedEmoji(emoji)}
                            >
                                <Text style={{ fontSize: 16 }}>{emoji}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                        Workout Name
                    </Text>
                    <TextInput
                        value={workoutName}
                        onChangeText={setWorkoutName}
                        placeholder="e.g. Push Day, Full Body, Custom..."
                        style={{
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            borderRadius: 12,
                            padding: 12,
                            fontSize: 16,
                            backgroundColor: '#F9F9F9'
                        }}
                    />
                </View>

                {/* Exercises List - Focused on Editing */}
                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
                    Exercises ({exercises.length})
                </Text>

                <FlatList
                    data={exercises}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }: { item: any; index: number }) => (
                        <View style={{ marginBottom: 16, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 16 }}>
                            {/* Exercise Header */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <Text style={{ fontWeight: '700', fontSize: 18 }}>{item.name}</Text>
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            // Add a new set to this exercise
                                            const updatedExercises = [...exercises];
                                            const newSet = {
                                                id: Date.now() + Math.random(),
                                                reps: 10,
                                                weight: 0,
                                                completed: false
                                            };
                                            updatedExercises[index].sets.push(newSet);
                                            setExercises(updatedExercises);
                                        }}
                                        style={{
                                            backgroundColor: '#FF6936',
                                            paddingHorizontal: 10,
                                            paddingVertical: 4,
                                            borderRadius: 12
                                        }}
                                    >
                                        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 11 }}>+ Set</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setExercises(prev => prev.filter((_, i) => i !== index));
                                        }}
                                        style={{ padding: 4 }}
                                    >
                                        <Text style={{ color: '#FF4444', fontWeight: '600', fontSize: 12 }}>Remove</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Sets for this exercise - Compact editing */}
                            {item.sets.map((set: any, setIdx: number) => (
                                <View key={set.id} style={{
                                    marginBottom: 6,
                                    backgroundColor: '#fff',
                                    borderRadius: 8,
                                    padding: 10,
                                    borderWidth: 1,
                                    borderColor: '#E5E7EB'
                                }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                        <Text style={{ fontWeight: '600', fontSize: 13, color: '#374151' }}>
                                            Set {setIdx + 1}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                const updatedExercises = [...exercises];
                                                updatedExercises[index].sets.splice(setIdx, 1);
                                                setExercises(updatedExercises);
                                            }}
                                            style={{ padding: 2 }}
                                        >
                                            <Text style={{ color: '#FF4444', fontWeight: '600', fontSize: 10 }}>Remove</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{ flexDirection: 'row', gap: 6 }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 11, color: '#6B7280', marginBottom: 2 }}>Reps</Text>
                                            <TextInput
                                                value={set.reps.toString()}
                                                onChangeText={(text) => {
                                                    const updatedExercises = [...exercises];
                                                    updatedExercises[index].sets[setIdx].reps = parseInt(text) || 0;
                                                    setExercises(updatedExercises);
                                                }}
                                                keyboardType="numeric"
                                                style={{
                                                    borderWidth: 1,
                                                    borderColor: '#E5E7EB',
                                                    borderRadius: 6,
                                                    padding: 6,
                                                    fontSize: 12,
                                                    backgroundColor: '#fff',
                                                    textAlign: 'center'
                                                }}
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 11, color: '#6B7280', marginBottom: 2 }}>Weight (lbs)</Text>
                                            <TextInput
                                                value={set.weight.toString()}
                                                onChangeText={(text) => {
                                                    const updatedExercises = [...exercises];
                                                    updatedExercises[index].sets[setIdx].weight = parseInt(text) || 0;
                                                    setExercises(updatedExercises);
                                                }}
                                                keyboardType="numeric"
                                                style={{
                                                    borderWidth: 1,
                                                    borderColor: '#E5E7EB',
                                                    borderRadius: 6,
                                                    padding: 6,
                                                    fontSize: 12,
                                                    backgroundColor: '#fff',
                                                    textAlign: 'center'
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                />

                {/* Add Exercise Button - Secondary Action */}
                <View style={{ marginTop: 16, marginBottom: 20 }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#F3F4F6',
                            borderRadius: 12,
                            padding: 12,
                            alignItems: 'center',
                            borderWidth: 2,
                            borderColor: '#E5E7EB',
                            borderStyle: 'dashed'
                        }}
                        onPress={() => {
                            // Always go to step 2 to add exercise
                            setSelectedExercise('');
                            setSetsForExercise(3);
                            setRepsForSet(10);
                            setWeightForSet(0);
                            setShowCustomSets(false);
                            setStep(2);
                        }}
                    >
                        <Text style={{ color: '#FF6936', fontWeight: '600', fontSize: 14 }}>+ Add New Exercise</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 11, color: '#6B7280', textAlign: 'center', marginTop: 4 }}>
                        Add new exercises to this workout
                    </Text>
                </View>

                {/* Save Changes Button */}
                <View style={{ marginTop: 24, marginBottom: 20 }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#FF6936',
                            borderRadius: 32,
                            paddingVertical: 16,
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            if (onEdit) {
                                onEdit({ ...editingWorkout, name: workoutName, icon: selectedEmoji, exercises });
                            }
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 18 }}>
                            Save Changes
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    else if (step === 1) {
        return (
            <View style={{ padding: 24, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <View style={{ flex: 1 }} />
                    <Text style={{ fontSize: 28, fontWeight: '700', textAlign: 'center', flex: 2 }}>
                        Name your workout
                    </Text>
                    <TouchableOpacity onPress={onClose} style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 18, color: '#666' }}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Workout Icon Selection */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, textAlign: 'center' }}>
                        Choose an icon for your workout
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 8,
                        paddingHorizontal: 20
                    }}>
                        {workoutEmojis.map((emoji, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    backgroundColor: selectedEmoji === emoji ? '#FF6936' : '#F3F4F6',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: 2,
                                    borderColor: selectedEmoji === emoji ? '#FF6936' : 'transparent'
                                }}
                                onPress={() => setSelectedEmoji(emoji)}
                            >
                                <Text style={{ fontSize: 24 }}>{emoji}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Workout Name Input */}
                <View style={{ marginBottom: 32 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                        Workout Name
                    </Text>
                    <TextInput
                        value={workoutName}
                        onChangeText={setWorkoutName}
                        placeholder="e.g. Push Day, Full Body, Custom..."
                        style={{
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 18,
                            backgroundColor: '#F9F9F9'
                        }}
                    />
                </View>

                <View style={{ marginBottom: 20 }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#FF6936',
                            borderRadius: 32,
                            paddingVertical: 18,
                            alignItems: 'center',
                            opacity: !workoutName.trim() ? 0.5 : 1
                        }}
                        onPress={() => setStep(2)}
                        disabled={!workoutName.trim()}
                    >
                        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 18 }}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    else if (step === 2) {
        const filteredExercises = EXERCISE_LIBRARY.filter((e: string) => e.toLowerCase().includes(exerciseSearch.toLowerCase()));
        const isEditMode = editingWorkout && editingWorkout.id;

        return (
            <View style={{ padding: 24, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <TouchableOpacity onPress={() => isEditMode ? setStep(3) : setStep(1)}>
                        <Text style={{ color: '#FF6936', fontSize: 16 }}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 24, fontWeight: '700' }}>
                        {isEditMode ? 'Add Exercise to Workout' : 'Add exercises'}
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={{ fontSize: 18, color: '#666' }}>✕</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    value={exerciseSearch}
                    onChangeText={setExerciseSearch}
                    placeholder="Search or create exercise"
                    style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 12 }}
                />
                <ScrollView style={{ maxHeight: 180, marginBottom: 12 }}>
                    {filteredExercises.map((ex: string, idx: number) => (
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
                        <Text>Number of sets:</Text>
                        <TextInput
                            value={String(setsForExercise)}
                            onChangeText={v => setSetsForExercise(Number(v) || 0)}
                            keyboardType="numeric"
                            style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 8, marginBottom: 8 }}
                        />

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ flex: 1 }}>Default reps per set:</Text>
                            <TextInput
                                value={String(repsForSet)}
                                onChangeText={v => setRepsForSet(Number(v) || 0)}
                                keyboardType="numeric"
                                style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 8, width: 80 }}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ flex: 1 }}>Default weight per set (lbs):</Text>
                            <TextInput
                                value={String(weightForSet)}
                                onChangeText={v => setWeightForSet(Number(v) || 0)}
                                keyboardType="numeric"
                                style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 8, width: 80 }}
                            />
                        </View>

                        <TouchableOpacity
                            style={{ backgroundColor: '#FF6936', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center', marginBottom: 8 }}
                            onPress={() => setShowCustomSets(!showCustomSets)}
                        >
                            <Text style={{ color: '#fff', fontWeight: '600' }}>
                                {showCustomSets ? 'Hide' : 'Customize'} Individual Sets
                            </Text>
                        </TouchableOpacity>

                        {showCustomSets && (
                            <View style={{ marginBottom: 12 }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Customize Each Set:</Text>
                                {customSets.map((set, index) => (
                                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, backgroundColor: '#F9F9F9', padding: 8, borderRadius: 8 }}>
                                        <Text style={{ width: 60, fontWeight: '600' }}>Set {index + 1}:</Text>
                                        <TextInput
                                            value={String(set.reps)}
                                            onChangeText={v => updateCustomSet(index, 'reps', Number(v) || 0)}
                                            keyboardType="numeric"
                                            placeholder="Reps"
                                            style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, padding: 6, width: 60, marginRight: 8 }}
                                        />
                                        <Text style={{ marginRight: 8 }}>reps @</Text>
                                        <TextInput
                                            value={String(set.weight)}
                                            onChangeText={v => updateCustomSet(index, 'weight', Number(v) || 0)}
                                            keyboardType="numeric"
                                            placeholder="Weight"
                                            style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, padding: 6, width: 80 }}
                                        />
                                        <Text style={{ marginLeft: 4 }}>lbs</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        <TouchableOpacity
                            style={{ backgroundColor: '#FF6936', borderRadius: 24, paddingVertical: 12, alignItems: 'center', marginTop: 8 }}
                            onPress={() => {
                                const setsToUse = showCustomSets ? customSets : Array.from({ length: setsForExercise }, () => ({ reps: repsForSet, weight: weightForSet }));
                                setExercises(prev => [
                                    ...prev,
                                    {
                                        id: Date.now().toString(),
                                        name: selectedExercise,
                                        sets: setsToUse
                                    }
                                ]);
                                setSelectedExercise('');
                                setSetsForExercise(3);
                                setRepsForSet(10);
                                setWeightForSet(0);
                                setShowCustomSets(false);
                                if (isEditMode) {
                                    setTimeout(() => {
                                        setStep(3);
                                    }, 100);
                                }
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
                                {isEditMode ? 'Add & Return to Edit' : 'Add Exercise'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
                <Text style={{ fontWeight: '700', fontSize: 16, marginTop: 12 }}>
                    {isEditMode ? 'Current exercises in this workout:' : 'Exercises in this workout:'}
                </Text>
                <FlatList
                    data={exercises}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }: { item: any; index: number }) => (
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
                        onPress={() => isEditMode ? setStep(3) : setStep(1)}
                    >
                        <Text style={{ color: '#FF6936', fontWeight: '600', fontSize: 18 }}>Back</Text>
                    </TouchableOpacity>
                    {!isEditMode && (
                        <TouchableOpacity
                            style={{ flex: 1, backgroundColor: '#FF6936', borderRadius: 32, paddingVertical: 16, alignItems: 'center' }}
                            onPress={() => setStep(3)}
                            disabled={exercises.length === 0}
                        >
                            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 18 }}>Next</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    }
    else if (step === 3) {
        return (
            <View style={{ padding: 24, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <TouchableOpacity onPress={() => setStep(2)}>
                        <Text style={{ color: '#FF6936', fontSize: 16 }}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 24, fontWeight: '700', flex: 1, textAlign: 'center' }}>
                        Review your workout
                    </Text>
                    <TouchableOpacity onPress={onClose} style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 18, color: '#666' }}>✕</Text>
                    </TouchableOpacity>
                </View>

                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
                    {workoutName}
                </Text>

                <FlatList
                    data={exercises}
                    keyExtractor={item => item.id}
                    renderItem={({ item }: { item: any }) => (
                        <View style={{ marginBottom: 12, backgroundColor: '#F3F4F6', borderRadius: 8, padding: 10 }}>
                            <Text style={{ fontWeight: '700', fontSize: 16 }}>{item.name}</Text>
                            {item.sets.map((set: any, idx: number) => (
                                <Text key={idx} style={{ marginLeft: 8, color: '#6B7280' }}>
                                    Set {idx + 1}: {set.reps} reps @ {set.weight} lbs
                                </Text>
                            ))}
                        </View>
                    )}
                />

                <View style={{ flexDirection: 'row', marginTop: 24, marginBottom: 20, gap: 12 }}>
                    <TouchableOpacity
                        style={{ flex: 1, borderWidth: 2, borderColor: '#FF6936', borderRadius: 32, paddingVertical: 16, alignItems: 'center', backgroundColor: '#fff' }}
                        onPress={() => setStep(2)}
                    >
                        <Text style={{ color: '#FF6936', fontWeight: '600', fontSize: 18 }}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: '#FF6936', borderRadius: 32, paddingVertical: 16, alignItems: 'center' }}
                        onPress={() => {
                            // Generate a unique ID for new workouts
                            const workoutToSave = {
                                id: Date.now().toString(),
                                name: workoutName,
                                icon: selectedEmoji,
                                exercises: exercises
                            };
                            onSave(workoutToSave);
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 18 }}>
                            Save Workout
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    return null;
}