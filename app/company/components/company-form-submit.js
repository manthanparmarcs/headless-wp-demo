"use client";

import { useFormStatus } from "react-dom";

export default function CompanyFormSubmit({ idleLabel, pendingLabel }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        border: "1px solid #244",
        background: pending ? "#164e63" : "#0b3f3f",
        color: "#fff",
        borderRadius: 10,
        padding: "10px 14px",
        cursor: pending ? "wait" : "pointer",
        opacity: pending ? 0.8 : 1,
      }}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
