import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { COLORS } from "@/constants/colors";
import { styles } from "@/styles/notes.styles";
import type { Note } from "@/types/note.types";

const CATEGORY_COLORS: Record<string, string> = {
  Personal: "#C49A6C",
  Work: "#8295A8",
  Ideas: "#A28CB9",
  Study: "#86A58B",
};

export function NoteCard({ note, onPress }: { note: Note; onPress: () => void }) {
  const tags = note.tags.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 2);
  const date = new Date(note.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.noteCard, pressed && styles.noteCardPressed]}>
      <View style={styles.noteCardTop}>
        <View style={styles.noteCategory}><View style={[styles.noteDot, { backgroundColor: CATEGORY_COLORS[note.category] ?? COLORS.accent }]} /><Text style={styles.noteCategoryText}>{note.category}</Text></View>
        <View style={styles.noteCardIcons}>
          {note.pinned ? <Ionicons name="pin" size={14} color={COLORS.accent} /> : null}
          {note.favorite ? <Ionicons name="heart" size={14} color={COLORS.danger} /> : null}
        </View>
      </View>
      <Text numberOfLines={2} style={styles.noteTitle}>{note.title || "Untitled note"}</Text>
      <Text numberOfLines={3} style={styles.notePreview}>{note.content.replace(/[#*_•]/g, "").trim() || "No additional text"}</Text>
      <View style={styles.noteCardFooter}>
        <View style={styles.tagList}>{tags.map((tag) => <Text key={tag} style={styles.noteTag}>#{tag}</Text>)}</View>
        <Text style={styles.noteDate}>{date}</Text>
      </View>
    </Pressable>
  );
}
