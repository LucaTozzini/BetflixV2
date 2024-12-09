import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import usePosts from "../../../../hooks/usePosts";
import useQueries from "../../../../hooks/useQueries";
import { BrowseItem, BrowseList } from "../../../../components/browseList";

export default () => {
  const { mediaId } = useLocalSearchParams();
  const local = useQueries();
  const matches = useQueries();
  const { postLink } = usePosts();
  const [title, setTitle] = useState(null);
  const [year, setYear] = useState(null);

  async function handleLink(tmdbId){
    if(!local.data) return
    const response = await postLink(mediaId, tmdbId, local.data.type)
    if(response.ok) {
      router.push(`/local-media/${mediaId}`)
    } else {
      console.error("Media Link not successful")
    }
  }

  // #region useEffects
  useEffect(() => {
    local.selectMedia(mediaId);
  }, []);

  useEffect(() => {
    if (local.data) {
      setTitle(local.data.title);
      setYear(local.data.year);
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
    <View style={styles.container}>
      <View style={styles.inputs}>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          keyboardType="number-pad"
          style={styles.yearInput}
          value={String(year)}
          onChangeText={setYear}
        ></TextInput>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <BrowseList>
          {local.data &&
            matches.data?.map((i) => (
              <BrowseItem
                key={i.id}
                tmdbId={i.id}
                title={i.title ?? i.name}
                year={
                  local.data.type === "movie"
                    ? i.release_date?.split("-")[0]
                    : i.first_air_date?.split("-")[0]
                }
                backdrop={i.backdrop_path}
                type={local.data.type}
                handlePress={ () => handleLink(i.id)}
              />
            ))}
        </BrowseList>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: "white", flex: 1},
  inputs: {
    flexDirection: "row",
    padding: 10,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: "grey",
    flex: 1,
    fontSize: 20,
  },
  yearInput: {
    borderWidth: 1,
    borderColor: "grey",
    width: 100,
    fontSize: 20,
  },
  scroll: {marginHorizontal: 10},
});
