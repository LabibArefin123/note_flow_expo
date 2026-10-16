import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  pageContent: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 40 },
  searchInputWrap: { minHeight: 56, backgroundColor: COLORS.surface, borderRadius: 17, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", gap: 10, marginTop: 24 },
  searchInput: { flex: 1, color: COLORS.ink, fontSize: 14, paddingVertical: 14 },
  resultLabel: { color: COLORS.muted, fontSize: 10, fontWeight: "800", letterSpacing: 1.2, marginTop: 25, marginBottom: 14 },
  searchResults: { gap: 12 },
  tipCard: { backgroundColor: COLORS.surface, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 20, marginTop: 10 },
  tipTitle: { color: COLORS.ink, fontSize: 15, fontWeight: "700", marginTop: 13 },
  tipText: { color: COLORS.muted, fontSize: 13, lineHeight: 20, marginTop: 6 },
  noteCard: { width: "48.2%", minHeight: 190, backgroundColor: COLORS.surface, borderRadius: 19, borderWidth: 1, borderColor: COLORS.border, padding: 14, justifyContent: "space-between" },
  noteCardPressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
  noteCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  noteCategory: { flexDirection: "row", alignItems: "center", gap: 6 },
  noteDot: { width: 6, height: 6, borderRadius: 3 },
  noteCategoryText: { color: COLORS.muted, fontSize: 10, fontWeight: "700" },
  noteCardIcons: { flexDirection: "row", gap: 6 },
  noteTitle: { color: COLORS.ink, fontSize: 15, lineHeight: 20, fontWeight: "700", marginTop: 17 },
  notePreview: { color: COLORS.muted, fontSize: 11, lineHeight: 17, marginTop: 7, flex: 1 },
  noteCardFooter: { borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 13, paddingTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tagList: { flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 5 },
  noteTag: { color: COLORS.accent, fontSize: 9, fontWeight: "700" },
  noteDate: { color: COLORS.muted, fontSize: 9 },
});
