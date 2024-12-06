import {
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import useQueries from "../hooks/useQueries";
import { useEffect, useState } from "react";
import { BrowseItem, BrowseList } from "../components/browseList";

export default () => {
  const [searchText, setSearchText] = useState(null);
  const [searchType, setSearchType] = useState(0);
  const media = useQueries();

  useEffect(() => {
    if (searchText) {
      const query = searchText.trim();
      if(!query.length) return

      if (searchType === 0) {
        media.searchMedia(query);
      } else {
        media.fetchMovies(query);
      }
    }
  }, [searchText, searchType]);

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search movies and shows..."
        onChangeText={setSearchText}
      />
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, searchType === 0 ? styles.buttonSelected : {}]}
          onPress={() => setSearchType(0)}
        >
          <Text style={styles.buttonText}>Local</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, searchType === 1 ? styles.buttonSelected : {}]}
          onPress={() => setSearchType(1)}
        >
          <Text style={styles.buttonText}>External</Text>
        </TouchableOpacity>
      </View>

      {/* Parent View of ScrollView needs height specifiend (ex flex:1) for height of ScrollView to render properly */}
      <ScrollView>
        {media.data && (
          <BrowseList>
            {media.data.map((i) => (
              <BrowseItem
                key={i.media_id ?? i.id}
                mediaId={i.media_id}
                tmdbId={searchType === 0 ? i.tmdbId : i.id}
                title={i.title}
                year={searchType === 0 ? i.year : i.release_date?.split("-")[0]}
                backdrop={searchType === 0 ? i.backdrop : i.backdrop_path}
                type={i.type}
              />
            ))}
          </BrowseList>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    borderWidth: 1,
    borderColor: "grey",
    fontSize: 20,
    margin: 10,
    padding: 10,
  },
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
