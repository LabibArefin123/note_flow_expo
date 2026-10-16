import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { NoteCard } from "@/components/notes/note-card";
import { ScreenHeader } from "@/components/common/screen-header";
import { EmptyState } from "@/components/common/empty-state";
import { COLORS } from "@/constants/colors";
import { getNotes } from "@/database/notes";
import { styles } from "@/styles/notes.styles";
import type { Note } from "@/types/note.types";

export default function SearchScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => setNotes(await getNotes(db)), [db]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return notes.filter((note) =>
      `${note.title} ${note.content} ${note.category} ${note.tags}`.toLowerCase().includes(term)
    );
  }, [notes, query]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.pageContent} keyboardShouldPersistTaps="handled">
        <ScreenHeader eyebrow="FIND ANYTHING" title="Search" subtitle="Your ideas are never far away." />
        <View style={styles.searchInputWrap}>
          <Ionicons name="search-outline" size={20} color={COLORS.muted} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search titles, notes or tags" placeholderTextColor={COLORS.muted} style={styles.searchInput} autoCapitalize="none" returnKeyType="search" />
          {!!query && <Pressable onPress={() => setQuery("")} hitSlop={8}><Ionicons name="close-circle" size={19} color={COLORS.muted} /></Pressable>}
        </View>
        <Text style={styles.resultLabel}>{query ? `${results.length} RESULTS` : "START TYPING TO SEARCH"}</Text>
        {query && results.length ? (
          <View style={styles.searchResults}>{results.map((note) => <NoteCard key={note.id} note={note} onPress={() => router.push(`/note/${note.id}`)} />)}</View>
        ) : query ? (
          <EmptyState icon="search-outline" title="No notes found" message="Try another keyword or search by category." />
        ) : (
          <View style={styles.tipCard}>
            <Ionicons name="sparkles-outline" size={22} color={COLORS.accent} />
            <Text style={styles.tipTitle}>A little search tip</Text>
            <Text style={styles.tipText}>Search across note titles, content, categories, and tags to find exactly what you need.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
