"use client";

import React, { useState, useEffect } from "react";
import { StringInputProps, set, unset } from "sanity";

export function ColorInput(props: StringInputProps) {
  const { value, onChange } = props;
  
  // React'in input kasmasını engellemek için rengi önce yerel (lokal) state'te tutuyoruz
  const [prevValue, setPrevValue] = useState(value);
  const [localValue, setLocalValue] = useState(value || "#000000");

  // Dışarıdan gelen value değişirse lokal state'i doğrudan render aşamasında güncelle (React 18+ Best Practice)
  if (value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value || "#000000");
  }

  // Kullanıcı rengi sürüklerken saniyede 100 kere Sanity'ye kaydetmeye çalışmasını engelliyoruz (Debounce)
  useEffect(() => {
    const targetValue = value || "#000000";
    if (localValue === targetValue) return;

    const timeoutId = setTimeout(() => {
      onChange(localValue ? set(localValue) : unset());
    }, 200); // 200ms gecikme ile kaydeder

    return () => clearTimeout(timeoutId);
  }, [localValue, value, onChange]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(event.target.value);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ flex: 1 }}>
        <input
          type="color"
          value={localValue}
          onChange={handleChange}
          style={{
            width: "100%",
            height: "40px",
            padding: 0,
            border: "1px solid #333",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor: "transparent",
          }}
        />
      </div>
      <div>
        <span style={{ fontSize: "14px", color: "#888", fontFamily: "monospace" }}>
          {localValue.toUpperCase() || "Renk Seçin"}
        </span>
      </div>
    </div>
  );
}
