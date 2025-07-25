import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const ActiveWorkoutScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { workoutName, sets, reps } = params;

    const [currentSet, setCurrentSet] = useState(1);
    const [isResting, setIsResting] = useState(false);
    const [timer, setTimer] = useState(11);
    const [finishModalVisible, setFinishModalVisible] = useState(false);

    const handleNextSet = useCallback(() => {
        setIsResting(false);
        setCurrentSet((prevSet) => prevSet + 1);
    }, []);

    useEffect(() => {
        let interval: number | undefined;
        if (isResting && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsResting(false);
            handleNextSet();
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isResting, timer, handleNextSet]);

    const handleLogSet = () => {
        if (currentSet < Number(sets)) {
            setIsResting(true);
            setTimer(11);
        } else {
            setFinishModalVisible(true);
        }
    };

    const handleAddSet = () => {
        // Logic to add a set
    };

    const handleFinishWorkout = () => {
        setFinishModalVisible(false);
        router.back();
    };

    const renderSets = () => {
        const setIndicators = [];
        for (let i = 1; i <= Number(sets); i++) {
            setIndicators.push(
                <View key={i} style={styles.setContainer}>
                    <View style={[styles.setIndicator, i < currentSet ? styles.completedSet : {}]}>
                        {i < currentSet ? (
                            <Text style={styles.tick}>✓</Text>
                        ) : (
                            <Text style={styles.setText}>{i}</Text>
                        )}
                    </View>
                    <View style={styles.setDetails}>
                        <Text style={styles.repsText}>{reps} Reps</Text>
                        <Text style={styles.weightText}>/ 65 Pounds</Text>
                    </View>
                    {i === currentSet && (
                         <TouchableOpacity style={styles.addSetButton} onPress={handleAddSet}>
                            <Text style={styles.addSetText}>+ Add Set</Text>
                        </TouchableOpacity>
                    )}
                </View>
            );
        }
        return setIndicators;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setFinishModalVisible(true)}>
                    <Text style={styles.backButton}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{workoutName}</Text>
                <View style={{ width: 20 }}/>
            </View>

            <View style={styles.content}>
                {renderSets()}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.logSetButton} onPress={handleLogSet}>
                    <Text style={styles.logSetButtonText}>Log Set</Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isResting}
                onRequestClose={() => setIsResting(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.restModal}>
                        <Text style={styles.restTitle}>Reset</Text>
                        <TouchableOpacity style={styles.closeRestModal} onPress={() => setIsResting(false)}>
                            <Text>X</Text>
                        </TouchableOpacity>
                        <View style={styles.timerContainer}>
                            <TouchableOpacity onPress={() => setTimer(timer - 10 > 0 ? timer - 10 : 0)}>
                                <Text style={styles.timerButtonText}>-10s</Text>
                            </TouchableOpacity>
                            <Text style={styles.timerText}>{`0:${timer.toString().padStart(2, '0')}`}</Text>
                            <TouchableOpacity onPress={() => setTimer(timer + 10)}>
                                <Text style={styles.timerButtonText}>+10s</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => setTimer(0)}>
                            <Text style={styles.skipText}>||</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.nextSetButton} onPress={handleNextSet}>
                            <Text style={styles.nextSetButtonText}>Next Set</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={finishModalVisible}
                onRequestClose={() => setFinishModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.finishModal}>
                        <Text style={styles.finishTitle}>Finish and log your workout?</Text>
                        <TouchableOpacity style={styles.closeFinishModal} onPress={() => setFinishModalVisible(false)}>
                            <Text>X</Text>
                        </TouchableOpacity>
                        <View style={styles.statsContainer}>
                            <View style={styles.stat}>
                                <Text style={styles.statLabel}>DURATION</Text>
                                <Text style={styles.statValue}>15:22</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={styles.statLabel}>EXERCISE</Text>
                                <Text style={styles.statValue}>2</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={styles.statLabel}>VOLUME</Text>
                                <Text style={styles.statValue}>650lbs</Text>
                            </View>
                             <View style={styles.stat}>
                                <Text style={styles.statLabel}>CALORIES</Text>
                                <Text style={styles.statValue}>65kcal</Text>
                            </View>
                        </View>
                        <View style={styles.finishButtons}>
                            <TouchableOpacity style={styles.resumeButton} onPress={() => setFinishModalVisible(false)}>
                                <Text style={styles.resumeButtonText}>Resume</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.logWorkoutButton} onPress={handleFinishWorkout}>
                                <Text style={styles.logWorkoutButtonText}>Log Workout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7FA',
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    backButton: {
        fontSize: 24,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    setContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    setIndicator: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FF6936',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    completedSet: {
        backgroundColor: '#FF6936',
        borderColor: '#FF6936',
    },
    setText: {
        color: '#FF6936',
        fontWeight: 'bold',
    },
    tick: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
    setDetails: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    repsText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    weightText: {
        fontSize: 18,
        color: '#666',
    },
    addSetButton: {
        marginLeft: 'auto',
        padding: 10,
    },
    addSetText: {
        color: '#FF6936',
        fontWeight: 'bold',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderColor: '#E5E5E5',
    },
    logSetButton: {
        backgroundColor: '#FF6936',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
    },
    logSetButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    restModal: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
    },
    restTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeRestModal: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    timerButtonText: {
        fontSize: 18,
        color: '#FF6936',
        marginHorizontal: 20,
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    skipText: {
        color: '#FF6936',
        fontSize: 24,
    },
    nextSetButton: {
        backgroundColor: '#FF6936',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
    nextSetButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    finishModal: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    finishTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    closeFinishModal: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    stat: {
        alignItems: 'center',
    },
    statLabel: {
        color: '#666',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    finishButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    resumeButton: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#FF6936',
    },
    resumeButtonText: {
        color: '#FF6936',
        fontWeight: 'bold',
    },
    logWorkoutButton: {
        backgroundColor: '#FF6936',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        flex: 1,
        marginLeft: 10,
    },
    logWorkoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ActiveWorkoutScreen;
