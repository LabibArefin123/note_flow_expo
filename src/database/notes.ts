import type { SQLiteDatabase } from "expo-sqlite";
import * as Crypto from "expo-crypto";

import type { Note, NoteInput } from "@/types/note.types";

type NoteRow = Omit<Note, "favorite" | "pinned"> & { favorite: number; pinned: number };

function mapNote(row: NoteRow): Note {
  return { ...row, favorite: Boolean(row.favorite), pinned: Boolean(row.pinned) };
}

export async function getNotes(db: SQLiteDatabase): Promise<Note[]> {
  const rows = await db.getAllAsync<NoteRow>("SELECT * FROM notes ORDER BY pinned DESC, updated_at DESC");
  return rows.map(mapNote);
}

export async function getNote(db: SQLiteDatabase, id: string): Promise<Note | null> {
  const row = await db.getFirstAsync<NoteRow>("SELECT * FROM notes WHERE id = ?", id);
  return row ? mapNote(row) : null;
}

export async function saveNote(db: SQLiteDatabase, input: NoteInput) {
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO notes (id, title, content, category, tags, favorite, pinned, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    Crypto.randomUUID(), input.title, input.content, input.category, input.tags,
    Number(input.favorite), Number(input.pinned), now, now
  );
}

export async function updateNote(db: SQLiteDatabase, id: string, input: NoteInput) {
  await db.runAsync(
    `UPDATE notes SET title = ?, content = ?, category = ?, tags = ?, favorite = ?, pinned = ?, updated_at = ? WHERE id = ?`,
    input.title, input.content, input.category, input.tags,
    Number(input.favorite), Number(input.pinned), new Date().toISOString(), id
  );
}

export async function removeNote(db: SQLiteDatabase, id: string) {
  await db.runAsync("DELETE FROM notes WHERE id = ?", id);
}

export async function deleteAllNotes(db: SQLiteDatabase) {
  await db.runAsync("DELETE FROM notes");
}
