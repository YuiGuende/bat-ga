import React, { useRef, useState, useEffect } from "react";
import SimulationCanvas from "./components/SimulationCanvas.jsx";
import ControlPanel from "./components/ControlPanel.jsx";
import StatisticsPanel from "./components/StatisticsPanel.jsx";
import CompletionModal from "./components/CompletionModal.jsx";
import InstructionModal from "./components/InstructionModal.jsx";
import TutorialVideoModal from "./components/TutorialVideoModal.jsx";
import { DEFAULT_SETTINGS } from "./config/defaultSettings.js";

export default function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [snapshot, setSnapshot] = useState(null);
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [hasShownTutorial, setHasShownTutorial] = useState(false);
  const [panelsVisible, setPanelsVisible] = useState(false);
  const [warnedChickens, setWarnedChickens] = useState(new Set());
  const [toasts, setToasts] = useState([]);
  const simulationRef = useRef(null);

  const addToast = (message) => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  useEffect(() => {
    if (!snapshot || !snapshot.chickens) return;

    let changed = false;
    const nextWarned = new Set(warnedChickens);

    snapshot.chickens.forEach((chicken) => {
      const isAngry = chicken.panicTriggerCount >= 3;
      const alreadyWarned = warnedChickens.has(chicken.id);

      if (isAngry && !alreadyWarned && !chicken.secured) {
        addToast(`⚠️ Cảnh báo: Có gà bị hoảng sợ! Nó có thể đá bạn nếu bị chọc quá nhiều!`);
        nextWarned.add(chicken.id);
        changed = true;
      } else if (!isAngry && alreadyWarned) {
        nextWarned.delete(chicken.id);
        changed = true;
      }
    });

    if (changed) {
      setWarnedChickens(nextWarned);
    }
  }, [snapshot, warnedChickens]);

  const toggleInstructions = () => {
    if (videoModalOpen) return;

    setInstructionsOpen((prev) => {
      const next = !prev;
      if (next) {
        simulationRef.current?.pause();
      } else {
        if (!hasShownTutorial) {
          setVideoModalOpen(true);
        } else {
          simulationRef.current?.resume();
        }
      }
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        toggleInstructions();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasShownTutorial, videoModalOpen]);

  const handleCloseInstructions = () => {
    setInstructionsOpen(false);
    if (!hasShownTutorial) {
      setVideoModalOpen(true);
    } else {
      simulationRef.current?.resume();
    }
  };

  const handleCloseVideoModal = () => {
    setVideoModalOpen(false);
    setHasShownTutorial(true);
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
          onEscClick={toggleInstructions}
        />
      </section>

      {panelsVisible && <StatisticsPanel snapshot={snapshot} />}

      <CompletionModal snapshot={snapshot} onReset={() => simulationRef.current?.reset()} />
      <InstructionModal open={instructionsOpen} onClose={handleCloseInstructions} />
      <TutorialVideoModal open={videoModalOpen} onClose={handleCloseVideoModal} />

      <div className="toastContainer">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            {toast.message}
          </div>
        ))}
      </div>
    </main>
  );
}
