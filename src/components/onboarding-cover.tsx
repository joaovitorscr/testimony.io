"use client";

import { Quote } from "lucide-react";
import { motion } from "motion/react";

/** Brand panel on the left of the onboarding dialog. Animates once on open. */
export function OnboardingCover() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-l-lg bg-zinc-900 py-4 lg:py-0">
      <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-indigo-500/30 blur-[100px]" />
      <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-purple-500/30 blur-[100px]" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-6 text-white/80">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-br from-white/10 to-white/5 shadow-2xl ring-1 ring-white/20 backdrop-blur-md"
        >
          <Quote className="h-10 w-10 fill-white/20 text-white" />
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-2 text-center"
        >
          <h3 className="text-xl font-bold tracking-tight text-white">Testimony.io</h3>
          <p className="text-sm font-medium text-zinc-400">Collect feedback effortlessly</p>
        </motion.div>
      </div>

      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
