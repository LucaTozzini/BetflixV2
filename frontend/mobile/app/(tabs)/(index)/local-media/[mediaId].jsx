import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import useQueries from "../../../../hooks/useQueries";
import { useContext, useEffect, useState } from "react";
import MediaView from "../../../../components/mediaView";
import useDeletes from "../../../../hooks/useDeletes";
import { EpisodeButton } from "../../../../components/buttons";
import { Button, Footer, P } from "../../../../components/elements";
import ScrollModal from "../../../../components/scrollModal";
import ThemeContext from "../../../../contexts/themeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedStatusBar } from "../../../../components/ui";

export default () => {
  const theme = useContext(ThemeContext);
  const { mediaId } = useLocalSearchParams();
  const media = useQueries();
  const seasons = useQueries();
  const season = useQueries();
  const external = useQueries();
  const images = useQueries();
  const imagesEn = useQueries();
  const { deleteLink } = useDeletes();
  const [showModal, setShowModal] = useState(null);

  async function handleLink() {
    if (!media.data) return;
    if (media.data.tmdb_id) {
      const response = await deleteLink(mediaId);
      if (response?.ok) {
        media.selectMedia(mediaId);
        external.reset();
        imagesEn.reset()
        images.reset()
      }
    } else {
      router.push(`/link-media/${mediaId}`);
    }
  }

  // #region useEffects
  useEffect(() => {
    media.selectMedia(mediaId);
  }, []);

  useEffect(() => {
    if (media.data) {
      if (media.data.type === "show") {
        seasons.selectSeasons(mediaId);
      }

      if (media.data.tmdb_id) {
        if (media.data.type === "movie") {
          external.fetchMovieDetails(media.data.tmdb_id);
          images.fetchMovieImages(media.data.tmdb_id, null);
          imagesEn.fetchMovieImages(media.data.tmdb_id, "en");
        } else {
          external.fetchShowDetails(media.data.tmdb_id);
          images.fetchShowImages(media.data.tmdb_id, null);
          imagesEn.fetchShowImages(media.data.tmdb_id, "en");
        }
      }
    }
  }, [media.data]);

  useEffect(() => {
    if (seasons.data?.length > 0) {
      season.selectSeason(mediaId, seasons.data[0].season_num);
    }
  }, [seasons.data]);

  // #endregion

  const Buttons = () => {
    return (
      <View style={{ margin: 10, gap: 10, flexDirection: "row" }}>
        <Button grow onPress={() => router.push(`/stream/${mediaId}`)}>
          <Ionicons size={20} color={theme.color} name="play" />
          <P>Play</P>
        </Button>
        <Button grow onPress={handleLink}>
          <Ionicons
            size={20}
            color={theme.color}
            name={media.data?.tmdb_id ? "unlink" : "link"}
          />
          <P>{media.data?.tmdb_id ? "Unlink" : "Link"}</P>
        </Button>
      </View>
    );
  };

  const EpisodesModal = () => {
    return (
      <ScrollModal showModal={showModal} setShowModal={setShowModal}>
        {seasons.data?.map((i) => (
          <TouchableOpacity
            key={i.season_num}
            style={{
              padding: 10,
            }}
            onPress={() => {
              season.selectSeason(mediaId, i.season_num);
              setShowModal(false);
            }}
          >
            <P center>Season {i.season_num}</P>
          </TouchableOpacity>
        ))}
      </ScrollModal>
    );
  };

  const TVShowUI = () => {
    if (media.data?.type !== "show") return null;

    return (
      <View style={styles.episodes}>
        {seasons.data?.length > 1 && (
          <Button onPress={() => setShowModal(true)}>
            <P>Select Season</P>
          </Button>
        )}
        {season.data?.map((i) => (
          <EpisodeButton
            key={i.season_num + "_" + i.episode_num}
            seasonNum={i.season_num}
            episodeNum={i.episode_num}
            mediaId={mediaId}
            duration={i.duration}
          />
        ))}
        <EpisodesModal />
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <ThemedStatusBar translucent={true} />
      <ScrollView>
        <MediaView
          title={media.data?.link_title ?? media.data?.title}
          year={media.data?.date?.split("-")[0] ?? media.data?.year}
          genres={media.data?.genres}
          overview={media.data?.overview}
          vote_average={external.data?.vote_average}
          duration={media.data?.duration}
          backdrop_path={
            images.data?.posters?.length
              ? images.data.posters[0].file_path
              : null
          }
          logo_path={imagesEn.data?.logos?.length ? imagesEn.data.logos[0].file_path : null}
          cast={
            external.data?.credits?.cast ??
            external.data?.aggregate_credits?.cast
          }
        >
          <Buttons />
        </MediaView>
        <TVShowUI />
        <Footer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  episodes: {
    gap: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  episode: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "grey",
  },
  episodeText: {
    fontSize: 18,
  },
});
