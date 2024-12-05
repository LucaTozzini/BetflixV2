import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function NavBar() {
  return (
    <View style={styles.container}>
      <Link href={"/"} style={styles.link}>
        <Ionicons name="home-outline" size={32} color="grey" />
      </Link>
      <Link href={"/console"} style={styles.link}>
        <Ionicons name="terminal-outline" size={32} color="grey" />
      </Link>
      <Link href={"/downloads"} style={styles.link}>
        <Ionicons name="download-outline" size={32} color="grey" />
      </Link>
      <Link href={"/search"} style={styles.link}>
        <Ionicons name="search-outline" size={32} color="grey" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    borderTopColor: "grey",
    borderTopWidth: .5
  },
  link: {
    padding: 10,
  },
});
