import { View, ScrollView, StyleSheet } from "react-native";
import { Button } from "../../../components/buttons";
import useQueries from "../../../hooks/useQueries";
import { useContext, useEffect, useState } from "react";
import { BrowseItem, BrowseList } from "../../../components/browseList";
import ThemeContext from "../../../contexts/themeContext";
export default () => {
  const theme = useContext(ThemeContext);
  const [browseType, setBrowseType] = useState(0);
  const latest = useQueries();
  const popular = useQueries();

  useEffect(() => {
    latest.selectMediaCollection(0, 10, "year", true, "any");
    popular.fetchPopularMovies();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View style={styles.buttons}>
        <Button
          handlePress={() => setBrowseType(0)}
          text="Latest on Disc"
          focused={browseType === 0}
        />
        <Button
          handlePress={() => setBrowseType(1)}
          text="Popular Movies"
          focused={browseType === 1}
        />
      </View>

      {/* Set height of parent View for ScrollView height to be properly set */}
      <ScrollView contentContainerStyle={styles.scroll}>
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
                duration={i.duration}
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
                duration={i.duration}
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
    padding: 10,
    gap: 10,
    // borderBottomWidth: 1,
    // borderColor: "grey"
  },
  scroll: {
    marginHorizontal: 10,
    paddingBottom: 20,
  },
});
