import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";

export const globalStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  page: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 36 },
  row: { flexDirection: "row", alignItems: "center" },
  muted: { color: COLORS.muted },
  divider: { height: 1, backgroundColor: COLORS.border },
});
