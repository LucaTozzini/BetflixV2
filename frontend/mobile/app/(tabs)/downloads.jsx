import { ScrollView, Text, View } from "react-native";
import useSocket from "../../hooks/useSocket";
import { useContext, useEffect, useState } from "react";
import secToString from "../../helpers/secToString";
import ThemeContext from "../../contexts/themeContext";
import { Div, H2, H3, P } from "../../components/elements";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBarFill } from "../../components/ui";

export default () => {
  const theme = useContext(ThemeContext);
  const [data, setData] = useState(null);
  const socket = useSocket("/downloads");
  useEffect(() => {
    setData(JSON.parse(socket.msg));
  }, [socket.msg]);

  const Item = ({ name, progress, timeRemaining }) => (
    <View
      style={{
        padding: 20,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: theme.colorDim,
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 17, color: theme.color }}>{name}</Text>
      <Text style={{ color: theme.color }}>
        {secToString(timeRemaining, true)}
      </Text>
      <View
        style={{
          borderRadius: 100,
          overflow: "hidden",
          backgroundColor: theme.color,
        }}
      >
        <View
          style={{
            height: 5,
            width: progress * 100 + "%",
            backgroundColor: theme.accentColor,
          }}
        />
      </View>
    </View>
  );

  if (!data?.length)
    return (
      <Div pad>
        <StatusBarFill />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 20 }}
        >
          <P center>Active Downloads Will Appear Here</P>
          <Ionicons name="file-tray-outline" style={{textAlign: "center"}} color={theme.color} size={40} />
        </View>
      </Div>
    );

  return (
    <Div>
      <StatusBarFill />
      <ScrollView
        contentContainerStyle={{
          marginHorizontal: 10,
          marginVertical: 20,
          gap: 10,
        }}
      >
        {data?.map((i) => (
          <Item
            key={i.name}
            name={i.name}
            progress={i.progress}
            timeRemaining={i.timeRemaining / 1000}
          />
        ))}
      </ScrollView>
    </Div>
  );
};
