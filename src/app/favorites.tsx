import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";

import { EmptyState } from "@/components/common/empty-state";
import { ScreenHeader } from "@/components/common/screen-header";
import { NoteCard } from "@/components/notes/note-card";
import { getNotes } from "@/database/notes";
import { styles } from "@/styles/notes.styles";
import type { Note } from "@/types/note.types";

export default function FavoritesScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const load = useCallback(async () => setNotes((await getNotes(db)).filter((note) => note.favorite)), [db]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.pageContent}>
        <ScreenHeader eyebrow="YOUR SHORTLIST" title="Favorites" subtitle="The notes you want close at hand." />
        {notes.length ? <View style={styles.searchResults}>{notes.map((note) => <NoteCard key={note.id} note={note} onPress={() => router.push(`/note/${note.id}`)} />)}</View> : <EmptyState icon="heart-outline" title="Nothing saved yet" message="Tap the heart on a note to keep it in your favorites." />}
      </ScrollView>
    </View>
  );
}
