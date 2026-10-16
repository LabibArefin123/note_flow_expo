export type Note = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string;
  favorite: boolean;
  pinned: boolean;
  created_at: string;
  updated_at: string;
};

export type NoteInput = Pick<Note, "title" | "content" | "category" | "tags" | "favorite" | "pinned">;
