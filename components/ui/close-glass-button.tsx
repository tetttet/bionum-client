import React from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const CloseGlassButton = ({ closeSheet }: { closeSheet: () => void }) => {
  return (
    <TouchableOpacity
      onPress={closeSheet}
      style={styles.closeButton}
      accessibilityRole="button"
      accessibilityLabel="Close"
    >
      <View style={styles.closeInner}>
        <Text style={styles.closeText}>✕</Text>
      </View>
    </TouchableOpacity>
  );
};

// ---------- Styles (iOS-inspired rounded corners, soft shadows) ----------
const styles = StyleSheet.create({
  modalRoot: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
  },
  modalImage: { width: "100%", height: 220 },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "transparent",
  },
  closeInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
    }),
  },
  closeText: { fontSize: 18, fontWeight: "700" },
});

export default CloseGlassButton;
