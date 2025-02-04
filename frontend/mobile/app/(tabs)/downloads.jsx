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
        padding: 15,
        borderWidth: 0.5,
        borderRadius: 7,
        borderColor: theme.colorDim,
        gap: 10,
      }}
    >
      <H3>{name}</H3>
      <P>{secToString(timeRemaining, true)}</P>
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
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <P center>Active Downloads Will Appear Here</P>
          <Ionicons
            name="file-tray-outline"
            style={{ textAlign: "center" }}
            color={theme.color}
            size={40}
          />
        </View>
      </Div>
    );

  return (
    <Div>
      <StatusBarFill />
      <ScrollView contentContainerStyle={{ gap: 10, padding: 10 }}>
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
