import { useState, useRef } from 'react';
import { Text, View, ScrollView, Pressable, Modal, Animated } from 'react-native';
import { colors } from '../theme';

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

const exercises = [
  { id: 'grounding', tag: 'GROUNDING', title: '5-4-3-2-1 Grounding', subtitle: 'Walk through your senses' },
  { id: 'box', tag: 'BREATHING', title: 'Box Breathing', subtitle: 'Calm anxiety with 4-count breath cycles' },
  { id: 'bodyscan', tag: 'BODY AWARENESS', title: 'Body Scan', subtitle: 'Release tension from head to toe' },
  { id: 'mindful', tag: 'MINDFULNESS', title: 'Mindful Minute', subtitle: 'One focused minute to reset' },
];

export default function Exercises() {
  const [activeExercise, setActiveExercise] = useState(null);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 60 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.ink, marginBottom: 4 }}>Exercises</Text>
        <Text style={{ fontSize: 15, color: colors.muted, marginBottom: 20 }}>Take a few minutes for yourself.</Text>

        {exercises.map((ex) => (
          <Pressable
            key={ex.id}
            onPress={() => setActiveExercise(ex.id)}
            style={{ backgroundColor: colors.card, borderRadius: 14, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: colors.border }}
          >
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.accent, letterSpacing: 0.5 }}>{ex.tag}</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.ink, marginTop: 3 }}>{ex.title}</Text>
            <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>{ex.subtitle}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Modal visible={activeExercise === 'grounding'} animationType="slide" onRequestClose={() => setActiveExercise(null)}>
        <Grounding onClose={() => setActiveExercise(null)} />
      </Modal>
      <Modal visible={activeExercise === 'box'} animationType="slide" onRequestClose={() => setActiveExercise(null)}>
        <BoxBreathing onClose={() => setActiveExercise(null)} />
      </Modal>
      <Modal visible={activeExercise === 'bodyscan'} animationType="slide" onRequestClose={() => setActiveExercise(null)}>
        <BodyScan onClose={() => setActiveExercise(null)} />
      </Modal>
      <Modal visible={activeExercise === 'mindful'} animationType="slide" onRequestClose={() => setActiveExercise(null)}>
        <MindfulMinute onClose={() => setActiveExercise(null)} />
      </Modal>
    </View>
  );
}

// ── GROUNDING ──────────────────────────────────────────────
function Grounding({ onClose }) {
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
          <Pressable onPress={onClose} style={btnStyle(colors.primary)}>
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
          <Pressable onPress={onClose} style={[btnStyle('transparent'), { borderWidth: 2, borderColor: colors.primary, marginTop: 10 }]}>
            <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 16 }}>Exit</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

// ── BOX BREATHING ──────────────────────────────────────────
const boxPhases = ['Breathe in', 'Hold', 'Breathe out', 'Hold'];

function BoxBreathing({ onClose }) {
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
    setPhase(0); setCount(4); setRounds(1);
    timerRef.current = setInterval(() => {
      const s = stateRef.current;
      s.count--;
      if (s.count < 0) {
        s.phase = (s.phase + 1) % 4;
        if (s.phase === 0) {
          s.rounds++;
          if (s.rounds > 4) { clearInterval(timerRef.current); setFinished(true); return; }
        }
        s.count = 3;
      }
      setPhase(s.phase); setCount(s.count); setRounds(s.rounds);
    }, 1000);
  };

  const close = () => { clearInterval(timerRef.current); onClose(); };

  if (finished) return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 64, marginBottom: 16 }}>💙</Text>
      <Text style={{ fontSize: 20, color: colors.ink, marginBottom: 40, textAlign: 'center' }}>Nice work. Your nervous system thanks you.</Text>
      <Pressable onPress={onClose} style={btnStyle(colors.primary)}><Text style={btnText}>Done</Text></Pressable>
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
        <Pressable onPress={start} style={btnStyle(colors.primary)}><Text style={btnText}>Begin</Text></Pressable>
      )}
      <Pressable onPress={close} style={[btnStyle('transparent'), { borderWidth: 2, borderColor: colors.primary, marginTop: 10 }]}>
        <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 16 }}>Exit</Text>
      </Pressable>
    </View>
  );
}

// ── BODY SCAN ─────────────────────────────────────────────
function BodyScan({ onClose }) {
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
          <Pressable onPress={onClose} style={btnStyle(colors.primary)}><Text style={btnText}>Done</Text></Pressable>
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
          <Pressable onPress={onClose} style={[btnStyle('transparent'), { borderWidth: 2, borderColor: colors.primary, marginTop: 10 }]}>
            <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 16 }}>Exit</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

// ── MINDFUL MINUTE ────────────────────────────────────────
function MindfulMinute({ onClose }) {
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef(null);
  const prompt = useRef(mindfulPrompts[Math.floor(Math.random() * mindfulPrompts.length)]).current;

  const start = () => {
    setStarted(true);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(timerRef.current); setFinished(true); return 0; }
        return s - 1;
      });
    }, 1000);
  };

  const close = () => { clearInterval(timerRef.current); onClose(); };

  if (finished) return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 64, marginBottom: 16 }}>✨</Text>
      <Text style={{ fontSize: 20, color: colors.ink, marginBottom: 40, textAlign: 'center' }}>One full minute. Well done.</Text>
      <Pressable onPress={onClose} style={btnStyle(colors.primary)}><Text style={btnText}>Done</Text></Pressable>
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
        <Pressable onPress={start} style={btnStyle(colors.primary)}><Text style={btnText}>Begin</Text></Pressable>
      )}
      <Pressable onPress={close} style={[btnStyle('transparent'), { borderWidth: 2, borderColor: colors.primary, marginTop: 10 }]}>
        <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 16 }}>Exit</Text>
      </Pressable>
    </View>
  );
}

// ── SHARED STYLES ─────────────────────────────────────────
const btnStyle = (bg) => ({
  backgroundColor: bg, borderRadius: 12, paddingVertical: 14,
  paddingHorizontal: 48, alignItems: 'center', width: '100%',
});
const btnText = { color: '#fff', fontWeight: '600', fontSize: 16 };