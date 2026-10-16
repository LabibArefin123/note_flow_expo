import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { NoteCard } from "@/components/notes/note-card";
import { ScreenHeader } from "@/components/common/screen-header";
import { EmptyState } from "@/components/common/empty-state";
import { COLORS } from "@/constants/colors";
import { getNotes } from "@/database/notes";
import { styles } from "@/styles/home.styles";
import type { Note } from "@/types/note.types";

const FILTERS = ["All", "Personal", "Work", "Ideas", "Study"];

export default function HomeScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filter, setFilter] = useState("All");

  const loadNotes = useCallback(async () => {
    setNotes(await getNotes(db));
  }, [db]);

  useFocusEffect(useCallback(() => { loadNotes(); }, [loadNotes]));

  const visibleNotes = notes.filter((note) => filter === "All" || note.category === filter);
  const pinnedNotes = visibleNotes.filter((note) => note.pinned);
  const recentNotes = visibleNotes.filter((note) => !note.pinned).slice(0, 12);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="YOUR PERSONAL SPACE"
          title="Good morning"
          subtitle="Capture what matters today."
          action={<Pressable style={styles.avatar} onPress={() => router.push("/settings")}><Ionicons name="person-outline" size={19} color={COLORS.ink} /></Pressable>}
        />

        <Pressable style={styles.searchBox} onPress={() => router.push("/explore")}>
          <Ionicons name="search-outline" size={19} color={COLORS.muted} />
          <Text style={styles.searchPlaceholder}>Search your notes...</Text>
          <View style={styles.searchShortcut}><Text style={styles.searchShortcutText}>⌘ K</Text></View>
        </Pressable>

        <View style={styles.sectionHeading}>
          <View><Text style={styles.sectionTitle}>Your collection</Text><Text style={styles.sectionCaption}>{notes.length} notes saved</Text></View>
          <Pressable onPress={() => router.push("/note/new")} style={styles.addButton}>
            <Ionicons name="add" size={20} color={COLORS.white} /><Text style={styles.addButtonText}>New note</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {FILTERS.map((item) => (
            <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filterChip, filter === item && styles.filterChipActive]}>
              <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {pinnedNotes.length > 0 && <>
          <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Pinned</Text><Ionicons name="pin" size={16} color={COLORS.accent} /></View>
          <View style={styles.noteGrid}>
            {pinnedNotes.map((note) => <NoteCard key={note.id} note={note} onPress={() => router.push(`/note/${note.id}`)} />)}
          </View>
        </>}

        <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Recent notes</Text><Text style={styles.sectionCaption}>Recently updated</Text></View>
        {recentNotes.length ? (
          <View style={styles.noteGrid}>
            {recentNotes.map((note) => <NoteCard key={note.id} note={note} onPress={() => router.push(`/note/${note.id}`)} />)}
          </View>
        ) : (
          <EmptyState icon="document-text-outline" title="Your space is clear" message="Create your first note and start collecting your thoughts." actionLabel="Create a note" onAction={() => router.push("/note/new")} />
        )}
        <View style={styles.bottomSpace} />
      </ScrollView>
      <Pressable accessibilityRole="button" accessibilityLabel="Create note" style={styles.fab} onPress={() => router.push("/note/new")}>
        <Ionicons name="add" size={28} color={COLORS.white} />
      </Pressable>
    </View>
  );
}
