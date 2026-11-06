import { useState } from 'react';

// Simple "are you human" check: add two numbers. Returns the question + a checker.
export function useCaptcha() {
  const make = () => [2 + Math.floor(Math.random() * 8), 1 + Math.floor(Math.random() * 9)];
  const [pair, setPair] = useState(make);
  return {
    question: `${pair[0]} + ${pair[1]}`,
    check: v => Number(v) === pair[0] + pair[1],
    refresh: () => setPair(make()),
    answer: pair[0] + pair[1]
  };
}
