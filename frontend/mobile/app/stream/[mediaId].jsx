import { useEvent } from "expo";
import { useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import ServerContext from "../../contexts/serverContext";

export default () => {
  const serverAddress = useContext(ServerContext);
  const params = useLocalSearchParams();
  const player = useVideoPlayer(
    // If params include s (seasonNum) and e (episodeNum), assume tv show and query episode
    `http://${serverAddress}/stream/${params.mediaId}${
      params.s && params.e ? `/s${params.s}-e${params.e}` : ""
    }`,
    (player) => {
      player.loop = false;
      player.play();
    }
  );
  const { status, error } = useEvent(player, "statusChange", {
    status: player.status,
  });
  useEffect(() => {
    // console.log(error, status)
  }, [status, error]);

  return (
    <View style={styles.container}>
      <VideoView player={player} style={styles.videoView} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  videoView: {
    flex: 1,
  },
});
