import React, { useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

type TinderSwipeCardsProps<T> = {
    data: T[];
    renderCard: (item: T, index: number) => React.ReactNode;
    onSwipeLeft?: (item: T) => void;
    onSwipeRight?: (item: T) => void;
};

export function TinderSwipeCards<T>({ data, renderCard, onSwipeLeft, onSwipeRight }: TinderSwipeCardsProps<T>) {
    const [cardIndex, setCardIndex] = useState(0);
    // const position = useRef(new Animated.ValueXY()).current;
    const position = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [null, { dx: position.x, dy: position.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (_, gesture) => {
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
        }).start(() => onSwipeComplete(direction));
    }

    function onSwipeComplete(direction: 'left' | 'right') {
        const item = data[cardIndex];
        direction === 'right' ? onSwipeRight?.(item) : onSwipeLeft?.(item);
        position.setValue({ x: 0, y: 0 });
        setCardIndex(prev => prev + 1);
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

    // Render cards in reverse order so the top card is last (on top)
    const renderedCards = data.map((item, i) => {
        if (i < cardIndex) return null;
        if (i === cardIndex) {
            return (
                <Animated.View
                    key={i}
                    style={[styles.card, getCardStyle(), { zIndex: data.length - i }]}
                    {...panResponder.panHandlers}
                >
                    {renderCard(item, i)}
                </Animated.View>
            );
        }
        // Hide upcoming cards completely
        return null;
    }).reverse();

    return <View style={styles.container}>{renderedCards}</View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        position: 'relative',
        // width: SCREEN_WIDTH - 32,
        // height: SCREEN_HEIGHT - 64,
        left: 0, // This centers the card by accounting for the 32px total width reduction
        right: 0
    },
}); 