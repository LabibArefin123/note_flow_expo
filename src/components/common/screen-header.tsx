import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { styles } from "@/styles/components.styles";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function ScreenHeader({ eyebrow, title, subtitle, action }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.headerTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      {action}
    </View>
  );
}
