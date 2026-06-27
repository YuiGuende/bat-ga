import React, { useRef, useState, useEffect } from "react";
import SimulationCanvas from "./components/SimulationCanvas.jsx";
import ControlPanel from "./components/ControlPanel.jsx";
import StatisticsPanel from "./components/StatisticsPanel.jsx";
import CompletionModal from "./components/CompletionModal.jsx";
import InstructionModal from "./components/InstructionModal.jsx";
import { DEFAULT_SETTINGS } from "./config/defaultSettings.js";

export default function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [snapshot, setSnapshot] = useState(null);
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [panelsVisible, setPanelsVisible] = useState(false);
  const simulationRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setInstructionsOpen((prev) => {
          const next = !prev;
          if (next) {
            simulationRef.current?.pause();
          } else {
            simulationRef.current?.resume();
          }
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCloseInstructions = () => {
    setInstructionsOpen(false);
    simulationRef.current?.resume();
  };

  const appShellStyle = {
    gridTemplateColumns: panelsVisible
      ? undefined
      : "1fr"
  };

  return (
    <main className="appShell" style={appShellStyle}>
      <button
        type="button"
        onClick={() => setPanelsVisible(!panelsVisible)}
        className="secondaryButton"
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          border: "1px solid rgba(31, 38, 31, 0.2)",
          minHeight: "34px",
          padding: "0 12px",
          fontSize: "0.8rem",
          fontWeight: "600"
        }}
      >
        {panelsVisible ? "Ẩn bảng thông số" : "Hiện bảng thông số"}
      </button>

      {panelsVisible && (
        <ControlPanel
          settings={settings}
          setSettings={setSettings}
          snapshot={snapshot}
          onReset={() => simulationRef.current?.reset()}
          onPause={() => simulationRef.current?.pause()}
          onResume={() => simulationRef.current?.resume()}
        />
      )}

      <section className="playArea" aria-label="Simulation">
        <SimulationCanvas
          ref={simulationRef}
          settings={settings}
          onSnapshot={setSnapshot}
          startPaused={instructionsOpen}
          snapshot={snapshot}
        />
      </section>

      {panelsVisible && <StatisticsPanel snapshot={snapshot} />}
      
      <CompletionModal snapshot={snapshot} onReset={() => simulationRef.current?.reset()} />
      <InstructionModal open={instructionsOpen} onClose={handleCloseInstructions} />
    </main>
  );
}
