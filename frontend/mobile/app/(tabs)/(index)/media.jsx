import { useEffect, useRef, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import useQueries from "../../../hooks/useQueries";
import useDeletes from "../../../hooks/useDeletes";
import {
  Div,
  H1,
  P,
  Scroll,
  H2,
  Footer,
  SearchBar,
} from "../../../components/elements";
import {
  Backdrop,
  CastScroll,
  PlayButton,
  StatusBarFill,
  Vote,
  ThemedBottomSheetModal,
  SeasonButton,
  EpisodesScroll,
  LinkButton,
  PosterScroll,
  Poster,
  PosterSkeletonList,
} from "../../../components/ui";
import secToString from "../../../helpers/secToString";
import Toast from "react-native-toast-message";
import usePosts from "../../../hooks/usePosts";
import {
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

export default function Media() {
  // Get mediaId or tmdbId from route
  // Only one will be given, handle cases appropriately
  const { mediaId, tmdbId } = useLocalSearchParams();

  const external = useQueries();
  const local = useQueries();
  const link = useQueries();
  const imagesNL = useQueries();
  const availableSeasons = useQueries();
  const episodes = useQueries();
  const seasonDetails = useQueries();
  const linkMatches = useQueries();

  const { deleteLink } = useDeletes();
  const { postLink } = usePosts();

  const [currSeason, setCurrSeason] = useState(null);
  const [duration, setDuration] = useState(null);
  const [genres, setGenres] = useState(null);

  const seasonsModalRef = useRef(null);
  const linkModalRef = useRef(null);

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
    if (local.data && !external.data) {
      setDuration(secToString(local.data.duration));
    }

    if (local.data?.type === "show") {
      availableSeasons.selectSeasons(local.data.media_id);
    }

    if (external.data) {
      setDuration(
        secToString(
          (external.data.runtime || external.data.episode_run_time) * 60
        )
      );
      setGenres(external.data.genres?.map((i) => i.name).join(", "));
    }
  }, [external.data, local.data]);

  useEffect(() => {
    if (availableSeasons.data) {
      setCurrSeason(availableSeasons.data[0].season_num);
    }
  }, [availableSeasons.data]);

  useEffect(() => {
    if (typeof currSeason !== "number") return;
    episodes.selectSeason(local.data?.media_id, currSeason);

    if (link.data) {
      seasonDetails.fetchSeasonDetails(link.data.tmdb_id, currSeason);
    }
  }, [currSeason, link.data]);

  async function handleLink() {
    if (!local.data) return;

    // If media is linked, send a DELETE request to unlink
    if (local.data.tmdb_id) {
      const response = await deleteLink(local.data.media_id);
      if (response.ok) {
        router.replace("/media?mediaId=" + local.data.media_id);
        Toast.show({ type: "success", text1: "Link deleted" });
      }
    }

    // If media doesn't have a link, show link modal
    else {
      if (local.data.type === "movie") {
        linkMatches.fetchMovies(local.data.title, local.data.year);
      } else {
        linkMatches.fetchShows(local.data.title, local.data.year);
      }
      linkModalRef.current?.present();
    }
  }

  async function handleSelectLink(tmdbId) {
    const response = await postLink(
      local.data.media_id,
      tmdbId,
      local.data.type
    );
    if (response.ok) {
      router.replace("/media?mediaId=" + local.data.media_id);
      linkModalRef.current?.dismiss();
      Toast.show({
        type: "success",
        text1: "Link created",
      });
      return;
    }
    Toast.show({
      type: "error",
      text1: "Whoops",
      text2: "Something whent wrong",
    });
  }

  return (
    <>
      <Div>
        <Scroll>
          <Backdrop backdrop_path={imagesNL.data?.backdrops[0]?.file_path}>
            <StatusBarFill transparent />
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
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
            {local.data && (
              <LinkButton
                handleLink={handleLink}
                isLinked={local.data.tmdb_id}
              />
            )}
          </View>
          <H1 style={{ marginTop: 5 }} pad>
            {external.data?.title ||
              external.data?.name ||
              local.data?.title ||
              "█".repeat(10)}
          </H1>
          <P dim pad numberOfLines={1} style={{ marginBottom: 15 }}>
            {[
              external.data?.release_date?.split("-")[0] ||
                external.data?.first_air_date?.split("-")[0] ||
                local.data?.year ||
                "█".repeat(4),
              duration,
              genres,
            ]
              .filter((i) => i)
              .join(" \u2022 ")}
          </P>

          {
            <P dim pad style={{ marginBottom: 15 }} numberOfLines={3}>
              {external.data?.overview ??
                (!local.data || local.data.tmdb_id ? "█".repeat(150) : "")}
            </P>
          }

          {local.data?.type === "show" && (
            <>
              <SeasonButton
                seasonNum={currSeason}
                onPress={() => seasonsModalRef.current?.present()}
              />
              <View style={{ height: 10 }} />
              <EpisodesScroll
                data={episodes.data}
                details={seasonDetails.data}
              />
              <View style={{ height: 40 }} />
            </>
          )}

          {(!local.data || local.data.tmdb_id) && (
            <CastScroll
              data={
                external.data?.credits?.cast ??
                external.data?.aggregate_credits?.cast
              }
            />
          )}
          <Footer />
        </Scroll>
      </Div>

      <ThemedBottomSheetModal ref={seasonsModalRef}>
        <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 10 }}>
          {availableSeasons.data?.map((i) => (
            <TouchableOpacity
              key={i.season_num}
              style={{ padding: 5 }}
              onPress={() => {
                setCurrSeason(i.season_num);
                seasonsModalRef.current?.dismiss();
              }}
            >
              <H1 huge center>
                S{i.season_num}
              </H1>
            </TouchableOpacity>
          ))}
        </BottomSheetScrollView>
      </ThemedBottomSheetModal>

      <ThemedBottomSheetModal ref={linkModalRef}>
        <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 25 }}>
          <PosterScroll
            header="Matches"
            data={linkMatches.data}
            useGestureHandler={true}
            onPress={(item) => handleSelectLink(item.id)}
          />
        </BottomSheetScrollView>
      </ThemedBottomSheetModal>
    </>
  );
}
