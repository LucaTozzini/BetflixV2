import { useContext, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import useQueries from "../../../../hooks/useQueries";
import MediaView from "../../../../components/mediaView";
import { TorrentButton } from "../../../../components/buttons";
import ThemeContext from "../../../../contexts/themeContext";

export default () => {
  const theme = useContext(ThemeContext);
  const { tmdbId } = useLocalSearchParams();

  const media = useQueries();
  const link = useQueries();
  const torrents = useQueries();

  useEffect(() => {
    media.fetchMovieDetails(tmdbId);
    link.selectLink({ tmdbId });
  }, []);

  useEffect(() => {
    if (link.data && link.data.media_id) {
      router.replace(`/local-media/${link.data.media_id}`);
    }
  }, [link.data]);

  useEffect(() => {
    if (media.data && media.data.imdb_id) {
      torrents.fetchMovieTorrents(media.data.imdb_id);
    }
  }, [media.data]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <MediaView
          title={media.data?.title}
          year={media.data?.release_date?.split("-")[0]}
          genres={media.data?.genres?.map((i) => i.name).join(", ")}
          vote={
            media.data?.vote_average
              ? Math.round(media.data?.vote_average / 2)
              : null
          }
          overview={media.data?.overview}
          backdrop={media.data?.backdrop_path}
          marginHorizontal={10}
        />
        {torrents.data && (
          <View style={styles.torrents}>
            {torrents.data.map((i) => (
              <TorrentButton
                key={i.hash}
                quality={i.quality}
                seeds={i.seeds}
                peers={i.peers}
                size={i.size}
                codec={i.video_codec}
                type={i.type}
                url={i.url}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: {
    gap: 10,
    paddingBottom: 20,
  },
  torrents: {
    gap: 10,
    marginHorizontal: 10,
  },
});
