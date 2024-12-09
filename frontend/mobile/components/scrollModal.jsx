import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function ScrollModal({ showModal, setShowModal, children }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => setShowModal(false)}
      style={styles.modal}
    >
      <Pressable style={styles.container} onPress={() => setShowModal(false)}>
        <Pressable style={styles.content}>
          <View style={styles.top}>
            <View style={styles.lip} />
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
  modal: { backgroundColor: "red" },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    margin: 10,
    backgroundColor: "white",
    height: "50%",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 20,
    paddingBottom: 10,
  },
  top: {
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: "grey",
  },
  lip: {
    borderRadius: 50,
    backgroundColor: "grey",
    height: 7,
    width: 50,
  },
  scroll: { padding: 10 },
});
