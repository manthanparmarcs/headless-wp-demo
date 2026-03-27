"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Buffer } from "node:buffer";
import { fetchGraphQL } from "@/lib/graphql";
import {
  CREATE_COMPANY,
  CREATE_COMPANY_WITH_FEATURED_IMAGE,
  DELETE_COMPANY,
  UPDATE_COMPANY,
  UPDATE_COMPANY_WITH_FEATURED_IMAGE,
} from "@/lib/mutations";

function toGlobalId(type, id) {
  return Buffer.from(`${type}:${id}`).toString("base64");
}

function parseFeaturedImageId(raw) {
  if (!raw) return null;
  const parsed = Number.parseInt(String(raw), 10);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

function getErrorMessage(error, fallbackMessage) {
  const message = error instanceof Error ? error.message : String(error);
  if (!message) return fallbackMessage;
  return message;
}

export async function createCompany(_prevState, formData) {
  const title = formData.get("title")?.trim();
  if (!title) {
    return { error: "Title is required." };
  }

  const featuredImageId = parseFeaturedImageId(formData.get("featuredImageId"));

  try {
    if (featuredImageId) {
      await fetchGraphQL(
        CREATE_COMPANY_WITH_FEATURED_IMAGE,
        { title, featuredImageId },
        { auth: true }
      );
    } else {
      await fetchGraphQL(CREATE_COMPANY, { title }, { auth: true });
    }
  } catch (error) {
    console.error("Create failed:", error);
    return {
      error: getErrorMessage(
        error,
        "Could not create company. Check Vercel WordPress auth environment variables."
      ),
    };
  }

  revalidatePath("/company");
  redirect("/company");
}

export async function updateCompany(id, _prevState, formData) {
  if (!id) {
    return { error: "Company ID is required." };
  }

  const title = formData.get("title")?.trim();
  if (!title) {
    return { error: "Title is required." };
  }

  const globalId = toGlobalId("company", id);
  const featuredImageId = parseFeaturedImageId(formData.get("featuredImageId"));

  try {
    if (featuredImageId) {
      await fetchGraphQL(
        UPDATE_COMPANY_WITH_FEATURED_IMAGE,
        { id: globalId, title, featuredImageId },
        { auth: true }
      );
    } else {
      await fetchGraphQL(
        UPDATE_COMPANY,
        { id: globalId, title },
        { auth: true }
      );
    }
  } catch (error) {
    console.error("Update failed:", error);
    return {
      error: getErrorMessage(
        error,
        "Could not update company. Check Vercel WordPress auth environment variables."
      ),
    };
  }

  revalidatePath("/company");
  redirect("/company");
}

export async function deleteCompany(_prevState, formData) {
  const id = formData.get("id");
  if (!id) {
    return { error: "Company ID is required.", success: false };
  }

  const globalId = toGlobalId("company", id);

  try {
    await fetchGraphQL(DELETE_COMPANY, { id: globalId }, { auth: true });
  } catch (error) {
    console.error("Delete failed:", error);
    return {
      error: getErrorMessage(
        error,
        "Could not delete company. Check Vercel WordPress auth environment variables."
      ),
      success: false,
    };
  }

  revalidatePath("/company");
  return { error: "", success: true };
}
