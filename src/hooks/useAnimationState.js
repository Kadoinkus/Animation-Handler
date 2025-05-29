import { useState, useEffect, useRef } from 'react';
import { getClip } from '../utils/csv';

/**
 * Custom hook for managing animation state and queue
 * @param {Array} clips - Array of animation clips
 * @returns {Object} Animation state and control functions
 */
export const useAnimationState = (clips) => {
  const [state, setState] = useState('idle');
  const [queue, setQueue] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [typeMood, setTypeMood] = useState('');
  const timer = useRef(null);

  useEffect(() => {
    if (!playing || !queue.length) return;
    const cur = queue[0];
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setQueue((q) => q.slice(1)), (cur.duration / 24) * 1000);
  }, [queue, playing]);

  useEffect(() => {
    if (!playing || queue.length) return;
    const idle = state === 'type' && typeMood ? `type_${typeMood}_L` : `${state}_idle_L`;
    enqueue(idle);
  }, [queue, playing, state, typeMood]);

  const enqueue = (name) => setQueue((q) => [...q, getClip(clips, name)]);

  const pause = () => {
    setPlaying(false);
    clearTimeout(timer.current);
  };

  const resume = () => !playing && setPlaying(true);

  return {
    state,
    setState,
    queue,
    playing,
    typeMood,
    setTypeMood,
    enqueue,
    pause,
    resume,
    setPlaying,
  };
};
