import { useState, useCallback } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme';

const moodScore = { Low: 1, Anxious: 1.5, Okay: 2, Good: 3, Great: 4 };
const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function History() {
  const [entries, setEntries] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('coping-entries').then((data) => {
        if (data) setEntries(JSON.parse(data));
      });
    }, [])
  );

  const chartDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toDateString();
    const dayEntries = entries.filter((e) => new Date(e.date).toDateString() === dayStr);
    const avg = dayEntries.length
      ? dayEntries.reduce((s, e) => s + (moodScore[e.mood.label] || 2), 0) / dayEntries.length
      : 0;
    return { label: dayLabels[d.getDay()], avg, top: dayEntries[0], hasData: dayEntries.length > 0 };
  });

  const maxScore = 4;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingTop: 60, paddingBottom: 40 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', color: colors.ink, marginBottom: 4 }}>History</Text>
      <Text style={{ fontSize: 15, color: colors.muted, marginBottom: 20 }}>Your check-ins over time.</Text>

      {/* Chart */}
      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.muted, letterSpacing: 0.5, marginBottom: 10 }}>LAST 7 DAYS</Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 80, gap: 4, marginBottom: 4 }}>
        {chartDays.map((d, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
            <Text style={{ fontSize: 14, marginBottom: 3 }}>{d.top?.mood.emoji || ''}</Text>
            <View style={{
              width: '100%', borderRadius: 4,
              height: d.hasData ? Math.round((d.avg / maxScore) * 40) + 4 : 4,
              backgroundColor: colors.primary,
              opacity: d.hasData ? 1 : 0.2,
            }} />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 4, marginBottom: 24 }}>
        {chartDays.map((d, i) => (
          <Text key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: colors.muted }}>{d.label}</Text>
        ))}
      </View>

      {/* List */}
      {entries.length === 0 ? (
        <Text style={{ textAlign: 'center', color: colors.muted, marginTop: 40 }}>No check-ins yet.</Text>
      ) : (
        entries.map((e) => {
          const d = new Date(e.date);
          const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          const isOpen = expanded === e.id;
          return (
            <Pressable
              key={e.id}
              onPress={() => setExpanded(isOpen ? null : e.id)}
              style={{
                backgroundColor: colors.card, borderRadius: 12, borderWidth: 1,
                borderColor: colors.border, padding: 14, marginBottom: 10,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={{ fontSize: 28 }}>{e.mood.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.ink }}>{e.mood.label}</Text>
                  <Text style={{ fontSize: 12, color: colors.muted, marginTop: 1 }}>
                    Energy: {e.energy}/5 · {dateStr} {timeStr}
                  </Text>
                </View>
                <Text style={{ fontSize: 18, color: colors.muted }}>{isOpen ? '∧' : '∨'}</Text>
              </View>

              {isOpen && (
                <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
                  {e.note ? <Text style={{ fontSize: 13, color: colors.ink, marginBottom: 6 }}>{e.note}</Text> : null}
                  {e.helped?.length > 0 && (
                    <Text style={{ fontSize: 13, color: colors.muted }}>
                      <Text style={{ fontWeight: '600' }}>Helped: </Text>{e.helped.join(', ')}
                    </Text>
                  )}
                </View>
              )}
            </Pressable>
          );
        })
      )}
    </ScrollView>
  );
}