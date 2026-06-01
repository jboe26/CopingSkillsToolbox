import { useState, useCallback } from 'react';
import { Text, View, ScrollView, Pressable, Modal, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { colors } from '../theme';

export default function Home() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [userName, setUserName] = useState('');
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [nameInput, setNameInput] = useState('');

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('coping-entries').then((data) => {
        if (data) setEntries(JSON.parse(data));
      });
      
      AsyncStorage.getItem('user-name').then((name) => {
        if (name) {
          setUserName(name);
        } else {
          setShowNamePrompt(true);
        }
      });
    }, [])
  );

  const saveName = async () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      await AsyncStorage.setItem('user-name', trimmed);
      setUserName(trimmed);
    }
    setShowNamePrompt(false);
    setNameInput('');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatEntryTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const recentEntries = entries.slice(0, 2);
  const last7 = entries.filter((e) => {
    const d = new Date(e.date);
    const now = new Date();
    const diffMs = now - d;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  });

  const quickAction = (label, icon, route) => (
    <Pressable
      onPress={() => router.push(route)}
      style={{
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 16,
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 28, marginBottom: 6 }}>{icon}</Text>
      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted }}>{label}</Text>
    </Pressable>
  );

  return (
    <>
      <Modal visible={showNamePrompt} transparent animationType="fade" onRequestClose={() => {}}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: colors.bg, borderRadius: 20, padding: 24, width: '100%', maxWidth: 320 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.ink, marginBottom: 8 }}>What's your name?</Text>
            <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 20 }}>So we can personalize your experience. (optional)</Text>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Enter your name"
              placeholderTextColor={colors.muted}
              autoFocus
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 12,
                fontSize: 16,
                color: colors.ink,
                marginBottom: 20,
              }}
            />
            <Pressable
              onPress={saveName}
              style={{ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 10 }}
            >
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Continue</Text>
            </Pressable>
            <Pressable 
              onPress={() => {
                setShowNamePrompt(false);
                setNameInput('');
              }}
              style={{ borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.primary }}
            >
              <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 16 }}>Skip</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingTop: 60, paddingBottom: 40 }}>
        {/* Greeting */}
        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.ink, marginBottom: 4 }}>
          {getGreeting()}{userName ? ', ' + userName : ''}
        </Text>
        <Text style={{ fontSize: 15, color: colors.muted, marginBottom: 20 }}>Here's where you left off.</Text>

        {/* Mood streak */}
        {last7.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', gap: 4, justifyContent: 'center' }}>
              {last7.map((e, i) => (
                <View
                  key={i}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: colors.card,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 14 }}>{e.mood.emoji}</Text>
                </View>
              ))}
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, color: colors.muted, marginTop: 8 }}>
              {last7.length} check-in{last7.length !== 1 ? 's' : ''} this week
            </Text>
          </View>
        )}

        {/* Quick actions */}
        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.5, marginBottom: 12, textTransform: 'uppercase' }}>
          Quick actions
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
          {quickAction('Check in', '✏️', 'checkin')}
          {quickAction('Skills', '🧰', 'toolbox')}
        </View>

        {/* Recent check-ins */}
        {recentEntries.length > 0 && (
          <>
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.5, marginBottom: 12, textTransform: 'uppercase' }}>
              Recent
            </Text>
            {recentEntries.map((e) => (
              <View
                key={e.id}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 14,
                  marginBottom: 10,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 24 }}>{e.mood.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.ink }}>
                      {e.mood.label} · Energy {e.energy}/5
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                      {formatEntryTime(e.date)}
                      {e.helped?.length > 0 && ` · ${e.helped[0]} helped`}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Empty state */}
        {entries.length === 0 && (
          <View style={{ marginTop: 32, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 12 }}>No check-ins yet.</Text>
            <Pressable
              onPress={() => router.push('checkin')}
              style={{ backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 24 }}
            >
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Start your first check-in</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </>
  );
}