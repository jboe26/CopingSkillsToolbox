import { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme';
import { skills } from '../skills';

const groundingSteps = [
  { count: 5, sense: 'things you can SEE' },
  { count: 4, sense: 'things you can FEEL' },
  { count: 3, sense: 'things you can HEAR' },
  { count: 2, sense: 'things you can SMELL' },
  { count: 1, sense: 'thing you can TASTE' },
];

const bodyParts = [
  { part: 'Forehead & Scalp', instruction: 'Notice any tightness here. Let your forehead soften. Let your scalp relax.' },
  { part: 'Jaw & Face', instruction: 'Unclench your jaw. Let your tongue drop from the roof of your mouth. Relax your cheeks.' },
  { part: 'Neck & Shoulders', instruction: 'Drop your shoulders away from your ears. Release any tension holding in your neck.' },
  { part: 'Chest & Breath', instruction: 'Take one slow breath in. Feel your chest rise. Let it fall fully on the exhale.' },
  { part: 'Hands & Arms', instruction: 'Open your hands. Unclench your fingers. Let your arms feel heavy and loose.' },
  { part: 'Stomach', instruction: "Let your stomach soften. You don't have to hold anything in right now." },
  { part: 'Legs & Feet', instruction: 'Feel the weight of your legs. Wiggle your toes. Let your feet rest heavy.' },
];

const mindfulPrompts = [
  "Notice your breath. Just observe it — don't change it.",
  'Feel the weight of your body right now.',
  'What sounds can you hear in this moment?',
  "Let your thoughts pass like clouds. You don't have to hold any of them.",
];

const boxPhases = ['Breathe in', 'Hold', 'Breathe out', 'Hold'];

export default function Toolbox() {
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [runningExercise, setRunningExercise] = useState(null);
  const [pressedId, setPressedId] = useState(null);

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
      AsyncStorage.setItem('favorites', JSON.stringify(next));
      return next;
    });
  };

  const exerciseMap = {
    'grounding': 'grounding',
    'box-breathing': 'box',
    'body-scan': 'bodyscan',
    'mindful-minute': 'mindful',
  };

  const handleSkillClick = (skill) => {
    if (exerciseMap[skill.id]) {
      setRunningExercise(exerciseMap[skill.id]);
    } else {
      setSelected(skill);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 60, paddingBottom: 24 }}>
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 32, fontWeight: '800', color: colors.ink, marginBottom: 6, letterSpacing: -0.5 }}>
            Toolbox
          </Text>
          <View style={{ height: 3, width: 50, backgroundColor: colors.primary, borderRadius: 2 }} />
          <Text style={{ fontSize: 15, color: colors.muted, marginTop: 12 }}>
            Pick a skill. Feel better.
          </Text>
        </View>

        {skills.map((skill) => {
          const isFavorite = favorites.includes(skill.id);
          const isPressed = pressedId === skill.id;
          
          return (
            <Pressable
              key={skill.id}
              onPress={() => handleSkillClick(skill)}
              onPressIn={() => setPressedId(skill.id)}
              onPressOut={() => setPressedId(null)}
              style={{
                backgroundColor: colors.card,
                borderRadius: 16,
                padding: 18,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: 'row',
                alignItems: 'flex-start',
                transform: [{ scale: isPressed ? 0.98 : 1 }],
                opacity: isPressed ? 0.9 : 1,
              }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: colors.primary, letterSpacing: 1 }}>
                    {skill.category.toUpperCase()}
                  </Text>
                  {/* <View style={{ width: 4, height: 4, backgroundColor: colors.accent, borderRadius: 2 }} /> */}
                </View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.ink, marginBottom: 6 }}>
                  {skill.title}
                </Text>
                <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 18, fontStyle: 'italic' }}>
                  "{skill.when}"
                </Text>
              </View>

              <Pressable 
                onPress={() => toggleFavorite(skill.id)} 
                hitSlop={12} 
                style={{ padding: 6, marginLeft: 12 }}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? '#E5484D' : colors.muted}
                />
              </Pressable>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* How-to modal for regular skills */}
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

      {/* Exercise modals */}
      <Modal visible={runningExercise === 'grounding'} animationType="slide" onRequestClose={() => setRunningExercise(null)}>
        <GroundingExercise onComplete={() => setRunningExercise(null)} />
      </Modal>
      <Modal visible={runningExercise === 'box'} animationType="slide" onRequestClose={() => setRunningExercise(null)}>
        <BoxBreathingExercise onComplete={() => setRunningExercise(null)} />
      </Modal>
      <Modal visible={runningExercise === 'bodyscan'} animationType="slide" onRequestClose={() => setRunningExercise(null)}>
        <BodyScanExercise onComplete={() => setRunningExercise(null)} />
      </Modal>
      <Modal visible={runningExercise === 'mindful'} animationType="slide" onRequestClose={() => setRunningExercise(null)}>
        <MindfulMinuteExercise onComplete={() => setRunningExercise(null)} />
      </Modal>
    </View>
  );
}

// ── GROUNDING ──────────────────────────────────────────────
function GroundingExercise({ onComplete }) {
  const [step, setStep] = useState(0);
  const done = step >= groundingSteps.length;
  const progress = step / groundingSteps.length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: colors.accent, letterSpacing: 0.5, marginBottom: 8 }}>GROUNDING</Text>
      <Text style={{ fontSize: 26, fontWeight: '700', color: colors.ink, marginBottom: 32 }}>5-4-3-2-1 Grounding</Text>

      {done ? (
        <>
          <Text style={{ fontSize: 64, marginBottom: 16 }}>🌿</Text>
          <Text style={{ fontSize: 20, color: colors.ink, marginBottom: 40 }}>You're here. You're okay.</Text>
          <Pressable onPress={onComplete} style={btnStyle(colors.primary)}>
            <Text style={btnText}>Done</Text>
          </Pressable>
        </>
      ) : (
        <>
          <View style={{ width: '100%', height: 6, backgroundColor: colors.border, borderRadius: 3, marginBottom: 32 }}>
            <View style={{ width: `${progress * 100}%`, height: 6, backgroundColor: colors.primary, borderRadius: 3 }} />
          </View>
          <Text style={{ fontSize: 96, fontWeight: '700', color: colors.primary, lineHeight: 100 }}>
            {groundingSteps[step].count}
          </Text>
          <Text style={{ fontSize: 20, color: colors.ink, marginTop: 8, marginBottom: 8, textAlign: 'center' }}>
            {groundingSteps[step].sense}
          </Text>
          <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 40 }}>Notice each one slowly</Text>
          <Pressable onPress={() => setStep(step + 1)} style={btnStyle(colors.primary)}>
            <Text style={btnText}>{step === groundingSteps.length - 1 ? 'Finish' : 'Next'}</Text>
          </Pressable>
          <Pressable onPress={onComplete} style={[btnStyle('transparent'), { borderWidth: 2, borderColor: colors.primary, marginTop: 10 }]}>
            <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 16 }}>Exit</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

// ── BOX BREATHING ──────────────────────────────────────────
function BoxBreathingExercise({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(4);
  const [rounds, setRounds] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef(null);
  const stateRef = useRef({ phase: 0, count: 4, rounds: 0 });

  const start = () => {
    setStarted(true);
    stateRef.current = { phase: 0, count: 4, rounds: 1 };
    setPhase(0);
    setCount(4);
    setRounds(1);
    timerRef.current = setInterval(() => {
      const s = stateRef.current;
      s.count--;
      if (s.count < 0) {
        s.phase = (s.phase + 1) % 4;
        if (s.phase === 0) {
          s.rounds++;
          if (s.rounds > 4) {
            clearInterval(timerRef.current);
            setFinished(true);
            return;
          }
        }
        s.count = 3;
      }
      setPhase(s.phase);
      setCount(s.count);
      setRounds(s.rounds);
    }, 1000);
  };

  const close = () => {
    clearInterval(timerRef.current);
    onComplete();
  };

  if (finished)
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 64, marginBottom: 16 }}>💙</Text>
        <Text style={{ fontSize: 20, color: colors.ink, marginBottom: 40, textAlign: 'center' }}>Nice work. Your nervous system thanks you.</Text>
        <Pressable onPress={onComplete} style={btnStyle(colors.primary)}>
          <Text style={btnText}>Done</Text>
        </Pressable>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: colors.accent, letterSpacing: 0.5, marginBottom: 8 }}>BREATHING</Text>
      <Text style={{ fontSize: 26, fontWeight: '700', color: colors.ink, marginBottom: 32 }}>Box Breathing</Text>
      <View style={{ width: 160, height: 160, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 72, fontWeight: '700', color: colors.primary }}>{count + 1}</Text>
      </View>
      <Text style={{ fontSize: 22, fontWeight: '600', color: colors.ink, marginBottom: 8 }}>
        {started ? boxPhases[phase] : 'Get comfortable'}
      </Text>
      <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 40 }}>
        {started ? `Round ${rounds} of 4` : 'and begin when ready'}
      </Text>
      {!started && (
        <Pressable onPress={start} style={btnStyle(colors.primary)}>
          <Text style={btnText}>Begin</Text>
        </Pressable>
      )}
      <Pressable onPress={close} style={[btnStyle('transparent'), { borderWidth: 2, borderColor: colors.primary, marginTop: 10 }]}>
        <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 16 }}>Exit</Text>
      </Pressable>
    </View>
  );
}

// ── BODY SCAN ─────────────────────────────────────────────
function BodyScanExercise({ onComplete }) {
  const [step, setStep] = useState(0);
  const done = step >= bodyParts.length;
  const progress = step / bodyParts.length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: colors.accent, letterSpacing: 0.5, marginBottom: 8 }}>BODY AWARENESS</Text>
      <Text style={{ fontSize: 26, fontWeight: '700', color: colors.ink, marginBottom: 32 }}>Body Scan</Text>

      {done ? (
        <>
          <Text style={{ fontSize: 64, marginBottom: 16 }}>🌊</Text>
          <Text style={{ fontSize: 20, color: colors.ink, marginBottom: 40 }}>Head to toe. You made it through.</Text>
          <Pressable onPress={onComplete} style={btnStyle(colors.primary)}>
            <Text style={btnText}>Done</Text>
          </Pressable>
        </>
      ) : (
        <>
          <View style={{ width: '100%', height: 6, backgroundColor: colors.border, borderRadius: 3, marginBottom: 32 }}>
            <View style={{ width: `${progress * 100}%`, height: 6, backgroundColor: colors.primary, borderRadius: 3 }} />
          </View>
          <Text style={{ fontSize: 22, fontWeight: '600', color: colors.ink, marginBottom: 12, textAlign: 'center' }}>
            {bodyParts[step].part}
          </Text>
          <Text style={{ fontSize: 16, color: colors.muted, lineHeight: 24, textAlign: 'center', marginBottom: 40 }}>
            {bodyParts[step].instruction}
          </Text>
          <Pressable onPress={() => setStep(step + 1)} style={btnStyle(colors.primary)}>
            <Text style={btnText}>{step === bodyParts.length - 1 ? 'Finish' : 'Next'}</Text>
          </Pressable>
          <Pressable onPress={onComplete} style={[btnStyle('transparent'), { borderWidth: 2, borderColor: colors.primary, marginTop: 10 }]}>
            <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 16 }}>Exit</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

// ── MINDFUL MINUTE ────────────────────────────────────────
function MindfulMinuteExercise({ onComplete }) {
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef(null);
  const prompt = useRef(mindfulPrompts[Math.floor(Math.random() * mindfulPrompts.length)]).current;

  const start = () => {
    setStarted(true);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          setFinished(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const close = () => {
    clearInterval(timerRef.current);
    onComplete();
  };

  if (finished)
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 64, marginBottom: 16 }}>✨</Text>
        <Text style={{ fontSize: 20, color: colors.ink, marginBottom: 40, textAlign: 'center' }}>One full minute. Well done.</Text>
        <Pressable onPress={onComplete} style={btnStyle(colors.primary)}>
          <Text style={btnText}>Done</Text>
        </Pressable>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: colors.accent, letterSpacing: 0.5, marginBottom: 8 }}>MINDFULNESS</Text>
      <Text style={{ fontSize: 26, fontWeight: '700', color: colors.ink, marginBottom: 16 }}>Mindful Minute</Text>
      <Text style={{ fontSize: 15, color: colors.muted, textAlign: 'center', marginBottom: 32, lineHeight: 22 }}>{prompt}</Text>
      <Text style={{ fontSize: 72, fontWeight: '700', color: colors.primary, marginBottom: 8 }}>{seconds}</Text>
      <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 40 }}>
        {started ? 'Keep breathing...' : 'One minute. Just breathe.'}
      </Text>
      {!started && (
        <Pressable onPress={start} style={btnStyle(colors.primary)}>
          <Text style={btnText}>Begin</Text>
        </Pressable>
      )}
      <Pressable onPress={close} style={[btnStyle('transparent'), { borderWidth: 2, borderColor: colors.primary, marginTop: 10 }]}>
        <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 16 }}>Exit</Text>
      </Pressable>
    </View>
  );
}

// ── SHARED STYLES ─────────────────────────────────────────
const btnStyle = (bg) => ({
  backgroundColor: bg,
  borderRadius: 12,
  paddingVertical: 14,
  paddingHorizontal: 48,
  alignItems: 'center',
  width: '100%',
});
const btnText = { color: '#fff', fontWeight: '600', fontSize: 16 };