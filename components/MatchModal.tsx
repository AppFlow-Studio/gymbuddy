import React from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MatchModal({ visible, onClose, userProfile, matchedProfile }: {
  visible: boolean;
  onClose: () => void;
  userProfile: any;
  matchedProfile: any;
}) {
  if (!matchedProfile) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.imagesRow}>
            <Image source={{ uri: userProfile.image }} style={[styles.profileImage, { transform: [{ rotate: '-12deg' }] }]} />
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🤝</Text>
            </View>
            <Image source={{ uri: matchedProfile.image }} style={[styles.profileImage, { transform: [{ rotate: '12deg' }] }]} />
          </View>
          <Text style={styles.matchTitle}>It's a match</Text>
          <Text style={styles.matchSubtitle}>You and {matchedProfile.name} are now connected</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
            <Text style={styles.primaryButtonText}>Send a Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>Keep Swiping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

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
    width: 320,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  imagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 130,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#FF6936',
    backgroundColor: '#eee',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6936',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    zIndex: 2,
  },
  iconText: {
    fontSize: 24,
    color: '#fff',
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
    width: 220,
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
    width: 220,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FF6936',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 