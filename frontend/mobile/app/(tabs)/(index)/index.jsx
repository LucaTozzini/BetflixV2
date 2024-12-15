import { View } from "react-native";
import { Div, Footer, Scroll } from "../../../components/elements";
import useQueries from "../../../hooks/useQueries";
import { useEffect, useState } from "react";
import {
  BlurredPoster,
  PosterScroll,
  SpotLight,
  TopBar,
} from "../../../components/ui";
import { router } from "expo-router";
import idToGenre from "../../../helpers/idToGenre";

export default () => {
  const latest = useQueries();
  const popular = useQueries();
  const [spotlight, setSpotlight] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    await popular.fetchPopularMovies();
    await latest.selectMediaCollection(0, 10, "year", true, "any");

    setRefreshing(false);
  }

  useEffect(() => {
    latest.selectMediaCollection(0, 10, "year", true, "any");
    popular.fetchPopularMovies();
  }, []);

  useEffect(() => {
    if (popular.data) {
      const rand = Math.floor(Math.random() * popular.data.length);
      setSpotlight(popular.data[rand]);
    }
  }, [popular.data]);

  return (
    <Div>
      <TopBar />
      <Scroll refreshing={refreshing} onRefresh={handleRefresh} gap={50}>
        <View
          style={{
            pointerEvents: "none",
            position: "relative",
            top: 0,
            right: 0,
            left: 0,
            height: 10,
          }}
        >
          <BlurredPoster poster_path={spotlight?.poster_path} />
        </View>
        <SpotLight
          // header={"Spotlight"}
          title={spotlight?.title}
          year={spotlight?.release_date?.split("-")[0]}
          poster_path={spotlight?.poster_path}
          genres={spotlight?.genre_ids?.map((i) => idToGenre[i]).slice(0, 3)}
          onPress={() => router.push(`/external-media/${spotlight.id}`)}
        />

        <PosterScroll data={popular.data} header={"Popular Movies"} />

        <PosterScroll data={latest.data} header={"Latest on Disc"} />

        <Footer/>
      </Scroll>
    </Div>
  );
};