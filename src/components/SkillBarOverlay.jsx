import React from "react";

export default function SkillBarOverlay({ snapshot }) {
  if (!snapshot) return null;

  const cooldowns = snapshot.cooldowns || {
    sprint: { current: 0, max: 10 },
    clap: { current: 0, max: 15 },
    call: { current: 0, max: 17 },
    grain: { current: 0, max: 17 }
  };

  const skills = [
    {
      id: "sprint",
      name: "Chạy nhanh",
      key: "Shift",
      emoji: "🏃",
      cooldown: cooldowns.sprint
    },
    {
      id: "grain",
      name: "Rải thóc",
      key: "Space",
      emoji: "🌾",
      cooldown: cooldowns.grain
    },
    {
      id: "call",
      name: "Gọi gà",
      key: "Q",
      emoji: "🗣️",
      cooldown: cooldowns.call
    },
    {
      id: "clap",
      name: "Vỗ tay",
      key: "K",
      emoji: "👏",
      cooldown: cooldowns.clap
    }
  ];

  return (
    <div className="skillBarContainer">
      {skills.map((skill) => {
        const { current, max } = skill.cooldown;
        const isOnCooldown = current > 0;
        const percentage = isOnCooldown ? Math.min(100, (current / max) * 100) : 0;

        return (
          <div key={skill.id} className={`skillIconCard ${isOnCooldown ? "onCooldown" : ""}`} title={skill.name}>
            <span className="skillKeyBadge">{skill.key}</span>
            <span className="skillEmoji">{skill.emoji}</span>
            
            {/* Visual cooldown slide overlay */}
            {isOnCooldown && (
              <div 
                className="skillCooldownOverlay" 
                style={{ height: `${percentage}%` }}
              />
            )}
            
            {/* Cooldown timer text */}
            {isOnCooldown && (
              <div className="skillCooldownTimer">
                {current.toFixed(1)}s
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
