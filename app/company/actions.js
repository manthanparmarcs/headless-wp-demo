"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { fetchGraphQL } from "@/lib/graphql";
import {
  CREATE_COMPANY,
  CREATE_COMPANY_WITH_FEATURED_IMAGE,
  DELETE_COMPANY,
  UPDATE_COMPANY,
  UPDATE_COMPANY_WITH_FEATURED_IMAGE,
} from "@/lib/mutations";

/**
 * Convert numeric ID to WPGraphQL global ID
 */
function toGlobalId(type, id) {
  return Buffer.from(`${type}:${id}`).toString("base64");
}

/**
 * Parse featured image ID safely
 */
function parseFeaturedImageId(raw) {
  if (!raw) return null;
  const parsed = Number.parseInt(String(raw), 10);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

/**
 * Create a new company
 */
export async function createCompany(formData) {
  const title = formData.get("title")?.trim();
  if (!title) throw new Error("Title is required");

  const featuredImageId = parseFeaturedImageId(formData.get("featuredImageId"));

  try {
    if (featuredImageId) {
      // Try mutation with featured image
      await fetchGraphQL(
        CREATE_COMPANY_WITH_FEATURED_IMAGE,
        { title, featuredImageId },
        { auth: true }
      );
    } else {
      // Mutation without featured image
      await fetchGraphQL(
        CREATE_COMPANY,
        { title },
        { auth: true }
      );
    }

    revalidatePath("/company");
    redirect("/company");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    // Fallback if WPGraphQL schema does not support featuredImageId
    if (featuredImageId && message.toLowerCase().includes("featuredimageid")) {
      await fetchGraphQL(CREATE_COMPANY, { title }, { auth: true });
      revalidatePath("/company");
      redirect("/company");
    } else {
      console.error("Create company failed:", error);
      throw new Error("Could not create company");
    }
  }
}

/**
 * Update an existing company
 */
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

    revalidatePath("/company");
    redirect("/company");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (featuredImageId && message.toLowerCase().includes("featuredimageid")) {
      await fetchGraphQL(
        UPDATE_COMPANY,
        { id: globalId, title },
        { auth: true }
      );
      revalidatePath("/company");
      redirect("/company");
    } else {
      console.error("Update company failed:", error);
      throw new Error("Could not update company");
    }
  }
}

/**
 * Delete a company
 */
export async function deleteCompany(formData) {
  const id = formData.get("id");
  if (!id) throw new Error("Company ID is required");

  const globalId = toGlobalId("company", id);

  try {
    await fetchGraphQL(DELETE_COMPANY, { id: globalId }, { auth: true });
    revalidatePath("/company");
    redirect("/company");
  } catch (error) {
    console.error("Delete company failed:", error);
    throw new Error("Could not delete company");
  }
}