// TMDb Image docs: https://developer.themoviedb.org/docs/image-basics
const IMAGE_BASE = "https://image.tmdb.org/t/p/w780";
import { useContext, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import ThemeContext from "../contexts/themeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { H1, H2, P } from "./elements";

export default function MediaView({
  title,
  year,
  genres,
  vote,
  overview,
  backdrop,
  children,
  marginHorizontal,
}) {
  const theme = useContext(ThemeContext);
  const [expand, setExpand] = useState(false);
  return (
    <View>
      {backdrop && (
        <Image
          source={{ uri: `${IMAGE_BASE}/${backdrop}` }}
          style={{ aspectRatio: 1.7 }}
        />
      )}
      <View style={{ marginHorizontal }}>
        <H1>{title}</H1>
        <H2 dim>{year}</H2>
        <P dim>{genres}</P>

        {vote && (
          <View style={{ flexDirection: "row" }}>
            {/* There has to be a better way to do this */}
            {"a"
              .repeat(vote)
              .split("")
              .map((i, index) => (
                <Ionicons
                  key={index}
                  name="star-sharp"
                  size={20}
                  color={theme.color}
                />
              ))}
            {"a"
              .repeat(5 - vote)
              .split("")
              .map((i, index) => (
                <Ionicons
                  key={index}
                  name="star-outline"
                  size={20}
                  color={theme.color}
                />
              ))}
          </View>
        )}
        {children}

        <Pressable onPress={() => setExpand(!expand)}>
          <P numberOfLines={expand ? null : 3}>{overview}</P>
        </Pressable>
      </View>
    </View>
  );
}
