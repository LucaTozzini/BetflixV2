import { useContext, useEffect, useState } from "react";
import ThemeContext from "../contexts/themeContext";
import { Chip, H2, H3, P } from "./elements";
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Animated,
  ActivityIndicator,
  useAnimatedValue,
  Pressable,
  Text,
  StatusBar,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Image as ExpoImage } from "expo-image";

const paddingHorizontal = 10;

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

export const PosterScroll = ({ header, data, onPress }) => {
  if (!data?.length) return;
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
            title={item.link_title ?? item.title ?? item.name}
            year={
              // if from local db
              item.date?.split("-")[0] ??
              item.year ??
              // if tmdb movie
              item.release_date?.split("-")[0] ??
              // if tmdb show
              item.first_air_date?.split("-")[0]
            }
            poster={item.poster_path}
            onPress={
              onPress
                ? () => onPress(item)
                : () => {
                    if (item.media_id)
                      router.push(`/local-media/${item.media_id}`);
                    else if (item.id) router.push(`/external-media/${item.id}`);
                  }
            }
          />
        )}
      />
    </View>
  );
};

export const TopBar = ({ backgroundColor }) => {
  const theme = useContext(ThemeContext);

  return (
    <Animated.View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        paddingTop: StatusBar.currentHeight,
        backgroundColor,
      }}
    >
      <Image
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Netflix_2015_N_logo.svg/1200px-Netflix_2015_N_logo.svg.png",
        }}
        style={{ width: 25, aspectRatio: 1, objectFit: "contain" }}
      />
      <TouchableOpacity
        onPress={() => router.push("/search")}
        style={{ padding: 7, justifyContent: "center", alignItems: "center" }}
      >
        <Ionicons name="search-outline" color={theme.color} size={25} />
      </TouchableOpacity>
    </Animated.View>
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
      imageStyle={{ opacity: 0.4 }}
    >
      <LinearGradient
        // Background Linear Gradient
        colors={["transparent", theme.backgroundColor]}
        style={{ flex: 1 }}
      />
    </ImageBackground>
  );
};

export const Toast = ({ offsetTop, show, throb, isError, message }) => {
  const theme = useContext(ThemeContext);
  const [hidden, setHidden] = useState(true);
  const translateY = useAnimatedValue(-100);

  function slideIn() {
    setHidden(false);
    Animated.timing(translateY, {
      toValue: offsetTop,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }

  function slideOut() {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 700,
      useNativeDriver: true,
    }).start((finished) => {
      setHidden(finished);
    });
  }

  useEffect(() => {
    if (show) {
      slideIn();
    } else {
      slideOut();
    }
  }, [show]);

  if (hidden) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center",

        backgroundColor: theme.backgroundColor,
        shadowColor: theme.color,
        shadowRadius: 5,
        elevation: 10,
        zIndex: 1000,

        borderRadius: 100,
        paddingHorizontal: 20,
        paddingVertical: 10,
        margin: 20,
        marginHorizontal: "10%",
        overflow: "hidden",
        gap: 10,

        transform: [{ translateY }],
      }}
    >
      {throb && <ActivityIndicator color={theme.color} />}
      {isError && <Ionicons name="warning-outline" size={25} color={"red"} />}
      <P>{message}</P>
    </Animated.View>
  );
};

export const TorrentButton = ({
  quality,
  size,
  type,
  codec,
  seeds,
  peers,
  onPress,
}) => {
  const theme = useContext(ThemeContext);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",

        padding: 10,

        borderWidth: 1,
        borderColor: theme.colorDim,
        borderRadius: 20,

        backgroundColor: theme.backgroundColor,
      }}
    >
      <P>{quality}</P>
      <P>{size}</P>
      <P>{type}</P>
      <P>{codec}</P>
      <View style={{ flexDirection: "row" }}>
        <Ionicons color={theme.color} name="arrow-up-outline" size={20} />
        <P>{seeds}</P>
      </View>

      {/* <View style={{ flexDirection: "row" }}>
        <Ionicons color={theme.color} name="arrow-down-outline" size={20} />
        <P>{peers}</P>
      </View> */}
    </TouchableOpacity>
  );
};

export const Cast = ({ name, profile_path }) => {
  const IMAGE_BASE = "https://image.tmdb.org/t/p/w185";
  return (
    <View style={{ width: 100 }}>
      <Image
        src={IMAGE_BASE + profile_path}
        style={{
          aspectRatio: 1,
          backgroundColor: "grey",
          objectFit: "cover",
          borderRadius: 50,
        }}
      />
      <P center tiny numberOfLines={1}>
        {name}
      </P>
    </View>
  );
};

export const CastScroll = ({ data }) => {
  if (!data) return null;
  // https://developer.themoviedb.org/reference/movie-credits
  return (
    <View style={{ marginTop: 15, marginBottom: 20, gap: 5 }}>
      <H3 style={{ paddingHorizontal }}>Cast</H3>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal,
          gap: 8,
        }}
        data={data}
        keyExtractor={(i) => `${i.order}_${i.id}`}
        renderItem={({ item }) => (
          <Cast name={item.name} profile_path={item.profile_path} />
        )}
      />
    </View>
  );
};

export const Backdrop = ({ backdrop_path, children }) => {
  const IMAGE_BASE = "https://image.tmdb.org/t/p/original";
  const theme = useContext(ThemeContext);
  return (
    <ImageBackground
      source={{ uri: IMAGE_BASE + backdrop_path }}
      style={{ width: "100%", aspectRatio: 0.7 }}
    >
      <LinearGradient
        colors={["transparent", theme.backgroundColor]}
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          padding: paddingHorizontal + 10
        }}
      >
        {children}
      </LinearGradient>
    </ImageBackground>
  );
};

export const Logo = ({ logo_path }) => {
  const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
  console.log(IMAGE_BASE + logo_path);
  return (
    <ExpoImage
      source={{ uri: IMAGE_BASE + logo_path }}
      contentFit="contain"
      contentPosition="bottom center"
      style={{
        height: 130,
        width: "90%",
      }}
    />
  );
};

export const Genres = ({ genres }) => {
  return (
    <View
      style={{
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        width: "80%",
        margin: "auto"
      }}
    >
      {genres?.map((i) => (
        <Chip>
          <P tiny dim>
            {i.trim()}
          </P>
        </Chip>
      ))}
    </View>
  );
};

export const Overview = ({ text }) => {
  if (!text) return null;
  const [expand, setExpand] = useState(false);
  // Not sure why but not wrapping <P> in <Text> causes an error w
  return (
    <Pressable onPress={() => setExpand(!expand)}>
      <Text
        numberOfLines={expand ? undefined : 5}
        style={{ paddingHorizontal }}
      >
        <P>{text}</P>;
      </Text>
    </Pressable>
  );
};

export const Vote = ({ vote_average }) => {
  if (!vote_average) return null;
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 3,
        paddingHorizontal,
        paddingTop: 10,
      }}
    >
      <Ionicons name="star" color={"rgb(255, 208, 0)"} size={17} />
      <P>{Math.round(vote_average * 10)}</P>
    </View>
  );
};

export const ThemedStatusBar = ({ translucent }) => {
  const theme = useContext(ThemeContext);
  return (
    <ExpoStatusBar
      style={theme.statusBarStyle}
      translucent={translucent}
      backgroundColor={translucent ? "transparent" : theme.backgroundColor}
    />
  );
};
