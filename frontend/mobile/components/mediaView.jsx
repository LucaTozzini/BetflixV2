// TMDb Image docs: https://developer.themoviedb.org/docs/image-basics
const IMAGE_BASE = "https://image.tmdb.org/t/p/w780";
import { useContext, useState } from "react";
import {
  View,
  Pressable,
  ImageBackground,
  FlatList,
  Image,
} from "react-native";
import ThemeContext from "../contexts/themeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { H1, H2, P } from "./elements";
import { LinearGradient } from "expo-linear-gradient";

export default function MediaView({
  title,
  year,
  genres,
  vote,
  overview,
  backdrop_path,
  children,
  cast,
}) {
  const theme = useContext(ThemeContext);
  const [expand, setExpand] = useState(false);
  return (
    <View>
      {backdrop_path && (
        <ImageBackground
          source={{ uri: IMAGE_BASE + backdrop_path }}
          style={{ aspectRatio: 1.7 }}
        >
          <LinearGradient
            colors={["transparent", theme.backgroundColor]}
            locations={[1, 1]}
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          />
        </ImageBackground>
      )}
      <View style={{ marginHorizontal: 10 }}>
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
          <P numberOfLines={expand ? null : 5}>{overview}</P>
        </Pressable>
      </View>
      {/* https://developer.themoviedb.org/reference/movie-credits */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 20, gap: 15 }}
        data={cast}
        keyExtractor={(i) => i.cast_id}
        renderItem={({ item }) => (
          <View style={{width: 100}}>
            <Image
              src={IMAGE_BASE + item.profile_path}
              style={{ aspectRatio: 1, backgroundColor: "grey", objectFit: "cover", borderRadius: 50 }}
            />
            <P center tiny>{item.name}</P>
          </View>
        )}
      />
    </View>
  );
}
