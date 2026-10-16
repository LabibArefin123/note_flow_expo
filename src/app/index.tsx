import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

import { COLORS } from "@/constants/colors";
import { getNotes } from "@/database/notes";
import { styles } from "@/styles/notes.styles";

import type { Note } from "@/types/note.types";

const CATEGORY_COLORS: Record<string, string> = {
  Personal: "#8B7CF6",
  Work: "#4D9DE0",
  Ideas: "#E5A84B",
  Study: "#42A58A",
};

export default function NotesScreen() {
  const db = useSQLiteContext();
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getNotes(db);
      setNotes(result);
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes]),
  );

  const createNote = () => {
    router.push({
      pathname: "/note/[id]",
      params: { id: "new" },
    });
  };

  const openNote = (id: string) => {
    router.push({
      pathname: "/note/[id]",
      params: { id },
    });
  };

  const renderNote = ({ item }: { item: Note }) => {
    const categoryColor = CATEGORY_COLORS[item.category] ?? COLORS.accent;

    return (
      <Pressable style={styles.noteCard} onPress={() => openNote(item.id)}>
        {/* Card header */}
        <View style={styles.noteCardTop}>
          <View style={styles.noteCategory}>
            <View
              style={[styles.noteDot, { backgroundColor: categoryColor }]}
            />

            <Text style={styles.noteCategoryText}>{item.category}</Text>
          </View>

          <View style={styles.noteCardIcons}>
            {item.pinned && (
              <Ionicons name="pin" size={14} color={COLORS.accent} />
            )}

            {item.favorite && (
              <Ionicons name="heart" size={14} color={COLORS.danger} />
            )}
          </View>
        </View>

        {/* Card content */}
        <View>
          <Text style={styles.noteTitle} numberOfLines={2}>
            {item.title || "Untitled note"}
          </Text>

          <Text style={styles.notePreview} numberOfLines={4}>
            {item.content || "No additional content"}
          </Text>
        </View>

        {/* Card footer */}
        <View style={styles.noteCardFooter}>
          <View style={styles.tagList}>
            {item.tags
              ?.split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
              .slice(0, 2)
              .map((tag, index) => (
                <Text
                  key={`${tag}-${index}`}
                  style={styles.noteTag}
                  numberOfLines={1}
                >
                  #{tag}
                </Text>
              ))}
          </View>

          <Text style={styles.noteDate} numberOfLines={1}>
            {item.updated_at
              ? new Date(item.updated_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })
              : ""}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderNote}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 12,
        }}
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
        onRefresh={loadNotes}
        refreshing={loading}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={styles.resultLabel}>YOUR WORKSPACE</Text>

                <Text
                  style={{
                    color: COLORS.ink,
                    fontSize: 28,
                    fontWeight: "800",
                    letterSpacing: -0.8,
                  }}
                >
                  My Notes
                </Text>

                <Text
                  style={{
                    color: COLORS.muted,
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  Capture your thoughts and ideas.
                </Text>
              </View>

              <Pressable
                onPress={createNote}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 15,
                  backgroundColor: COLORS.ink,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="add" size={25} color={COLORS.white} />
              </Pressable>
            </View>

            {/* Note count */}
            <Text style={styles.resultLabel}>
              {notes.length} {notes.length === 1 ? "NOTE" : "NOTES"}
            </Text>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View
              style={{
                paddingVertical: 55,
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
          ) : (
            <View style={styles.tipCard}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 15,
                  backgroundColor: COLORS.accentSoft,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="document-text-outline"
                  size={25}
                  color={COLORS.accent}
                />
              </View>

              <Text style={styles.tipTitle}>Start with your first note</Text>

              <Text style={styles.tipText}>
                Keep your thoughts, ideas, and important information organized
                in one place.
              </Text>

              <Pressable
                onPress={createNote}
                style={{
                  backgroundColor: COLORS.ink,
                  borderRadius: 12,
                  paddingHorizontal: 17,
                  paddingVertical: 11,
                  alignSelf: "flex-start",
                  marginTop: 16,
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 12,
                    fontWeight: "700",
                  }}
                >
                  Create your first note
                </Text>
              </Pressable>
            </View>
          )
        }
        ListFooterComponent={<View style={{ height: 25 }} />}
      />
    </View>
  );
}
