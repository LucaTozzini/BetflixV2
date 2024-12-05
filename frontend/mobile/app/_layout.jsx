import { Slot } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import NavBar from "../components/nav";

export default () => {
  return (
    <>
      <View style={styles.slotContainer}>
        <Slot />
      </View>
      <NavBar />
    </>
  );
};

const styles = StyleSheet.create({
  slotContainer: {
    flex: 1,
  },
});
