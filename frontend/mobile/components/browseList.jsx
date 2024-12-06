import { Image, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
const IMG_BASE = "https://image.tmdb.org/t/p/w780";

export function BrowseList({ title, children }) {
  return (
    <View>
      {title && <Text style={{ fontWeight: "bold" }}>{title}</Text>}
      <View style={{gap: 20}}>{children}</View>
    </View>
  );
}

export function BrowseItem({ mediaId, tmdbId, title, year, backdrop, type }) {
  let href = `/local-media/${mediaId}`;
  if (!mediaId) href = `/external-media/${tmdbId}`;
  return (
    <TouchableOpacity onPress={() => router.push(href, {relativeToDirectory: false})}>
      
      {/* Image height needs to be set as undefined so that aspectRatio works as intended */}
      {/* If Image is a direct child of a Link, height will render as 0, thus if using Link keep in nested View. Not sure why but it just works */}
      <Image
        source={{uri: backdrop ? `${IMG_BASE}/${backdrop}` : null}}
        style={{
          width: "100%",
          height: undefined,
          aspectRatio: 1.78,
          backgroundColor: "grey",
          objectFit: "cover",
        }}
      />
      <Text style={{ fontSize: 20 }}>
        {title} - {year}
      </Text>
    </TouchableOpacity>
  );
}
