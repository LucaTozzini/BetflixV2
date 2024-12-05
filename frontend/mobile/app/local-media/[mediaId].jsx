import { ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useQueries from "../../hooks/useQueries";
import { useEffect } from "react";
import MediaView from "../../components/mediaView";
export default () => {
  const { mediaId } = useLocalSearchParams();
  const media = useQueries();
  const external = useQueries();

  useEffect(() => {
    media.selectMedia(mediaId);
  }, []);

  useEffect(() => {
    if (media.data && media.data.tmdb_id !== null) {
      if (media.data.type === "movie") {
        external.fetchMovieDetails(media.data.tmdb_id);
      } else {
        external.fetchShowDetails(media.data.tmdb_id);
      }
    }
  }, [media.data]);

  return (
    <ScrollView>
      <MediaView
        title={media.data?.title}
        year={media.data?.year}
        genres={media.data?.genres}
        overview={media.data?.overview}
        vote={external.data?.vote_average ? parseInt(external.data?.vote_average/2) : null}
      />
    </ScrollView>
  );
};
