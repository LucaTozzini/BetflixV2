import { ScrollView, StyleSheet, Text, View } from "react-native";
import useSocket from "../../hooks/useSocket";
import { useContext, useEffect, useRef, useState } from "react";
import { Button, Div, P } from "../../components/elements";
import ThemeContext from "../../contexts/themeContext";
import Ionicons from "@expo/vector-icons/Ionicons";

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
    <Div>
      <View style={[styles.top, { borderColor: theme.colorDim }]}>
        <Text
          style={{
            fontSize: theme.h1Size,
            fontWeight: "bold",
            color: theme.color,
          }}
        >
          {connections} Active Connection{connections > 1 ? "s" : ""}
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Button grow onPress={() => handleSend("scan")}>
            <Ionicons color={theme.color} size={20} name="eye-outline" />
            <P>Scan</P>
          </Button>

          <Button grow onPress={() => handleSend("autolink")}>
            <Ionicons color={theme.color} size={20} name="link-outline" />
            <P>Autolink</P>
          </Button>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Button grow onPress={() => handleSend("create")}>
            <Ionicons color={theme.color} size={20} name="hammer-outline" />
            <P>Create</P>
          </Button>

          <Button grow onPress={() => handleSend("purge")}>
            <Ionicons color={theme.color} size={20} name="trash-outline" />
            <P>Purge</P>
          </Button>
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
    </Div>
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
