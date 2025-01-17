import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useQueries from "../../../hooks/useQueries";
import { Div, H1, P, Scroll } from "../../../components/elements";
import {
  Backdrop,
  CastScroll,
  LocalMediaActions,
  Overview,
  PlayButton,
  StatusBarFill,
  Vote,
} from "../../../components/ui";
import secToString from "../../../helpers/secToString";

export default function Media() {
  // Get mediaId or tmdbId from route
  // Only one will be given, handle cases appropriately
  const { mediaId, tmdbId } = useLocalSearchParams();

  const external = useQueries();
  const local = useQueries();
  const link = useQueries();
  const imagesNL = useQueries();

  const [duration, setDuration] = useState(null);
  const [genres, setGenres] = useState(null);

  useEffect(() => {
    // If mediaId is given, select media
    // If tmdbId is given, fetch movie details and check if link exists
    if (mediaId) {
      local.selectMedia(mediaId);
    }
    // When tmdbId is given, assume it is a movie
    if (tmdbId) {
      external.fetchMovieDetails(tmdbId);
      imagesNL.fetchMovieImages(tmdbId, null);
    }
    link.selectLink({ tmdbId, mediaId });
  }, []);

  useEffect(() => {
    if (link.data) {
      // Case where mediaId was given
      // Need to wait for local data to know if it's a show or movie
      if (!tmdbId && local.data) {
        if (local.data.type === "movie") {
          external.fetchMovieDetails(link.data.tmdb_id);
          imagesNL.fetchMovieImages(link.data.tmdb_id, null);
        } else {
          external.fetchShowDetails(link.data.tmdb_id);
          imagesNL.fetchShowImages(link.data.tmdb_id, null);
        }
      }
      // Case where tmdbId was given
      if (!mediaId) {
        local.selectMedia(link.data.media_id);
      }
    }
  }, [link.data, local.data]);

  useEffect(() => {
    if (local.data) {
      setDuration(secToString(local.data.duration));
      setGenres(local.data.genres);
    } else if (external.data) {
      setDuration(
        secToString(
          (external.data.runtime || external.data.episode_run_time) * 60
        )
      );
      setGenres(external.data.genres?.map((i) => i.name).join(", "));
    }
  }, [external.data, local.data]);

  return (
    <Div>
      <Scroll>
        <Backdrop backdrop_path={imagesNL.data?.backdrops[0]?.file_path}>
          <StatusBarFill transparent />
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {local.data && <PlayButton mediaId={local.data?.media_id} />}
          </View>
        </Backdrop>
        <View
          style={{
            marginHorizontal: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Vote
            vote_average={external.data?.vote_average}
            vote_count={external.data?.vote_count}
          />
          {local.data && <LocalMediaActions />}
        </View>
        <H1 style={{ marginTop: 5 }} pad>
          {external.data?.title || external.data?.name || local.data?.title}
        </H1>
        <P dim pad>
          {[duration, genres].filter((i) => i).join(" \u2022 ")}
        </P>

        <P dim pad style={{ marginVertical: 15 }} numberOfLines={3}>
          {external.data?.overview}
        </P>

        <CastScroll
          data={
            external.data?.credits?.cast ??
            external.data?.aggregate_credits?.cast
          }
        />
      </Scroll>
    </Div>
  );
}
