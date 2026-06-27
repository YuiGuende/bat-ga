import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { SimulationEngine } from "../simulation/SimulationEngine.js";
import SkillBarOverlay from "./SkillBarOverlay.jsx";

const SimulationCanvas = forwardRef(function SimulationCanvas({ settings, onSnapshot, startPaused, snapshot, onEscClick }, ref) {
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
      {/* ESC Keycap Button in top-left */}
      <button 
        type="button" 
        onClick={onEscClick} 
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          minWidth: "42px",
          minHeight: "26px",
          height: "26px",
          padding: "0 8px",
          fontSize: "0.75rem",
          fontWeight: "bold",
          borderRadius: "4px",
          background: "#ffffff",
          color: "#333333",
          border: "1px solid #cccccc",
          boxShadow: "0 2px 0 #bbbbbb, 0 3px 3px rgba(0,0,0,0.15)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          zIndex: 10
        }}
        title="Nhấn để đóng/mở hướng dẫn chơi"
      >
        ESC
      </button>

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
