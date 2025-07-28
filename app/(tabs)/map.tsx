import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MapScreen() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} style={styles.container}>
      <LinearGradient
        colors={['#FF6936', '#FF8A65']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>🗺️</Text>
          <Text style={styles.headerTitle}>Gym Map</Text>
          <Text style={styles.headerSubtitle}>Find gyms and connect with the community</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.comingSoonCard}>
          <Text style={styles.comingSoonIcon}>🚀</Text>
          <Text style={styles.comingSoonTitle}>Coming Soon!</Text>
          <Text style={styles.comingSoonDescription}>
            We're building an amazing gym discovery experience. The map will help you:
          </Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🗺️</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Interactive Map</Text>
                <Text style={styles.featureDesc}>Explore gyms in your area with smooth navigation</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📍</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Gym Pins</Text>
                <Text style={styles.featureDesc}>Custom-styled pins showing gym locations</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔍</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Smart Search</Text>
                <Text style={styles.featureDesc}>Search for gyms or addresses quickly</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>👥</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Community Insights</Text>
                <Text style={styles.featureDesc}>See how many GymBuddy members train at each location</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💪</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Gym Management</Text>
                <Text style={styles.featureDesc}>Set your home gym or add multiple gyms to your list</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⏰</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Hours & Info</Text>
                <Text style={styles.featureDesc}>View operating hours and gym details</Text>
              </View>
            </View>
          </View>

          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Preview: Gym Card</Text>
            <View style={styles.previewContent}>
              <View style={styles.previewGymInfo}>
                <Text style={styles.previewGymName}>LA Fitness - Downtown</Text>
                <Text style={styles.previewGymAddress}>123 Main St, Downtown, CA</Text>
                <Text style={styles.previewGymHours}>Open: 5:00 AM - 11:00 PM</Text>
                <Text style={styles.previewCommunity}>15 Members from GymBuddy train here</Text>
              </View>
              <View style={styles.previewButton}>
                <Text style={styles.previewButtonText}>Set as My Home Gym</Text>
              </View>
            </View>
          </View>

          <View style={styles.notificationCard}>
            <Text style={styles.notificationIcon}>🔔</Text>
            <Text style={styles.notificationText}>
              Get notified when this feature launches!
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  comingSoonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  comingSoonIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  comingSoonDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresList: {
    gap: 20,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureIcon: {
    fontSize: 24,
    width: 40,
    textAlign: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  previewCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  previewContent: {
    gap: 16,
  },
  previewGymInfo: {
    gap: 8,
  },
  previewGymName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  previewGymAddress: {
    fontSize: 14,
    color: '#6B7280',
  },
  previewGymHours: {
    fontSize: 14,
    color: '#6B7280',
  },
  previewCommunity: {
    fontSize: 14,
    color: '#FF6936',
    fontWeight: '600',
    marginTop: 4,
  },
  previewButton: {
    backgroundColor: '#FF6936',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  previewButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  notificationCard: {
    backgroundColor: '#FFF0E5',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#FF6936',
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationText: {
    fontSize: 14,
    color: '#FF6936',
    fontWeight: '500',
    flex: 1,
  },
});