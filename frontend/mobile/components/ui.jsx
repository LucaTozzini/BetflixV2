import { useContext } from "react";
import ThemeContext from "../contexts/themeContext";
import { Chip, H2, H3, P } from "./elements";
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

const paddingHorizontal = 15

export const SpotLight = ({
  header,
  title,
  year,
  poster_path,
  genres,
  onPress,
}) => {
  const IMG_BASE = "https://image.tmdb.org/t/p/w500";

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.6 : 1}
      onPress={onPress}
      style={{
        gap: 10,
        width: "80%",
        alignSelf: "center",
        alignItems: "center",
      }}
    >
      {header && <H2 serif>{header}</H2>}
      <Image
        source={{ uri: IMG_BASE + poster_path }}
        style={{
          height: 350,
          aspectRatio: 2 / 3,
          borderRadius: 20,
        }}
      />

      <P center numberOfLines={1}>
        {title}
        <P dim> {year}</P>
      </P>

      {genres && (
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            flexWrap: "nowrap",
            justifyContent: "center",
          }}
        >
          {genres.map((i, index) => (
            <Chip key={index}>{i}</Chip>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

export const Poster = ({ title, year, poster, onPress }) => {
  const IMG_BASE = "https://image.tmdb.org/t/p/w500";
  return (
    <TouchableOpacity onPress={onPress} style={{ width: 150 }}>
      <Image
        source={{ uri: `${IMG_BASE}${poster}` }}
        style={{
          aspectRatio: 2 / 3,
          backgroundColor: "grey",
          borderRadius: 10,
        }}
      />
      <P tiny numberOfLines={1}>
        {title}
      </P>
      <P tiny dim>
        {year}
      </P>
    </TouchableOpacity>
  );
};

export const PosterScroll = ({ header, data }) => {
  if (!data) return;
  return (
    <View style={{ gap: 10 }}>
      <View style={{ paddingHorizontal }}>
        <H3>{header}</H3>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={data}
        horizontal
        contentContainerStyle={{ gap: 10, paddingHorizontal }}
        key={(item) => item.mediaId ?? item.id}
        renderItem={({ item }) => (
          <Poster
            title={item.title ?? item.name}
            year={
              // if from local db
              item.year ??
              // if tmdb movie
              item.release_date?.split("-")[0] ??
              // if tmdb show
              item.first_air_date?.split("-")[0]
            }
            poster={item.poster_path}
            onPress={() => {
              if (item.media_id) router.push(`/local-media/${item.media_id}`);
              else if (item.id) router.push(`/external-media/${item.id}`);
            }}
          />
        )}
      />
    </View>
  );
};

export const TopBar = () => {
  const theme = useContext(ThemeContext);
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal,
      }}
    >
      <Image
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Netflix_2015_N_logo.svg/1200px-Netflix_2015_N_logo.svg.png",
        }}
        style={{ width: 25, aspectRatio: 1, objectFit: "contain" }}
      />
      <TouchableOpacity onPress={() => router.push("/search")} style={{padding: 7, justifyContent: "center", alignItems: "center"}}>
        <Ionicons name="search-outline" color={theme.color} size={25} />
      </TouchableOpacity>
    </View>
  );
};

export const BlurredPoster = ({ poster_path }) => {
  if (!poster_path) return;
  const IMG_BASE = "https://image.tmdb.org/t/p/w500";
  const theme = useContext(ThemeContext);
  return (
    <ImageBackground
      style={{
        height: 400,
      }}
      source={{ uri: IMG_BASE + poster_path }}
      blurRadius={20}
      imageStyle={{ opacity: 0.5 }}
    >
      <LinearGradient
        // Background Linear Gradient
        colors={["transparent", theme.backgroundColor]}
        style={{ flex: 1 }}
      />
    </ImageBackground>
  );
};
