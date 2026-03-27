"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Buffer } from "node:buffer"; // <-- important for Vercel
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

export async function createCompany(formData) {
  const title = formData.get("title")?.trim();
  if (!title) throw new Error("Title is required");

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
    throw new Error("Could not create company");
  }

  revalidatePath("/company");
  redirect("/company");
}

export async function updateCompany(id, formData) {
  if (!id) throw new Error("Company ID is required");
  const globalId = toGlobalId("company", id);

  const title = formData.get("title")?.trim();
  if (!title) throw new Error("Title is required");

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
    throw new Error("Could not update company");
  }

  revalidatePath("/company");
  redirect("/company");
}

export async function deleteCompany(formData) {
  const id = formData.get("id");
  if (!id) throw new Error("Company ID is required");

  const globalId = toGlobalId("company", id);

  try {
    await fetchGraphQL(DELETE_COMPANY, { id: globalId }, { auth: true });
  } catch (error) {
    console.error("Delete failed:", error);
    throw new Error("Could not delete company");
  }

  revalidatePath("/company");
  redirect("/company");
}
