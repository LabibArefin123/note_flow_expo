import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { COLORS } from "@/constants/colors";
import { getNote, removeNote, saveNote, updateNote } from "@/database/notes";
import { styles } from "@/styles/editor.styles";

const CATEGORIES = ["Personal", "Work", "Ideas", "Study"];

const EMPTY_NOTE = {
  title: "",
  content: "",
  category: "Personal",
  tags: "",
  favorite: false,
  pinned: false,
};

export default function NoteEditorScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const isNew = id === "new";
  const isValidId = typeof id === "string" && id.trim().length > 0;

  const db = useSQLiteContext();
  const router = useRouter();

  const [title, setTitle] = useState(EMPTY_NOTE.title);
  const [content, setContent] = useState(EMPTY_NOTE.content);
  const [category, setCategory] = useState(EMPTY_NOTE.category);
  const [tags, setTags] = useState(EMPTY_NOTE.tags);
  const [favorite, setFavorite] = useState(EMPTY_NOTE.favorite);
  const [pinned, setPinned] = useState(EMPTY_NOTE.pinned);

  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const saveLock = useRef(false);
  const deleteLock = useRef(false);

  useEffect(() => {
    let active = true;

    const loadNote = async () => {
      setLoaded(false);

      setTitle(EMPTY_NOTE.title);
      setContent(EMPTY_NOTE.content);
      setCategory(EMPTY_NOTE.category);
      setTags(EMPTY_NOTE.tags);
      setFavorite(EMPTY_NOTE.favorite);
      setPinned(EMPTY_NOTE.pinned);

      if (!isValidId) {
        Alert.alert("Invalid note", "The requested note ID is missing.", [
          { text: "OK", onPress: () => router.back() },
        ]);
        return;
      }

      if (isNew) {
        setLoaded(true);
        return;
      }

      try {
        const note = await getNote(db, id);

        if (!active) return;

        if (!note) {
          Alert.alert("Note not found", "This note may have been deleted.", [
            { text: "OK", onPress: () => router.back() },
          ]);
          return;
        }

        setTitle(note.title ?? "");
        setContent(note.content ?? "");
        setCategory(note.category ?? "Personal");
        setTags(note.tags ?? "");
        setFavorite(Boolean(note.favorite));
        setPinned(Boolean(note.pinned));

        setLoaded(true);
      } catch (error) {
        console.error("Note loading error:", error);

        if (active) {
          Alert.alert(
            "Loading failed",
            "Unable to load this note. Please try again.",
            [{ text: "OK", onPress: () => router.back() }],
          );
        }
      }
    };

    loadNote();

    return () => {
      active = false;
    };
  }, [db, id, isNew, isValidId, router]);

  const handleSave = async () => {
    if (saveLock.current || saving || deleting || !loaded || !isValidId) {
      return;
    }

    if (!title.trim() && !content.trim()) {
      Alert.alert("Nothing to save", "Add a title or some content first.");
      return;
    }

    const payload = {
      title: title.trim() || "Untitled note",
      content,
      category,
      tags: tags.trim(),
      favorite,
      pinned,
    };

    saveLock.current = true;
    setSaving(true);

    try {
      if (isNew) {
        await saveNote(db, payload);
      } else {
        await updateNote(db, id, payload);
      }

      // Reset the saving state before leaving the editor.
      setSaving(false);
      saveLock.current = false;

      router.back();
    } catch (error) {
      console.error("Note saving error:", error);

      Alert.alert(
        "Save failed",
        "Your note could not be saved. Please try again.",
      );
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (isNew || !isValidId || saving || deleting || deleteLock.current) {
      return;
    }

    Alert.alert("Delete note?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (deleteLock.current) return;

          deleteLock.current = true;
          setDeleting(true);

          try {
            await removeNote(db, id);
            setDeleting(false);
            router.back();
          } catch (error) {
            console.error("Note deletion error:", error);

            Alert.alert("Delete failed", "Unable to delete this note.");
          } finally {
            deleteLock.current = false;
            setDeleting(false);
          }
        },
      },
    ]);
  };

  const insertFormat = (before: string, after = "") => {
    setContent((current) => {
      return `${current}${current ? "\n" : ""}${before}${after}`;
    });
  };

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Opening your note...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.iconButton}
          disabled={saving || deleting}
        >
          <Ionicons name="chevron-back" size={23} color={COLORS.ink} />
        </Pressable>

        <Text style={styles.topBarLabel}>
          {isNew ? "NEW NOTE" : "EDIT NOTE"}
        </Text>

        <View style={styles.topActions}>
          {!isNew && (
            <Pressable
              onPress={handleDelete}
              disabled={deleting || saving}
              style={styles.iconButton}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.muted} />
            </Pressable>
          )}

          <Pressable
            onPress={handleSave}
            disabled={saving || deleting}
            style={styles.saveButton}
          >
            <Text style={styles.saveText}>{saving ? "Saving..." : "Save"}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.editorContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.metaLine}>
          <View style={styles.categoryBadge}>
            <View style={styles.categoryDot} />
            <Text style={styles.categoryBadgeText}>{category}</Text>
          </View>

          <View style={styles.metaActions}>
            <Pressable
              onPress={() => setPinned((value) => !value)}
              style={styles.metaButton}
              disabled={saving}
            >
              <Ionicons
                name={pinned ? "pin" : "pin-outline"}
                size={18}
                color={pinned ? COLORS.accent : COLORS.muted}
              />
            </Pressable>

            <Pressable
              onPress={() => setFavorite((value) => !value)}
              style={styles.metaButton}
              disabled={saving}
            >
              <Ionicons
                name={favorite ? "heart" : "heart-outline"}
                size={18}
                color={favorite ? COLORS.danger : COLORS.muted}
              />
            </Pressable>
          </View>
        </View>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Give your note a title"
          placeholderTextColor={COLORS.placeholder}
          style={styles.titleInput}
          multiline
          editable={!saving}
        />

        <View style={styles.editorDivider} />

        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Start writing your thoughts..."
          placeholderTextColor={COLORS.placeholder}
          style={styles.bodyInput}
          multiline
          textAlignVertical="top"
          editable={!saving}
        />

        <View style={styles.formatToolbar}>
          <FormatButton
            label="B"
            bold
            onPress={() => insertFormat("**", "**")}
          />

          <FormatButton
            label="I"
            italic
            onPress={() => insertFormat("_", "_")}
          />

          <FormatButton label="H1" onPress={() => insertFormat("# ")} />

          <FormatButton label="• List" onPress={() => insertFormat("• ")} />

          <FormatButton label="—" onPress={() => insertFormat("—")} />
        </View>

        <Text style={styles.fieldLabel}>CATEGORY</Text>

        <View style={styles.categoryOptions}>
          {CATEGORIES.map((item) => (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              disabled={saving}
              style={[
                styles.categoryOption,
                category === item && styles.categoryOptionActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryOptionText,
                  category === item && styles.categoryOptionTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.fieldLabel}>TAGS</Text>

        <TextInput
          value={tags}
          onChangeText={setTags}
          placeholder="e.g. ideas, planning, important"
          placeholderTextColor={COLORS.placeholder}
          style={styles.tagsInput}
          editable={!saving}
        />

        <Text style={styles.helperText}>Separate tags with commas.</Text>
      </ScrollView>
    </View>
  );
}

function FormatButton({
  label,
  onPress,
  bold,
  italic,
}: {
  label: string;
  onPress: () => void;
  bold?: boolean;
  italic?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={styles.formatButton}>
      <Text
        style={[
          styles.formatText,
          bold && { fontWeight: "800" },
          italic && { fontStyle: "italic" },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
