import { StyleSheet, Text, View } from "react-native";

// clean placeholder home screen
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CollaPub Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0D12",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 24,
    color: "#F5F7FA",
  },
});
