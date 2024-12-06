import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import Tabs from "../components/tabs";

export default () => {
  return (
    <>
      <View style={styles.slotContainer}>
        <Slot />
      </View>
      <Tabs />
    </>
  );
};

const styles = StyleSheet.create({
  slotContainer: {
    flex: 1,
  },
});
