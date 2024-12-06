import { ScrollView, StyleSheet } from "react-native";
import useQueries from "../../hooks/useQueries";
import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router/build/hooks";
import MediaView from "../../components/mediaView";
import { router } from "expo-router";

export default () => {
  const { tmdbId } = useLocalSearchParams();

  const media = useQueries();
  const link = useQueries();

  useEffect(() => {
    media.fetchMovieDetails(tmdbId);
    link.selectLink({ tmdbId });
  }, []);

  useEffect(() => {
    if (link.data && link.data.media_id) {
      router.replace(`/local-media/${link.data.media_id}`);
    }
  }, [link.data]);

  return (
    <ScrollView style={styles.scroll}>
      <MediaView
        title={media.data?.title}
        year={media.data?.release_date.split("-")[0]}
        genres={media.data?.genres.map((i) => i.name).join(", ")}
        vote={
          media.data?.vote_average
            ? Math.round(media.data?.vote_average / 2)
            : null
        }
        overview={media.data?.overview}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    padding: 10,
    gap: 10,
  },
});
