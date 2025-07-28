import { useProfileStore } from '@/utils/profile-store';
import React from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TiltedDumbell from './icons/TiltedDumbell';
export default function MatchModal({ visible, onClose, userProfile, matchedProfile }: {
  visible: boolean;
  onClose: () => void;
  userProfile: any;
  matchedProfile: any;
}) {
  const { profile } = useProfileStore();

  console.log('MatchModal - visible:', visible);
  console.log('MatchModal - userProfile:', userProfile);
  console.log('MatchModal - matchedProfile:', matchedProfile);
  console.log('MatchModal - store profile:', profile);

  if (!matchedProfile) {
    console.log('MatchModal - no matchedProfile, returning null');
    return null;
  }
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      key={`match-${matchedProfile?.name || 'unknown'}`}
    >
      <View style={styles.overlay}>
        <View style={styles.container} className='w-[95%] h-[70%]'>
          {/* Debug info */}
          <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>
            Debug: {matchedProfile?.name || 'No name'} - {matchedProfile?.gym || 'No gym'}
          </Text>

          {/* Overlapping Cards Row */}
          <View style={styles.cardsRow}>
            <View style={[styles.cardWrapper, { left: 0, zIndex: 2 }]}>
              <Image source={{ uri: profile?.image || '' }} style={[styles.profileCard, { transform: [{ rotate: '-10deg' }] }]} />
            </View>
            <View style={[styles.cardWrapper, { right: 0, zIndex: 2 }]}>
              <Image source={{ uri: matchedProfile.image }} style={[styles.profileCard, { transform: [{ rotate: '10deg' }] }]} />
            </View>
            {/* Dumbbell Icon Centered */}
            <View style={styles.iconCircle}>
              <TiltedDumbell />
            </View>
          </View>

          <View className='flex-1 justify-end items-center'>
            <Text style={styles.matchTitle}>It's a match</Text>
            <Text style={styles.matchSubtitle}>You and {matchedProfile?.name || 'Someone'} are now connected</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
              <Text style={styles.primaryButtonText}>Send a Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Keep Swiping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const CARD_SIZE = 160;
const CARD_OVERLAP = 48;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  cardsRow: {
    width: CARD_SIZE * 2 - CARD_OVERLAP + 44, // extra for icon
    height: CARD_SIZE + 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  cardWrapper: {
    position: 'absolute',
    top: 0,
    width: CARD_SIZE,
    height: CARD_SIZE * 1.25,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  profileCard: {
    width: CARD_SIZE,
    height: CARD_SIZE * 1.25,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#FF6936',
    backgroundColor: '#eee',
  },
  iconCircle: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -22,
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6936',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    borderWidth: 4,
    borderColor: '#fff',
  },
  matchTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  matchSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#FF6936',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 12,
    width: 260,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    borderColor: '#FF6936',
    borderWidth: 2,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: 260,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FF6936',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 