import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import useQueries from "../../hooks/useQueries";
import { useEffect } from "react";
import MediaView from "../../components/mediaView";
export default () => {
  const { mediaId } = useLocalSearchParams();
  const media = useQueries();
  const seasons = useQueries();
  const season = useQueries();
  const external = useQueries();

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
        } else {
          external.fetchShowDetails(media.data.tmdb_id);
        }
      }
    }
  }, [media.data]);

  useEffect(() => {
    if (seasons.data?.length > 0) {
      season.selectSeason(mediaId, seasons.data[0].season_num);
    }
  }, [seasons.data]);

  const Episode = ({ seasonNum, episodeNum, duration }) => {
    const href = `/video/${mediaId}?s=${seasonNum}&e=${episodeNum}`;
    function secToString(sec) {
      const hours = Math.floor(sec / 3600);
      const minutes = Math.floor((sec % 3600) / 60);
      let string = [];
      if (hours) string.push(hours + "h");
      if (minutes) string.push(minutes + "m");
      return string.join(" ");
    }

    return (
      <TouchableOpacity style={styles.episode}>
        <Text style={styles.episodeText}>
          S{seasonNum}:E{episodeNum}
        </Text>
        <Text style={styles.episodeText}>{secToString(duration)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <MediaView
        title={media.data?.title}
        year={media.data?.year}
        genres={media.data?.genres}
        overview={media.data?.overview}
        vote={
          external.data?.vote_average
            ? Math.round(external.data?.vote_average / 2)
            : null
        }
      />
      {media.data?.type === "show" && (
        <View style={styles.episodes}>
          {season.data?.map((i) => (
            <Episode
              key={i.episodeNum}
              seasonNum={i.season_num}
              episodeNum={i.episode_num}
              duration={i.duration}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    padding: 10,
    gap: 10,
  },
  episodes: {
    gap: 10,
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
