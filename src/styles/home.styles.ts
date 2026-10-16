import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 110 },
  avatar: { width: 43, height: 43, borderRadius: 15, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center" },
  searchBox: { height: 54, backgroundColor: COLORS.surface, borderRadius: 17, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 11, marginTop: 25 },
  searchPlaceholder: { color: COLORS.muted, fontSize: 14, flex: 1 },
  searchShortcut: { backgroundColor: COLORS.surfaceMuted, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 5 },
  searchShortcutText: { color: COLORS.muted, fontSize: 10, fontWeight: "700" },
  sectionHeading: { marginTop: 28, marginBottom: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { color: COLORS.ink, fontSize: 18, fontWeight: "700", letterSpacing: -0.4 },
  sectionCaption: { color: COLORS.muted, fontSize: 11, marginTop: 4 },
  addButton: { height: 38, borderRadius: 12, backgroundColor: COLORS.ink, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 5 },
  addButtonText: { color: COLORS.white, fontSize: 12, fontWeight: "700" },
  filters: { gap: 8, paddingBottom: 2 },
  filterChip: { borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 15, paddingVertical: 9, backgroundColor: COLORS.surface },
  filterChipActive: { backgroundColor: COLORS.accentSoft, borderColor: COLORS.accentSoft },
  filterText: { color: COLORS.text, fontSize: 12, fontWeight: "600" },
  filterTextActive: { color: COLORS.ink },
  noteGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 },
  bottomSpace: { height: 25 },
  fab: { position: "absolute", right: 23, bottom: 24, width: 58, height: 58, borderRadius: 20, backgroundColor: COLORS.ink, alignItems: "center", justifyContent: "center", elevation: 5, shadowColor: COLORS.shadow, shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 5 } },
});
