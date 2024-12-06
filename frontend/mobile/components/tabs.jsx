import { useState } from "react";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Tabs() {
  const [selected, setSelected] = useState(0);

  const Tab = ({tabId, href, iconName, selectedIconName}) => (
    <TouchableOpacity
      onPress={() => {
        router.push(href);
        setSelected(tabId);
      }}
      style={styles.tab}
    >
      <Ionicons
        name={selected === tabId ? selectedIconName : iconName}
        size={32}
        color={selected ===tabId ? "black" : "grey"}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Tab tabId={0} href="/" iconName="home-outline" selectedIconName="home-sharp"/>
      <Tab tabId={1} href="/console" iconName="terminal-outline" selectedIconName="terminal-sharp"/>
      <Tab tabId={2} href="/search" iconName="search-outline" selectedIconName="search-sharp"/>
      <Tab tabId={3} href="/downloads" iconName="download-outline" selectedIconName="download-sharp"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    borderTopColor: "grey",
    borderTopWidth: 1,
  },
  tab: {
    padding: 10,
  },
});
