import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import useQueries from "../hooks/useQueries";
import { useEffect, useState } from "react";
import { BrowseItem, BrowseList } from "../components/browseList";
export default () => {
  const [browseType, setBrowseType] = useState(0);
  const latest = useQueries();
  const popular = useQueries();

  useEffect(() => {
    latest.selectMediaCollection(0, 10, "year", true, "any");
    popular.fetchPopularMovies();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, browseType === 0 ? styles.buttonSelected : {}]}
          onPress={() => setBrowseType(0)}
        >
          <Text style={styles.buttonText}>Latest on Disc</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, browseType === 1 ? styles.buttonSelected : {}]}
          onPress={() => setBrowseType(1)}
        >
          <Text style={styles.buttonText}>Popular Movies</Text>
        </TouchableOpacity>
      </View>

      {/* Set height of parent View for ScrollView height to be properly set */}
      <ScrollView>
        {browseType === 0 && (
          <BrowseList>
            {latest.data?.map((i) => (
              <BrowseItem
                key={i.media_id}
                mediaId={i.media_id}
                title={i.link_title ?? i.title}
                year={i.year}
                type={i.type}
                backdrop={i.backdrop}
              />
            ))}
          </BrowseList>
        )}

        {browseType === 1 && (
          <BrowseList>
            {popular.data?.map((i) => (
              <BrowseItem
                key={i.id}
                tmdbId={i.id}
                title={i.title}
                year={i.release_date.split("-")[0]}
                type="movie"
                backdrop={i.backdrop_path}
              />
            ))}
          </BrowseList>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    marginHorizontal: 10,
    gap: 10,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderWidth: 1,
    flex: 1,
    borderColor: "grey",
  },
  buttonSelected: {
    backgroundColor: "lightblue",
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
  },
});
