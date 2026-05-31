import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { colors } from './theme';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 26, fontWeight: '700', color: colors.ink, marginBottom: 20 }}>
        Coping Skills Toolbox
      </Text>

      <View style={{ backgroundColor: colors.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.accent, letterSpacing: 0.5 }}>
          GROUNDING
        </Text>
        <Text style={{ fontSize: 17, fontWeight: '600', color: colors.ink, marginTop: 4 }}>
          5-4-3-2-1 Senses
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
          <View style={{ flex: 1, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.accentSoft, borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}>
            <Text style={{ color: '#B0703F', fontWeight: '600' }}>Skip</Text>
          </View>
        </View>
      </View>

      <StatusBar style="dark" />
    </View>
  );
}