import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Svg, { Path, Rect } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

const Chat = () => {
  const router = useRouter()
  const [chatData, setChatData] = useState([
    {
      id: 1,
      name: 'Michael Smith',
      message: 'Hey, great workout session today for that chest and arms routine!',
      time: '10:30 AM',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: 2,
      name: 'Samantha Green',
      message: 'Sounds great! Let\'s make it happen.',
      time: '12:15 PM',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      id: 3,
      name: 'David Brown',
      message: 'I\'m so excited! Let\'s get started on this new program',
      time: '2:30 PM',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
      id: 4,
      name: 'Emily White',
      message: 'Just finished my workout. Ready to begin this project together!',
      time: '3:45 PM',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    {
      id: 5,
      name: 'James Johnson',
      message: 'Let\'s do it! I\'m ready to roll with this new training plan',
      time: '4:00 PM',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
    },
    {
      id: 6,
      name: 'Olivia Martin',
      message: 'Yes, let\'s go for it! Can\'t wait to start our workout buddy journey',
      time: '4:15 PM',
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
    },
    {
      id: 7,
      name: 'Liam Davis',
      message: 'I\'m all in! Let\'s start this workout partnership strong',
      time: '4:30 PM',
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
    },
    {
      id: 8,
      name: 'Sophia Wilson',
      message: 'Count me in. I\'m eager to start our fitness journey together',
      time: '4:45 PM',
      avatar: 'https://randomuser.me/api/portraits/women/8.jpg'
    },
    {
      id: 9,
      name: 'Noah Thompson',
      message: 'Definitely! Looking forward to this amazing workout experience',
      time: '5:00 PM',
      avatar: 'https://randomuser.me/api/portraits/men/9.jpg'
    },
    {
      id: 10,
      name: 'Ava Garcia',
      message: 'Great! Let\'s get this going and crush our fitness goals',
      time: '5:15 PM',
      avatar: 'https://randomuser.me/api/portraits/women/10.jpg'
    }
  ])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <View style={styles.roundedBackButton}>
              <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
                <Path d="M6.46964 0.469655C6.76253 0.176788 7.2373 0.176775 7.53019 0.469655C7.82305 0.762541 7.82305 1.23731 7.53019 1.5302L2.06046 6.99993L7.53019 12.4697C7.82308 12.7625 7.82308 13.2373 7.53019 13.5302C7.2373 13.8231 6.76253 13.8231 6.46964 13.5302L0.46964 7.5302C0.176803 7.23731 0.176771 6.76253 0.46964 6.46966L6.46964 0.469655Z" fill="#49494B" />
              </Svg>
            </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <ScrollView style={styles.chatList}>
        {chatData.map((chat) => (
          <TouchableOpacity 
            key={chat.id} 
            style={styles.chatItem}
            onPress={() => router.push({
              pathname: '/ChatScreen',
              params: { 
                userId: chat.id,
                userName: chat.name,
                userAvatar: chat.avatar
              }
            })}
          >
            <Image source={{ uri: chat.avatar }} style={styles.avatar} />
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={styles.name}>{chat.name}</Text>
                <Text style={styles.time}>{chat.time}</Text>
              </View>
              <Text style={styles.message} numberOfLines={1}>
                {chat.message}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingBottom: 50,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  chatList: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FF6936',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  message: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
})

export default Chat
