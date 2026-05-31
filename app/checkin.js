import { useState } from 'react';
import { Text, View, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme';

const moods = [
  { emoji: '😔', label: 'Low' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '😄', label: 'Great' },
  { emoji: '😰', label: 'Anxious' },
];

const helpedOptions = [
  'Box Breathing', 'Grounding', 'Body Scan',
  'Mindful Minute', 'Journaling', 'Walk', 'Talked to someone',
];

export default function CheckIn() {
  const [mood, setMood] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [note, setNote] = useState('');
  const [helped, setHelped] = useState([]);

  const toggleHelped = (item) => {
    setHelped((curr) =>
      curr.includes(item) ? curr.filter((x) => x !== item) : [...curr, item]
    );
  };

  const save = async () => {
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood,
      energy,
      note,
      helped,
    };
    const existing = await AsyncStorage.getItem('coping-entries');
    const entries = existing ? JSON.parse(existing) : [];
    entries.unshift(entry);
    await AsyncStorage.setItem('coping-entries', JSON.stringify(entries));
    Alert.alert('Saved', 'Check-in logged.');
    setMood(null); setEnergy(null); setNote(''); setHelped([]);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingTop: 60, paddingBottom: 40 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', color: colors.ink, marginBottom: 4 }}>Check-in</Text>
      <Text style={{ fontSize: 15, color: colors.muted, marginBottom: 24 }}>How are you doing right now?</Text>

      <Text style={sectionLabel}>How are you feeling?</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {moods.map((m) => (
          <Pressable
            key={m.label}
            onPress={() => setMood(m)}
            style={{
              flex: 1, minWidth: 52, padding: 10, borderRadius: 10, alignItems: 'center',
              backgroundColor: mood?.label === m.label ? '#e8f0f8' : colors.card,
              borderWidth: mood?.label === m.label ? 2 : 1,
              borderColor: mood?.label === m.label ? colors.primary : colors.border,
            }}
          >
            <Text style={{ fontSize: 20 }}>{m.emoji}</Text>
            <Text style={{ fontSize: 10, color: colors.muted, marginTop: 3 }}>{m.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={sectionLabel}>Energy level</Text>
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 20 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable
            key={n}
            onPress={() => setEnergy(n)}
            style={{
              flex: 1, padding: 10, borderRadius: 8, alignItems: 'center',
              backgroundColor: energy === n ? '#e8f0f8' : colors.card,
              borderWidth: energy === n ? 2 : 1,
              borderColor: energy === n ? colors.primary : colors.border,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: energy === n ? colors.primary : colors.muted }}>{n}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={sectionLabel}>Note <Text style={{ fontWeight: '400' }}>(optional)</Text></Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="What's on your mind?"
        placeholderTextColor={colors.muted}
        multiline
        style={{
          backgroundColor: colors.card, borderRadius: 10, borderWidth: 1, borderColor: colors.border,
          padding: 12, fontSize: 14, color: colors.ink, minHeight: 80, marginBottom: 20,
          textAlignVertical: 'top',
        }}
      />

      <Text style={sectionLabel}>What helped? <Text style={{ fontWeight: '400' }}>(optional)</Text></Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
        {helpedOptions.map((item) => (
          <Pressable
            key={item}
            onPress={() => toggleHelped(item)}
            style={{
              paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
              backgroundColor: helped.includes(item) ? colors.primary : colors.card,
              borderWidth: 1,
              borderColor: helped.includes(item) ? colors.primary : colors.border,
            }}
          >
            <Text style={{ fontSize: 13, color: helped.includes(item) ? '#fff' : colors.muted }}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={save}
        disabled={!mood || !energy}
        style={{
          backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14,
          alignItems: 'center', opacity: !mood || !energy ? 0.4 : 1,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Save check-in</Text>
      </Pressable>
    </ScrollView>
  );
}

const sectionLabel = { fontSize: 12, fontWeight: '700', color: '#788C9F', marginBottom: 10, letterSpacing: 0.5 };