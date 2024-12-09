import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import usePosts from "../hooks/usePosts";
import secToString from "../helpers/secToString";
import ThemeContext from "../contexts/themeContext";
import { useContext } from "react";

const ButtonWrap = ({
  handlePress,
  children,
  justifyContent,
  focused,
  flex,
  hideBorder,
}) => {
  const theme = useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={[
        buttonStyle.container,
        { justifyContent: justifyContent ?? "center", flex: flex ?? 1 },
        {
          backgroundColor: focused
            ? theme.highlightColor
            : theme.backgroundColor,
          borderColor: theme.colorDim,
        },
        hideBorder ? { borderWidth: 0 } : {},
      ]}
      onPress={handlePress}
      activeOpacity={0.4}
    >
      {children}
    </TouchableOpacity>
  );
};

export const Button = ({ handlePress, text, flex, focused, hideBorder }) => {
  const theme = useContext(ThemeContext);
  return (
    <ButtonWrap
      onPress={handlePress}
      focused={focused}
      handlePress={handlePress}
      hideBorder={hideBorder}
      flex={flex}
    >
      <Text style={[buttonStyle.text, { color: theme.color }]}>{text}</Text>
    </ButtonWrap>
  );
};

export const EpisodeButton = ({ seasonNum, episodeNum, mediaId, duration }) => {
  const theme = useContext(ThemeContext)
  const href = `/stream/${mediaId}?s=${seasonNum}&e=${episodeNum}`;
  return (
    <ButtonWrap
      handlePress={() => router.push(href)}
      justifyContent={"space-between"}
    >
      <Text style={{ fontSize: 20, color: theme.color }}>
        S{seasonNum}:E{episodeNum}
      </Text>
      <Text style={{ fontSize: 20, color: theme.color }}>{secToString(duration)}</Text>
    </ButtonWrap>
  );
};

export const TorrentButton = ({
  quality,
  peers,
  seeds,
  size,
  type,
  url,
  codec,
}) => {
  const theme = useContext(ThemeContext)
  const fontSize = 15;
  const color = theme.color
  const iconsSize = 20;
  const { postTorrent } = usePosts();
  return (
    <ButtonWrap
      handlePress={async () => {
        const response = await postTorrent(url);
        if (response.ok) {
          router.push("/downloads");
        }
      }}
      justifyContent={"space-between"}
    >
      <Text style={{ fontSize, color }}>{quality}</Text>
      <Text style={{ fontSize, color }}>{size}</Text>
      <Text style={{ fontSize, color }}>{type}</Text>
      <Text style={{ fontSize, color }}>{codec}</Text>
      <View style={{ flexDirection: "row" }}>
        <Ionicons size={iconsSize} color={theme.colorDim} name="arrow-down-outline" />
        <Text style={{ fontSize, color }}> {seeds}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Ionicons size={iconsSize} color={theme.colorDim} name="arrow-up-outline" />
        <Text style={{ fontSize, color }}>{peers}</Text>
      </View>
    </ButtonWrap>
  );
};

const buttonStyle = StyleSheet.create({
  container: {
    padding: 8,
    borderWidth: 1,
    flexDirection: "row",
  },

  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  text: {
    fontSize: 17,
    textAlign: "center",
  },
});
