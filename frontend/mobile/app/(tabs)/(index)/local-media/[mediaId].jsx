import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import useQueries from "../../../../hooks/useQueries";
import { useContext, useEffect, useState } from "react";
import MediaView from "../../../../components/mediaView";
import useDeletes from "../../../../hooks/useDeletes";
import { Button, EpisodeButton } from "../../../../components/buttons";
import ScrollModal from "../../../../components/scrollModal";
import ThemeContext from "../../../../contexts/themeContext";

export default () => {
  const theme = useContext(ThemeContext)
  const { mediaId } = useLocalSearchParams();
  const media = useQueries();
  const seasons = useQueries();
  const season = useQueries();
  const external = useQueries();
  const { deleteLink } = useDeletes();
  const [vote, setVote] = useState(null);
  const [showModal, setShowModal] = useState(null);

  async function handleLink() {
    if (!media.data) return;
    if (media.data.tmdb_id) {
      const response = await deleteLink(mediaId);
      if (response?.ok) {
        media.selectMedia(mediaId);
        external.reset();
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
      console.log(media.data.title)
      if (media.data.type === "show") {
        seasons.selectSeasons(mediaId);
      }

      if (media.data.tmdb_id) {
        if (media.data.type === "movie") {
          external.fetchMovieDetails(media.data.tmdb_id);
        } else {
          external.fetchShowDetails(media.data.tmdb_id);
        }
      }
    }
  }, [media.data]);

  useEffect(() => {
    if (external.data?.vote_average) {
      setVote(Math.round(external.data.vote_average / 2));
    } else {
      setVote(null);
    }
  }, [external.data]);

  useEffect(() => {
    if (seasons.data?.length > 0) {
      season.selectSeason(mediaId, seasons.data[0].season_num);
    }
  }, [seasons.data]);

  // #endregion

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>

    <ScrollView contentContainerStyle={styles.scroll}>
      <MediaView
        title={media.data?.link_title ?? media.data?.title}
        year={media.data?.year}
        genres={media.data?.genres}
        overview={media.data?.overview}
        vote={vote}
        backdrop={external.data?.backdrop_path ?? media.data?.backdrop ?? null}
        marginHorizontal={10}
      >
        <View style={{ marginVertical: 10, flexDirection: "row" }}>
          <Button
            handlePress={() => router.push(`/stream/${mediaId}`)}
            text={"Play"}
          />
          <Button
            handlePress={handleLink}
            text={media.data?.tmdb_id ? "Unlink" : "Link"}
          />
        </View>
      </MediaView>
      {media.data?.type === "show" && (
        <View style={styles.episodes}>
          <Button handlePress={() => setShowModal(true)} text="Select Season" />
          {season.data?.map((i) => (
            <EpisodeButton
              key={i.season_num + "_" + i.episode_num}
              seasonNum={i.season_num}
              episodeNum={i.episode_num}
              mediaId={mediaId}
              duration={i.duration}
            />
          ))}
        </View>
      )}
      <ScrollModal showModal={showModal} setShowModal={setShowModal}>
        {seasons.data?.map((i) => (
          <Button
            key={i.season_num}
            text={`Season ${i.season_num}`}
            hideBorder={true}
            handlePress={() => {
              season.selectSeason(mediaId, i.season_num);
              setShowModal(false);
            }}
          />
        ))}
      </ScrollModal>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    gap: 10,
    paddingBottom: 20,
  },
  episodes: {
    gap: 10,
    marginHorizontal: 10,
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
