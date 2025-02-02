import { Animated, useAnimatedValue, View } from "react-native";
import { AnimatedScroll, Div, Footer } from "../../../components/elements";
import useQueries from "../../../hooks/useQueries";
import { useEffect, useState, useContext } from "react";
import {
  BlurredPoster,
  PosterScroll,
  SpotLight,
  TopBar,
} from "../../../components/ui";
import { router } from "expo-router";
import idToGenre from "../../../helpers/idToGenre";
import ThemeContext from "../../../contexts/themeContext";

export default () => {
  const latest = useQueries();
  const popular = useQueries();
  const randomShows = useQueries();
  const [spotlight, setSpotlight] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useContext(ThemeContext);

  const scrollY = useAnimatedValue(0);
  const topBarBackgroundColor = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: ["transparent", theme.backgroundColor],
    extrapolate: "clamp",
  });

  async function handleRefresh() {
    setRefreshing(true);
    await popular.fetchPopularMovies();
    await latest.selectMediaCollection(0, 20, "date", true, "any");
    await randomShows.selectMediaCollection(0, 20, "random", false, "show");

    setRefreshing(false);
  }

  useEffect(() => {
    latest.selectMediaCollection(0, 20, "date", true, "any");
    popular.fetchPopularMovies();
    randomShows.selectMediaCollection(0, 20, "random", false, "show");
  }, []);

  useEffect(() => {
    if (popular.data) {
      const rand = Math.floor(Math.random() * popular.data.length);
      setSpotlight(popular.data[rand]);
    }
  }, [popular.data]);

  return (
    <Div>
      <TopBar backgroundColor={topBarBackgroundColor} />
      <AnimatedScroll
        refreshing={refreshing}
        onRefresh={handleRefresh}
        gap={20}
        onScroll={Animated.event(
          // scrollY = e.nativeEvent.contentOffset.y
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
                },
              },
            },
          ],
          { useNativeDriver: false }
        )}
      >
        <View
          style={{
            pointerEvents: "none",
            position: "relative",
            top: 0,
            right: 0,
            left: 0,
            height: 60,
          }}
        >
          <BlurredPoster poster_path={spotlight?.poster_path} />
        </View>
        <SpotLight
          loading={!spotlight}
          title={spotlight?.title}
          year={spotlight?.release_date?.split("-")[0]}
          poster_path={spotlight?.poster_path}
          genres={spotlight?.genre_ids?.map((i) => idToGenre[i]).slice(0, 3)}
          onPress={() => router.push(`/media?tmdbId=${spotlight.id}`)}
        />

        <PosterScroll data={popular.data} header={"Popular Movies"} />

        <PosterScroll data={latest.data} header={"Latest on Disc"} />
        <PosterScroll data={randomShows.data} header={"TV Shows"} />

        <Footer />
      </AnimatedScroll>
    </Div>
  );
};
