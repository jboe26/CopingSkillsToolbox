import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme';
import { skills } from '../skills';

export default function Toolbox() {
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Load saved favorites once, when the screen first opens.
  useEffect(() => {
    AsyncStorage.getItem('favorites').then((saved) => {
      if (saved) setFavorites(JSON.parse(saved));
    });
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((current) => {
      const next = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
      AsyncStorage.setItem('favorites', JSON.stringify(next)); // save every change
      return next;
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 60 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.ink, marginBottom: 4 }}>
          Toolbox
        </Text>
        <Text style={{ fontSize: 15, color: colors.muted, marginBottom: 20 }}>
          Your coping skills, when you need them.
        </Text>

        {skills.map((skill) => {
          const isFavorite = favorites.includes(skill.id);
          return (
            <Pressable
              key={skill.id}
              onPress={() => setSelected(skill)}
              style={{
                backgroundColor: colors.card,
                borderRadius: 14,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.accent, letterSpacing: 0.5 }}>
                  {skill.category.toUpperCase()}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.ink, marginTop: 3 }}>
                  {skill.title}
                </Text>
                <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>
                  {skill.when}
                </Text>
              </View>

              <Pressable onPress={() => toggleFavorite(skill.id)} hitSlop={10} style={{ padding: 4 }}>
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isFavorite ? '#E5484D' : colors.border}
                />
              </Pressable>
            </Pressable>
          );
        })}
      </ScrollView>

      <Modal visible={selected !== null} animationType="slide" transparent onRequestClose={() => setSelected(null)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(38,61,58,0.4)' }}>
          <View style={{ backgroundColor: colors.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 }}>
            {selected && (
              <>
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.accent, letterSpacing: 0.5 }}>
                  {selected.category.toUpperCase()}
                </Text>
                <Text style={{ fontSize: 26, fontWeight: '700', color: colors.ink, marginTop: 6, marginBottom: 14 }}>
                  {selected.title}
                </Text>
                <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary, marginBottom: 4 }}>
                    WHEN TO USE
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.ink }}>{selected.when}</Text>
                </View>
                <Text style={{ fontSize: 16, color: colors.ink, lineHeight: 24 }}>{selected.how}</Text>

                <Pressable onPress={() => setSelected(null)} style={{ marginTop: 24, backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Close</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}