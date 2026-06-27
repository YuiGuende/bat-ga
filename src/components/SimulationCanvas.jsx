import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { SimulationEngine } from "../simulation/SimulationEngine.js";
import SkillBarOverlay from "./SkillBarOverlay.jsx";

const SimulationCanvas = forwardRef(function SimulationCanvas({ settings, onSnapshot, startPaused, snapshot }, ref) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useImperativeHandle(ref, () => ({
    reset() {
      engineRef.current?.reset(settings);
      if (startPaused) {
        engineRef.current?.setPaused(true);
      }
    },
    pause() {
      engineRef.current?.setPaused(true);
    },
    resume() {
      engineRef.current?.setPaused(false);
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new SimulationEngine(canvas, settings, onSnapshot);
    engineRef.current = engine;
    if (startPaused) {
      engine.setPaused(true);
    }
    engine.start();

    return () => {
      engine.stop();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    engineRef.current?.setSettings(settings);
  }, [settings]);

  return (
    <div className="canvasShell">
      <canvas
        ref={canvasRef}
        width={settings.worldWidth}
        height={settings.worldHeight}
        aria-label="Chicken herding simulation canvas"
      />
      <SkillBarOverlay snapshot={snapshot} />
    </div>
  );
});

export default SimulationCanvas;
