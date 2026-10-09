"use client";
import { useEffect, useState } from "react";

export default function TodayDate() {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(
      new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date())
    );
  }, []);

  return <>{text || "\u00A0"}</>;
}