import { forwardRef, useContext, useEffect, useRef, useState } from "react";
import ThemeContext from "../contexts/themeContext";
import { Chip, H3, P } from "./elements";
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
  BackHandler,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  FlatList as GestureHandlerFlatList,
  ScrollView as GestureHandlerScrollView,
} from "react-native-gesture-handler";
const paddingHorizontal = 10;

export const SpotLight = ({
  loading,
  title,
  year,
  poster_path,
  genres,
  onPress,
}) => {
  const theme = useContext(ThemeContext);
  const IMG_BASE = "https://image.tmdb.org/t/p/w500";

  const Content = () => (
    <TouchableOpacity
      onPress={loading ? null : onPress}
      activeOpacity={loading ? 1 : undefined}
      style={{
        gap: 10,
        width: "80%",
        alignSelf: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: IMG_BASE + poster_path }}
        style={{
          height: 350,
          aspectRatio: 2 / 3,
          borderRadius: 10,
          backgroundColor: theme.colorDim,
        }}
      />

      <P center numberOfLines={1}>
        {title}
        <P dim> {loading ? "█".repeat(10) : year}</P>
      </P>

      {genres ? (
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
      ) : (
        <Chip>{"█".repeat(10)}</Chip>
      )}
    </TouchableOpacity>
  );

  const Skeleton = () => {
    const opacity = useAnimatedValue(0.5);
    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }, []);

    return (
      <Animated.View style={{ opacity }}>
        <Content />
      </Animated.View>
    );
  };

  return loading ? <Skeleton /> : <Content />;
};

export const Poster = ({ skeleton, title, year, poster, onPress }) => {
  const IMG_BASE = "https://image.tmdb.org/t/p/w500";
  const theme = useContext(ThemeContext);
  return (
    <TouchableOpacity onPress={onPress} style={{ width: 150, gap: 1 }}>
      <Image
        source={{ uri: `${IMG_BASE}${poster}` }}
        style={{
          aspectRatio: 2 / 3,
          backgroundColor: theme.colorDim,
          borderRadius: 10,
        }}
      />
      <P tiny numberOfLines={1}>
        {skeleton ? "█".repeat(10) : title}
      </P>
      <P tiny dim>
        {skeleton ? "█".repeat(4) : year}
      </P>
    </TouchableOpacity>
  );
};

export const PosterScroll = ({ header, data, onPress, useGestureHandler }) => {
  const Header = () => (
    <View style={{ paddingHorizontal }}>
      <H3>{header}</H3>
    </View>
  );

  const SkeletonList = () => {
    const opacity = useAnimatedValue(0.5);

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }, []);

    const Scroll = useGestureHandler ? GestureHandlerScrollView : ScrollView;

    return (
      <Scroll horizontal showsHorizontalScrollIndicator={false}>
        <Animated.View
          style={{ gap: 10, paddingHorizontal, opacity, flexDirection: "row" }}
        >
          <Poster skeleton />
          <Poster skeleton />
          <Poster skeleton />
        </Animated.View>
      </Scroll>
    );
  };

  const List = () => {
    const handlePress = (item) => {
      if (onPress) onPress(item);
      // if no onPress function is given, default to router.push
      else {
        if (item.media_id) router.push(`/media?mediaId=${item.media_id}`);
        else if (item.id) router.push(`/media?tmdbId=${item.id}`);
      }
    };

    const renderItem = ({ item }) => (
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
        onPress={() => handlePress(item)}
      />
    );

    const Scroll = useGestureHandler ? GestureHandlerFlatList : FlatList;

    return (
      <Scroll
        showsHorizontalScrollIndicator={false}
        data={data}
        horizontal
        contentContainerStyle={{ gap: 10, paddingHorizontal }}
        key={(item) => item.mediaId ?? item.id}
        renderItem={renderItem}
      />
    );
  };

  return (
    <View style={{ gap: 10 }}>
      <Header />
      {data?.length ? <List /> : <SkeletonList />}
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

export const CastScroll = ({ data, skeleton }) => {
  // https://developer.themoviedb.org/reference/movie-credits

  const Cast = ({ name, profile_path }) => {
    const IMAGE_BASE = "https://image.tmdb.org/t/p/h632";
    return (
      <View style={{ width: 90 }}>
        <Image
          src={IMAGE_BASE + profile_path}
          style={{
            aspectRatio: 1,
            backgroundColor: "grey",
            objectFit: "cover",
            borderRadius: 50,
          }}
        />
        <P center tiny numberOfLines={1} dim={skeleton !== null}>
          {skeleton ? "█".repeat(10) : name}
        </P>
      </View>
    );
  };

  const SkeletonList = () => {
    const opacity = useAnimatedValue(0.5);
    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }, []);
    return (
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal, gap: 10, opacity }}
      >
        <Cast skeleton />
        <Cast skeleton />
        <Cast skeleton />
        <Cast skeleton />
      </Animated.ScrollView>
    );
  };

  const List = () => {
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal,
          gap: 10,
        }}
        data={data}
        keyExtractor={(i) => `${i.order}_${i.id}`}
        renderItem={({ item }) => (
          <Cast name={item.name} profile_path={item.profile_path} />
        )}
      />
    );
  };

  return (
    <View style={{ gap: 5 }}>
      <H3 style={{ paddingHorizontal }}>Cast</H3>
      {data ? <List /> : <SkeletonList />}
    </View>
  );
};

export const Backdrop = ({ backdrop_path, children }) => {
  const IMAGE_FALLBACK =
    "https://media.istockphoto.com/id/1284969926/vector/abstract-blue-pattern-background.jpg?s=612x612&w=0&k=20&c=PoTWtlOHO9yOdJer9LI-aM6kKr-2K_iTcLPf3TAMuxU=";
  const IMAGE_BASE = "https://image.tmdb.org/t/p/w780";
  const theme = useContext(ThemeContext);
  const timeout = useRef(null);
  const [uri, setUri] = useState(null);

  useEffect(() => {
    clearTimeout(timeout.current);
    if (!backdrop_path) {
      timeout.current = setTimeout(() => setUri(IMAGE_FALLBACK), 1000);
      return;
    }
    setUri(IMAGE_BASE + backdrop_path);
  }, [backdrop_path]);

  return (
    <ImageBackground
      source={{ uri }}
      style={{ width: "100%", aspectRatio: 1.5 }}
    >
      <LinearGradient
        colors={["transparent", theme.backgroundColor]}
        locations={[0.6, 1]}
        style={{ flex: 1 }}
      >
        {children}
      </LinearGradient>
    </ImageBackground>
  );
};

export const Overview = ({ children }) => {
  if (!children) return null;
  const [expand, setExpand] = useState(false);
  // Not sure why but not wrapping <P> in <Text> causes an error w
  return (
    <Pressable onPress={() => setExpand(!expand)}>
      <Text numberOfLines={expand ? undefined : 3}>
        <P dim>{children}</P>;
      </Text>
    </Pressable>
  );
};

export const Vote = ({ vote_average, vote_count }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 3,
      }}
    >
      <Ionicons name="star" color={"rgb(255, 208, 0)"} size={17} />
      <P>{vote_average ? Math.round(vote_average * 10) : "█".repeat(2)}</P>
      <P dim> | {vote_count || "█".repeat(3)}</P>
    </View>
  );
};

export const LinkButton = ({ handleLink, isLinked }) => {
  const theme = useContext(ThemeContext);
  return (
    <TouchableOpacity onPress={handleLink}>
      <Ionicons
        name={isLinked ? "unlink-outline" : "link-outline"}
        color={theme.color}
        size={30}
      />
    </TouchableOpacity>
  );
};

export const StatusBarFill = ({ transparent }) => {
  const theme = useContext(ThemeContext);
  return (
    <View
      style={{
        backgroundColor: transparent ? "transparent" : theme.backgroundColor,
        height: StatusBar.currentHeight,
      }}
    />
  );
};

export const PlayButton = ({ mediaId }) => {
  const theme = useContext(ThemeContext);
  const size = 70;
  return (
    <TouchableOpacity
      onPress={mediaId ? () => router.push("/stream/" + mediaId) : null}
      style={{
        width: size,
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:
          theme.using === "light"
            ? "rgba(255, 255, 255, .6)"
            : "rgba(0, 0, 0, .6)",
        borderRadius: "50%",
      }}
    >
      <Ionicons
        name="play"
        color={theme.color}
        size={size / 1.8}
        style={{ marginLeft: 1, width: size / 2 }}
      />
    </TouchableOpacity>
  );
};

export const SeasonButton = ({ seasonNum, onPress }) => {
  const theme = useContext(ThemeContext);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal,
        gap: 10,
      }}
    >
      <H3>{seasonNum ? `Season ${seasonNum}` : "█".repeat(6)}</H3>
      <Ionicons name="caret-down-outline" size={20} color={theme.color} />
    </TouchableOpacity>
  );
};

export const EpisodesScroll = ({ data, details }) => {
  const theme = useContext(ThemeContext);

  const Item = ({ season_num, episode_num, duration, skeleton }) => {
    const style = {
      width: 250,
      aspectRatio: 3 / 2,
      backgroundColor: theme.colorDim,
      borderRadius: 5,
      overflow: "hidden",
    };

    if (skeleton) return <View style={style} />;

    const episodeDetails = details?.find(
      (i) => i.season_number === season_num && i.episode_number === episode_num
    );
    return (
      <TouchableOpacity>
        <ImageBackground
          source={{
            uri: `https://image.tmdb.org/t/p/w500${episodeDetails?.still_path}`,
          }}
          style={style}
        >
          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, .8)"]}
            style={{
              flex: 1,
              justifyContent: "flex-end",
              paddingLeft: 5,
              paddingRight: 10,
            }}
          >
            <Text
              style={{ color: "white", fontSize: 30, fontWeight: "bold" }}
              numberOfLines={1}
            >
              {episode_num}.{" "}
              <Text style={{ fontSize: 18 }}>{episodeDetails?.name}</Text>
            </Text>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const SkeletonList = () => {
    const opacity = useAnimatedValue(0.5);
    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }, []);

    return (
      <Animated.ScrollView
        horizontal
        contentContainerStyle={{ paddingHorizontal, gap: 10, opacity }}
      >
        <Item skeleton={true} />
        <Item skeleton={true} />
        <Item skeleton={true} />
        <Item skeleton={true} />
        <Item skeleton={true} />
      </Animated.ScrollView>
    );
  };

  const List = () => {
    const ref = useRef(null);

    // When episodes change, scroll to the start of the list
    useEffect(() => {
      ref.current?.scrollToOffset({ offset: 0, animated: false });
    }, [data]);

    return (
      <FlatList
        ref={ref}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal, gap: 10 }}
        keyExtractor={(i) => i.episode_num + "_" + i.season_num}
        data={data}
        renderItem={({ item }) => <Item {...item} />}
      />
    );
  };

  return data ? <List /> : <SkeletonList />;
};

export const ThemedBottomSheetModal = forwardRef(({ children }, ref) => {
  const { color, tabsBackgroundColor } = useContext(ThemeContext);

  const isOpen = useRef(false);

  useEffect(() => {
    BackHandler.addEventListener("harwareBackPress", () => {
      ref.current?.dismiss();
      if (ref.current && isOpen.current) {
        ref.current.dismiss();
        return true;
      }
      return false;
    });
  }, []);

  return (
    <BottomSheetModal
      ref={ref}
      onChange={(index) => (isOpen.current = index !== -1)}
      backgroundStyle={{ backgroundColor: tabsBackgroundColor }}
      handleIndicatorStyle={{ backgroundColor: color }}
      enableTouchThrough={false}
      backdropComponent={(backdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          enableTouchThrough={false}
          opacity={0.8}
        />
      )}
    >
      {children}
    </BottomSheetModal>
  );
});
