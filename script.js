const { useState, useEffect, useRef } = React;

const App = () => {
  const defaultSession = 25;
  const defaultBreak = 5;

  const [breakLength, setBreakLength] = useState(defaultBreak);
  const [sessionLength, setSessionLength] = useState(defaultSession);
  const [timeLeft, setTimeLeft] = useState(defaultSession * 60);
  const [breaking, setBreaking] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const endTimeRef = useRef(null);

  // refs so the tick function always sees current values, even inside a stale closure
  const breakingRef = useRef(breaking);
  const breakLengthRef = useRef(breakLength);
  const sessionLengthRef = useRef(sessionLength);
  useEffect(() => { breakingRef.current = breaking; }, [breaking]);
  useEffect(() => { breakLengthRef.current = breakLength; }, [breakLength]);
  useEffect(() => { sessionLengthRef.current = sessionLength; }, [sessionLength]);

  useEffect(() => {
    if (!isRunning) return;

    endTimeRef.current = Date.now() + timeLeft * 1000;

    const tick = () => {
      const now = Date.now();
      let currentBreaking = breakingRef.current;

      // Catch up on ALL missed phase switches, not just one
      while (endTimeRef.current <= now) {
        currentBreaking = !currentBreaking;
        const durationMs = (currentBreaking ? breakLengthRef.current : sessionLengthRef.current) * 60 * 1000;
        endTimeRef.current += durationMs;
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      }

      if (currentBreaking !== breakingRef.current) {
        breakingRef.current = currentBreaking;
        setBreaking(currentBreaking);
      }
      setTimeLeft(Math.round((endTimeRef.current - now) / 1000));
    };

    intervalRef.current = setInterval(tick, 1000);

    // Force an immediate catch-up the moment the tab becomes visible again,
    // instead of waiting for the (possibly throttled) next interval tick
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const display = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const resetting = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setBreaking(false);
    setBreakLength(defaultBreak);
    setSessionLength(defaultSession);
    setTimeLeft(defaultSession * 60);
    endTimeRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const startStop = () => setIsRunning(prev => !prev);

  // ... rest of your JSX unchanged
};
