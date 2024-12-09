import { ScrollView, StyleSheet, Text, View } from "react-native";
import useSocket from "../../hooks/useSocket";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "../../components/buttons";
import ThemeContext from "../../contexts/themeContext";

export default () => {
  const theme = useContext(ThemeContext);
  const scrollRef = useRef(null);
  const socket = useSocket("/");
  const [connections, setConnections] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket.msg) {
      const json = JSON.parse(socket.msg);
      setConnections(json.connections);
      if (json.console) {
        setMessages([...messages.splice(-60), json.console]);
      }
    }
  }, [socket.msg]);

  function handleSend(command) {
    if (socket.open) {
      socket.send(command);
    }
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <View style={[styles.top, {borderColor: theme.colorDim}]}>
        <Text style={{ fontSize: theme.h1Size, fontWeight: "bold", color: theme.color }}>
          {connections} Active Connection{connections > 1 ? "s" : ""}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Button text="Scan" handlePress={() => handleSend("scan")} />
          <Button text="Create" handlePress={() => handleSend("create")} />
          <Button text="Purge" handlePress={() => handleSend("purge")} />
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages?.map((message, index) => (
          <Text key={index} style={{ color: "chartreuse", fontSize: 15 }}>
            {message}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  top: { padding: 10, gap: 10, borderBottomWidth: 1 },
  scroll: {
    backgroundColor: "rgb(50,50,50)",
    flexGrow: 1,
    padding: 10,
    paddingBottom: 20,
  },
});
