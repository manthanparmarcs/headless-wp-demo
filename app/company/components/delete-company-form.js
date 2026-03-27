"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { deleteCompany } from "../actions";

const initialState = { error: "", success: false };

function DeleteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        border: "1px solid #7f1d1d",
        background: pending ? "#7f1d1d" : "#450a0a",
        color: "#fecaca",
        borderRadius: 8,
        padding: "6px 10px",
        cursor: pending ? "wait" : "pointer",
        opacity: pending ? 0.8 : 1,
      }}
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

export default function DeleteCompanyForm({ id }) {
  const router = useRouter();
  const [state, formAction] = useActionState(deleteCompany, initialState);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [router, state]);

  return (
    <form action={formAction} style={{ display: "inline" }}>
      <input type="hidden" name="id" value={id} />
      <DeleteSubmitButton />
      {state?.error ? (
        <p style={{ margin: "8px 0 0", color: "#fca5a5", fontSize: 12 }}>
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
