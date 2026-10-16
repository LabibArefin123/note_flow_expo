import { Ionicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { ScreenHeader } from "@/components/common/screen-header";
import { COLORS } from "@/constants/colors";
import { deleteAllNotes } from "@/database/notes";
import { styles } from "@/styles/components.styles";

export default function SettingsScreen() {
  const db = useSQLiteContext();

  const confirmClear = () => Alert.alert(
    "Delete all notes?",
    "This permanently removes every note stored on this device.",
    [{ text: "Cancel", style: "cancel" }, { text: "Delete all", style: "destructive", onPress: () => deleteAllNotes(db) }]
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.settingsContent}>
      <ScreenHeader eyebrow="MAKE IT YOURS" title="Settings" subtitle="A calm space, your way." />
      <View style={styles.profilePanel}>
        <View style={styles.profileIcon}><Ionicons name="person-outline" size={25} color={COLORS.ink} /></View>
        <View style={{ flex: 1 }}><Text style={styles.profileName}>NoteFlow</Text><Text style={styles.profileSub}>Your personal notes space</Text></View>
        <Ionicons name="sparkles" size={20} color={COLORS.accent} />
      </View>
      <Text style={styles.settingsSection}>PREFERENCES</Text>
      <View style={styles.settingsGroup}>
        <SettingRow icon="color-palette-outline" title="Appearance" subtitle="Warm minimal theme" />
        <SettingRow icon="cloud-outline" title="Storage" subtitle="Notes are saved on this device" />
        <SettingRow icon="lock-closed-outline" title="Privacy" subtitle="Local-first storage" last />
      </View>
      <Text style={styles.settingsSection}>DATA</Text>
      <View style={styles.settingsGroup}>
        <SettingRow icon="information-circle-outline" title="About NoteFlow" subtitle="Version 1.0.0" last />
      </View>
      <Pressable onPress={confirmClear} style={styles.dangerRow}>
        <Ionicons name="trash-outline" size={19} color={COLORS.danger} />
        <Text style={styles.dangerText}>Delete all notes</Text>
      </Pressable>
      <Text style={styles.versionText}>Made for thoughts worth keeping.</Text>
    </ScrollView>
  );
}

function SettingRow({ icon, title, subtitle, last }: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; last?: boolean }) {
  return (
    <View style={[styles.settingRow, last && styles.settingRowLast]}>
      <View style={styles.settingIcon}><Ionicons name={icon} size={19} color={COLORS.ink} /></View>
      <View style={{ flex: 1 }}><Text style={styles.settingTitle}>{title}</Text><Text style={styles.settingSubtitle}>{subtitle}</Text></View>
      <Ionicons name="chevron-forward" size={17} color={COLORS.muted} />
    </View>
  );
}
