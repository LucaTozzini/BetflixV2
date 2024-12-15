import { useContext } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import ThemeContext from "../contexts/themeContext";

export default function ScrollModal({ showModal, setShowModal, children }) {
  const theme = useContext(ThemeContext);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => setShowModal(false)}
    >
      <Pressable style={styles.container} onPress={() => setShowModal(false)}>
        <Pressable style={[styles.content, {backgroundColor: theme.backgroundColor, shadowColor: theme.colorDim}]}>
          <View style={[styles.top, {borderColor: theme.colorDim}]}>
            <View style={[styles.lip, {backgroundColor: theme.colorDim}]} />
          </View>
          <ScrollView contentContainerStyle={styles.scroll}>
            {children}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    margin: 10,
    height: "50%",
    borderRadius: 20,
    overflow: "hidden",
    paddingBottom: 10,
    
    elevation: 20,
  },
  top: {
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.5,
    // borderColor: "grey",
  },
  lip: {
    borderRadius: 50,
    // backgroundColor: "grey",
    height: 4,
    width: 50,
  },
  scroll: { padding: 10, gap: 7 },
});
