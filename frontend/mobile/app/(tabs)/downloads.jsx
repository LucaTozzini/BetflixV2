import { ScrollView, Text, View } from "react-native";
import useSocket from "../../hooks/useSocket";
import { useContext, useEffect, useState } from "react";
import secToString from "../../helpers/secToString";
import ThemeContext from "../../contexts/themeContext";

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
        padding: 10,
        borderWidth: 1,
        borderColor: theme.colorDim,
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 17, color: theme.color }}>{name}</Text>
      <Text style={{color: theme.color}}>{secToString(timeRemaining)}</Text>
      <View
        style={{
          borderRadius: 100,
          overflow: "hidden",
          backgroundColor: "rgb(210,210,210)",
        }}
      >
        <View
          style={{
            height: 10,
            width: progress * 100 + "%",
            backgroundColor: "blue",
          }}
        />
      </View>
    </View>
  );

  return (
    <View style={{ backgroundColor: theme.backgroundColor, flex: 1 }}>
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
    </View>
  );
};
