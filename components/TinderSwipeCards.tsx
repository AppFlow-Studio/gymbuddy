import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';
import { useProfileStore } from '../utils/profile-store';
import MatchModal from './MatchModal';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

// How much to offset/rotate the 2nd and 3rd cards
const CARD_OFFSET = 0;
const CARD_ROTATE_2 = '-8deg';
const CARD_ROTATE_3 = '8deg';

// How many cards to show in the stack
const STACK_SIZE = 3;

type TinderSwipeCardsProps<T> = {
    data: T[];
    renderCard: (item: T, index: number, swiping: boolean, active: boolean) => React.ReactNode;
    onSwipeLeft?: (item: T) => void;
    onSwipeRight?: (item: T) => void;
    setMatchedProfile?: (item: T) => void;
};

export function TinderSwipeCards<T>({ data, renderCard, onSwipeLeft, onSwipeRight }: TinderSwipeCardsProps<T>) {
    const [cardIndex, setCardIndex] = useState(0);
    const [swiping, setSwiping] = useState(false);
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [matchedProfile, setMatchedProfile] = useState<T | null>(null);
    const position = useRef(new Animated.ValueXY()).current;

    // Get user profile from store
    const userProfile = useProfileStore((state: any) => state.profile);

    // Watch for matchedProfile changes to show modal
    useEffect(() => {
        console.log('TinderSwipeCards - matchedProfile changed:', matchedProfile);
        if (matchedProfile) {
            console.log('TinderSwipeCards - showing match modal for:', matchedProfile);
            setShowMatchModal(true);
        }
    }, [matchedProfile]);

    // Watch for showMatchModal changes
    useEffect(() => {
        console.log('TinderSwipeCards - showMatchModal changed to:', showMatchModal);
    }, [showMatchModal]);

    // Reset matchedProfile when modal closes
    const handleCloseModal = () => {
        setShowMatchModal(false);
        setMatchedProfile(null);
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setSwiping(true);
            },
            onPanResponderMove: Animated.event(
                [null, { dx: position.x, dy: position.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (_, gesture) => {
                setSwiping(false);
                if (gesture.dx > SWIPE_THRESHOLD) {
                    forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    forceSwipe('left');
                } else {
                    resetPosition();
                }
            },
        })
    ).current;

    function forceSwipe(direction: 'left' | 'right') {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION,
            useNativeDriver: false,
        }).start(() => onSwipeComplete(direction, cardIndex));
    }

    function onSwipeComplete(direction: 'left' | 'right', cardIndex: number) {
        const currentItem = data[cardIndex]; // Get the current card that was swiped
        console.log('Swipe completed:', direction, 'Card index:', cardIndex, 'Current item:', currentItem);
        console.log('Current item details:', {
            name: (currentItem as any)?.name,
            image: (currentItem as any)?.image,
            gym: (currentItem as any)?.gym
        });

        if (direction === 'right') {
            console.log('Setting matchedProfile to:', currentItem);
            setMatchedProfile(data[cardIndex]);
            console.log('matchedProfile set, should trigger useEffect');
            onSwipeRight?.(currentItem);
        } else {
            onSwipeLeft?.(currentItem);
        }
        position.setValue({ x: 0, y: 0 });
        // Small delay to ensure position reset happens after animation
        setTimeout(() => {
            setCardIndex(prev => {
                console.log('Updating cardIndex from', prev, 'to', prev + 1);
                return prev + 1;
            });
        }, 50);
    }

    function resetPosition() {
        Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            friction: 5,
        }).start();
    }

    function getCardStyle() {
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-20deg', '0deg', '20deg'],
        });
        return {
            ...position.getLayout(),
            transform: [{ rotate }],
        };
    }

    // Check if we've run out of cards
    if (cardIndex >= data.length) {
        console.log('No more cards to show');
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 18, color: '#666', textAlign: 'center' }}>
                    No more profiles to show!
                </Text>
            </View>
        );
    }

    // Only show the top 3 cards in the stack
    const renderedCards = [];
    console.log('Current cardIndex:', cardIndex, 'Data length:', data.length);

    for (let i = cardIndex; i < Math.min(cardIndex + STACK_SIZE, data.length); i++) {
        console.log('Rendering card at index:', i, 'Profile:', data[i]);

        if (i === cardIndex) {
            // Top card: swipeable, animated
            renderedCards.push(
                <Animated.View
                    key={i}
                    style={[styles.card, getCardStyle(), { zIndex: data.length - i }]}
                    {...panResponder.panHandlers}
                >
                    {renderCard(data[i], i, swiping, true)}
                </Animated.View>
            );
        } else if (i === cardIndex + 1) {
            // Second card: rotated left, offset down
            renderedCards.push(
                <Animated.View
                    key={i}
                    style={[
                        styles.card,
                        {
                            top: CARD_OFFSET,
                            zIndex: data.length - i - 1,
                            transform: [{ rotate: CARD_ROTATE_2 }],
                            opacity: 0.9,
                        },
                    ]}
                    className={'opacity-50'}
                >
                    {renderCard(data[i], i, false, false)}
                </Animated.View>
            );
        } else if (i === cardIndex + 2) {
            // Third card: rotated right, offset down more
            renderedCards.push(
                <Animated.View
                    key={i}
                    style={[
                        styles.card,
                        {
                            top: CARD_OFFSET * 2,
                            zIndex: data.length - i - 2,
                            transform: [{ rotate: CARD_ROTATE_3 }],
                            opacity: 0.8,
                        },
                    ]}
                    className={'opacity-50'}
                >
                    {renderCard(data[i], i, false, false)}
                </Animated.View>
            );
        }
    }

    // Render in reverse so the top card is last (on top)
    return (
        <View style={styles.container} key={`cards-${cardIndex}`}>
            {renderedCards.reverse()}
            {/* <MatchModal
                key={`match-${cardIndex}`}
                visible={showMatchModal}
                onClose={handleCloseModal}
                userProfile={userProfile}
                matchedProfile={matchedProfile}
            /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
}); 