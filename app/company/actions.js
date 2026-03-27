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

function parseFeaturedImageId(raw) {
  if (!raw) return null;
  const parsed = Number.parseInt(String(raw), 10);
  if (Number.isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

export async function createCompany(formData) {
  const title = formData.get("title");
  if (!title || String(title).trim() === "") {
    return;
  }

  const featuredImageId = parseFeaturedImageId(formData.get("featuredImageId"));

  if (featuredImageId) {
    try {
      await fetchGraphQL(
        CREATE_COMPANY_WITH_FEATURED_IMAGE,
        { title: String(title).trim(), featuredImageId },
        { auth: true },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // Some WPGraphQL schemas don't expose featuredImageId on custom post type mutations.
      if (!message.toLowerCase().includes("featuredimageid")) throw error;
      await fetchGraphQL(
        CREATE_COMPANY,
        { title: String(title).trim() },
        { auth: true },
      );
    }
  } else {
    await fetchGraphQL(
      CREATE_COMPANY,
      { title: String(title).trim() },
      { auth: true },
    );
  }

  revalidatePath("/company");
  redirect("/company");
}

export async function updateCompany(id, formData) {
  const title = formData.get("title");
  if (!title || String(title).trim() === "") {
    return;
  }

  const featuredImageId = parseFeaturedImageId(formData.get("featuredImageId"));

  if (featuredImageId !== null) {
    try {
      await fetchGraphQL(
        UPDATE_COMPANY_WITH_FEATURED_IMAGE,
        { id, title: String(title).trim(), featuredImageId },
        { auth: true },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.toLowerCase().includes("featuredimageid")) throw error;
      await fetchGraphQL(
        UPDATE_COMPANY,
        { id, title: String(title).trim() },
        { auth: true },
      );
    }
  } else {
    await fetchGraphQL(
      UPDATE_COMPANY,
      { id, title: String(title).trim() },
      { auth: true },
    );
  }

  revalidatePath("/company");
  redirect("/company");
}

export async function deleteCompany(formData) {
  const id = formData.get("id");
  if (!id) return;

  try {
    // 1. Perform the operation
    await fetchGraphQL(DELETE_COMPANY, { id }, { auth: true });
    
    // 2. Clear the cache
    revalidatePath("/company");
  } catch (error) {
    // 3. Log the error for yourself in Vercel Logs
    console.error("Delete failed:", error);
    
    // 4. Return an error instead of crashing the server
    return { error: "Could not delete company." };
  }

  // 5. REDIRECT OUTSIDE THE TRY/CATCH
  redirect("/company");
}
