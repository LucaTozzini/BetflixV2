import { useContext, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import usePosts from "../../../../hooks/usePosts";
import useQueries from "../../../../hooks/useQueries";
import MediaView from "../../../../components/mediaView";
import ThemeContext from "../../../../contexts/themeContext";
import { Footer, H3 } from "../../../../components/elements";
import {
  ThemedStatusBar,
  Toast,
  TorrentButton,
} from "../../../../components/ui";

export default () => {
  const theme = useContext(ThemeContext);
  const { tmdbId } = useLocalSearchParams();
  const [showToast, setShowToast] = useState(false);
  const [showToastError, setShowToastError] = useState(false);
  const images = useQueries();
  const imagesEn = useQueries();

  const media = useQueries();
  const link = useQueries();
  const torrents = useQueries();

  const { postTorrent } = usePosts();

  useEffect(() => {
    media.fetchMovieDetails(tmdbId);
    link.selectLink({ tmdbId });
    images.fetchMovieImages(tmdbId, null);
    imagesEn.fetchMovieImages(tmdbId, "en");
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

  const Torrents = () => {
    if (!torrents.data?.length) return <H3 center>No Torrents Available</H3>;
    return (
      <View style={{ marginHorizontal: 10 }}>
        <View style={styles.torrents}>
          <H3>Torrents</H3>
          {torrents.data.map((i) => (
            <TorrentButton
              key={i.hash}
              quality={i.quality}
              seeds={i.seeds}
              peers={i.peers}
              size={i.size}
              codec={i.video_codec}
              type={i.type}
              onPress={async () => {
                try {
                  setShowToast(true);
                  const response = await postTorrent(i.url);
                  if (!response.ok) throw new Error("not ok");
                  router.push("/downloads");
                } catch (err) {
                  console.error(err.message);
                  setShowToastError(true);
                  setTimeout(() => setShowToastError(false), 4000);
                }
                setShowToast(false);
              }}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <ThemedStatusBar translucent={true} />

      <Toast show={showToast} throb message={"Adding torrent"} />
      <Toast show={showToastError} isError message={"Something whent wrong"} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <MediaView
          title={media.data?.title}
          year={media.data?.release_date?.split("-")[0]}
          genres={media.data?.genres?.map((i) => i.name).join(", ")}
          vote_average={media.data?.vote_average}
          duration={media.data?.runtime * 60}
          overview={media.data?.overview}
          backdrop_path={images.data?.posters?.length ? images.data.posters[0].file_path : null}
          logo_path={imagesEn.data?.logos?.length ? imagesEn.data.logos[0].file_path : null}
          cast={media.data?.credits?.cast}
        />
        <Torrents />
        <Footer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: {
    // gap: 10,
    paddingBottom: 20,
  },
  torrents: {
    gap: 10,
  },
});
