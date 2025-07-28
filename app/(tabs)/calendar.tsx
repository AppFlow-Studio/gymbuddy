import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CalendarScreen() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} style={styles.container}>
      <LinearGradient
        colors={['#FF6936', '#FF8A65']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>📅</Text>
          <Text style={styles.headerTitle}>Workout Calendar</Text>
          <Text style={styles.headerSubtitle}>Track your progress, plan your gains</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.comingSoonCard}>
          <Text style={styles.comingSoonIcon}>🚀</Text>
          <Text style={styles.comingSoonTitle}>Coming Soon!</Text>
          <Text style={styles.comingSoonDescription}>
            We're building something amazing for you. The workout calendar will help you:
          </Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📊</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Track Progress</Text>
                <Text style={styles.featureDesc}>Visualize your strength gains over time</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎯</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Plan Workouts</Text>
                <Text style={styles.featureDesc}>Schedule and organize your training routine</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📈</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Set Goals</Text>
                <Text style={styles.featureDesc}>Create and track personal fitness milestones</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🤝</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Partner Sync</Text>
                <Text style={styles.featureDesc}>Coordinate workouts with your gym buddy</Text>
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
