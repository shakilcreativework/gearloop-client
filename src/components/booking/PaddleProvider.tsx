"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  initializePaddle,
  type Paddle,
} from "@paddle/paddle-js";

interface PaddleContextValue {
  paddle: Paddle | null;
  ready: boolean;
}

const PaddleCtx = createContext<PaddleContextValue>({
  paddle: null,
  ready: false,
});

export function usePaddle() {
  return useContext(PaddleCtx);
}

export default function PaddleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) {
      console.warn(
        "[PaddleProvider] NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set — Paddle checkout disabled.",
      );
      return;
    }

    initializePaddle({
      token,
      environment:
        process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
          ? "production"
          : "sandbox",
    })
      .then((instance) => {
        if (instance) setPaddle(instance);
      })
      .catch((err: unknown) => {
        console.error("[PaddleProvider] Failed to initialize Paddle:", err);
      });
  }, []);

  return (
    <PaddleCtx.Provider value={{ paddle, ready: paddle !== null }}>
      {children}
    </PaddleCtx.Provider>
  );
}
