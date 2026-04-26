import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';

const SESSIONS = [
  { label: 'Fokus', duration: 25 * 60, color: '#4f46e5', emoji: '🎯' },
  { label: 'Istirahat Pendek', duration: 5 * 60, color: '#10b981', emoji: '☕' },
  { label: 'Istirahat Panjang', duration: 15 * 60, color: '#f59e0b', emoji: '🛋️' },
];

export default function FocusMode() {
  const [sessionIdx, setSessionIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SESSIONS[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            new Notification('FocusMonitor', { body: `Sesi ${SESSIONS[sessionIdx].label} selesai!` });
            if (sessionIdx === 0) setCycles(c => c + 1);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleStart = () => {
    if (Notification.permission !== 'granted') Notification.requestPermission();
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(SESSIONS[sessionIdx].duration);
  };

  const handleSession = (idx) => {
    setIsRunning(false);
    setSessionIdx(idx);
    setTimeLeft(SESSIONS[idx].duration);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const progress = ((SESSIONS[sessionIdx].duration - timeLeft) / SESSIONS[sessionIdx].duration) * 100;
  const session = SESSIONS[sessionIdx];

  const TIPS = [
    '💡 Matikan notifikasi HP selama sesi fokus',
    '🚫 Jangan buka media sosial saat timer berjalan',
    '💧 Minum air putih secukupnya',
    '🌿 Pastikan ruangan cukup cahaya',
    '🎧 Musik instrumental bisa membantu konsentrasi',
    '📵 Letakkan HP menghadap bawah',
  ];

  return (
    <div style={{ padding: 28, maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>⏱️ Mode Fokus</h1>
      <p style={{ color: '#6b7280', marginBottom: 28 }}>Teknik Pomodoro untuk produktivitas maksimal</p>

      {/* Session selector */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        {SESSIONS.map((s, i) => (
          <button key={i} onClick={() => handleSession(i)}
            style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `2px solid ${i === sessionIdx ? s.color : '#e5e7eb'}`,
              background: i === sessionIdx ? s.color + '15' : '#fff', cursor: 'pointer',
              fontWeight: 600, fontSize: 14, color: i === sessionIdx ? s.color : '#6b7280', transition: 'all 0.2s' }}>
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <svg width="220" height="220" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r="100" fill="none" stroke="#f3f4f6" strokeWidth="12" />
            <circle cx="110" cy="110" r="100" fill="none" stroke={session.color} strokeWidth="12"
              strokeDasharray={`${2 * Math.PI * 100}`}
              strokeDashoffset={`${2 * Math.PI * 100 * (1 - progress / 100)}`}
              strokeLinecap="round" transform="rotate(-90 110 110)"
              style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: '#1e1b4b', fontFamily: 'monospace' }}>{minutes}:{seconds}</div>
            <div style={{ fontSize: 14, color: session.color, fontWeight: 600 }}>{session.emoji} {session.label}</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Siklus: {cycles}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
        <button onClick={handleReset}
          style={{ padding: '12px 20px', background: '#f3f4f6', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
          <RotateCcw size={16} /> Reset
        </button>
        <button onClick={isRunning ? () => setIsRunning(false) : handleStart}
          style={{ padding: '12px 36px', background: isRunning ? '#ef4444' : session.color, border: 'none', borderRadius: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 700, color: '#fff' }}>
          {isRunning ? <><Pause size={18} /> Jeda</> : <><Play size={18} /> Mulai</>}
        </button>
      </div>

      {/* Tips */}
      <div style={{ background: '#f9fafb', borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 12 }}>💬 Tips Fokus</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {TIPS.map((tip, i) => (
            <div key={i} style={{ background: '#fff', padding: '10px 14px', borderRadius: 8, fontSize: 13, color: '#4b5563', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}