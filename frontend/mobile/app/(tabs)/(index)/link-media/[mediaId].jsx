import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import usePosts from "../../../../hooks/usePosts";
import useQueries from "../../../../hooks/useQueries";
import { PosterScroll } from "../../../../components/ui";
import { Div, Footer, Scroll, SearchBar } from "../../../../components/elements";
import { View } from "react-native";

export default () => {
  const { mediaId } = useLocalSearchParams();
  const local = useQueries();
  const matches = useQueries();
  const { postLink } = usePosts();
  const [title, setTitle] = useState(null);
  const [year, setYear] = useState(null);

  async function handleLink(tmdbId) {
    if (!local.data) return;
    const response = await postLink(mediaId, tmdbId, local.data.type);
    if (response.ok) {
      router.push(`/local-media/${mediaId}`);
    } else {
      console.error("Media Link not successful");
    }
  }

  // #region useEffects
  useEffect(() => {
    local.selectMedia(mediaId);
  }, []);

  useEffect(() => {
    if (local.data) {
      setTitle(local.data.title);
      if(local.data.year) setYear(local.data.year.toString());
    }
  }, [local.data]);

  useEffect(() => {
    if (title && local.data) {
      if (local.data.type === "movie") {
        matches.fetchMovies(title, year);
      } else {
        matches.fetchShows(title, year);
      }
    }
  }, [title, year]);
  // #endregion

  return (
    <Div>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <SearchBar
            value={title}
            setValue={setTitle}
            placeholder={"Search movies and shows..."}
          />
        </View>
        <View style={{ width: 100 }}>
          <SearchBar
            style={{paddingLeft: 0}}
            numberPad
            value={year}
            setValue={setYear}
            placeholder={"Set Year"}
          />
        </View>
      </View>
      <Scroll>
        <PosterScroll
          header={"Matches"}
          data={matches.data}
          onPress={(item) => {
            handleLink(item.id);
          }}
        />
        <Footer/>
      </Scroll>
    </Div>
  );
};
