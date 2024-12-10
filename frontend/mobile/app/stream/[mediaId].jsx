import { useEvent } from "expo";
import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
const SERVER = "192.168.1.76:5340";

export default () => {
  const params = useLocalSearchParams();
  const player = useVideoPlayer(
    // If params include s (seasonNum) and e (episodeNum), assume tv show and query episode
    `http://${SERVER}/stream/${params.mediaId}${
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
