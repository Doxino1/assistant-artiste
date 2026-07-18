"use client";

import { createClient } from "./supabase/client";

// Chemin préfixé par l'uuid de l'utilisateur : c'est ce que les policies du
// bucket "images" (migration 0009) vérifient pour autoriser l'écriture.
export async function uploadImage(
  userId: string,
  folder: "portfolio" | "posts" | "bibliotheque",
  file: File
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${userId}/${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("images").upload(path, file);
  if (error) return { url: null, error: error.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("images").getPublicUrl(path);

  return { url: publicUrl, error: null };
}
