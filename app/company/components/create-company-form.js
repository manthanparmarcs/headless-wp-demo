"use client";

import { useActionState } from "react";
import { createCompany } from "../actions";
import CompanyFormSubmit from "./company-form-submit";

const initialState = { error: "" };

export default function CreateCompanyForm() {
  const [state, formAction] = useActionState(createCompany, initialState);

  return (
    <form
      action={formAction}
      style={{
        border: "1px solid #1f2937",
        borderRadius: 12,
        padding: 16,
        background: "#0b1220",
        display: "grid",
        gap: 14,
      }}
    >
      <label style={{ display: "grid", gap: 8 }}>
        <span>Company title</span>
        <input
          name="title"
          placeholder="Company title"
          required
          style={{
            background: "#020617",
            border: "1px solid #334155",
            color: "#e2e8f0",
            borderRadius: 10,
            padding: "10px 12px",
          }}
        />
      </label>

      {state?.error ? (
        <p
          style={{
            margin: 0,
            color: "#fecaca",
            background: "#450a0a",
            border: "1px solid #7f1d1d",
            borderRadius: 10,
            padding: "10px 12px",
          }}
        >
          {state.error}
        </p>
      ) : null}

      <div>
        <CompanyFormSubmit
          idleLabel="Create & Publish"
          pendingLabel="Creating..."
        />
      </div>
    </form>
  );
}
