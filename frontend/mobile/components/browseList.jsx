import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import secToString from "../helpers/secToString";

const IMG_BASE = "https://image.tmdb.org/t/p/w780";

export function BrowseList({ title, children, gap }) {
  return (
    <View>
      {title && <Text style={{ fontWeight: "bold" }}>{title}</Text>}
      <View style={{ gap: gap ?? 10 }}>{children}</View>
    </View>
  );
}

export function BrowseItem({
  mediaId,
  tmdbId,
  title,
  year,
  backdrop_path,
  type,
  handlePress,
  duration,
}) {
  if (!handlePress) {
    let href = `/local-media/${mediaId}`;
    if (!mediaId) href = `/external-media/${tmdbId}`;
    handlePress = () => router.push(href);
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <ImageBackground
        source={{ uri: backdrop_path ? `${IMG_BASE}/${backdrop_path}` : null }}
        style={{
          aspectRatio: 1.78,
          backgroundColor: "grey",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.5)"]}
          locations={[0, 1]}
          style={{
            flex: 1,
            justifyContent: "flex-end",
            padding: 10,
            paddingRight: "20%",
          }}
        >
          <Text
            style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            style={{ color: "gainsboro", fontSize: 13, fontWeight: "bold" }}
          >
            {year} {duration && "| " + secToString(duration)}
          </Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}
