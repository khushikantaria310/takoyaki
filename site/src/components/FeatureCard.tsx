"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BLUR_EVENT, FOCUS_EVENT, features, type FocusDetail } from "@/lib/features";

/** A white speech bubble that points at the lifted ball. */
export default function FeatureCard() {
  const [detail, setDetail] = useState<FocusDetail | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onFocus = (event: Event) => setDetail((event as CustomEvent<FocusDetail>).detail);
    const onBlur = () => setDetail(null);
    window.addEventListener(FOCUS_EVENT, onFocus);
    window.addEventListener(BLUR_EVENT, onBlur);
    return () => {
      window.removeEventListener(FOCUS_EVENT, onFocus);
      window.removeEventListener(BLUR_EVENT, onBlur);
    };
  }, []);

  const feature = detail ? features[detail.index] : null;

  return (
    <div className="feature-card-layer" aria-live="polite">
      <AnimatePresence>
        {detail && feature ? (
          <div
            className="feature-card-anchor"
            style={{ left: detail.x + 22, top: detail.y }}
          >
            <motion.div
              key={feature.id}
              className="feature-card"
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.7, x: -12 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="feature-card__title">{feature.title}</span>
              {feature.command ? <code className="feature-card__cmd">{feature.command}</code> : null}
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
