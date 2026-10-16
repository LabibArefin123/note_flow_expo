import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { COLORS } from "@/constants/colors";
import { styles } from "@/styles/components.styles";

type Props = { icon: keyof typeof Ionicons.glyphMap; title: string; message: string; actionLabel?: string; onAction?: () => void };

export function EmptyState({ icon, title, message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}><Ionicons name={icon} size={29} color={COLORS.accent} /></View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
      {!!actionLabel && !!onAction && <Pressable onPress={onAction} style={styles.emptyAction}><Text style={styles.emptyActionText}>{actionLabel}</Text></Pressable>}
    </View>
  );
}
