import { View, Text, ScrollView } from "react-native";
import useQueries from "../hooks/useQueries";
import { useEffect } from "react";
import { BrowseItem, BrowseList } from "../components/browseList";
export default () => {
  const latest = useQueries();

  useEffect(() => {
    latest.selectMediaCollection(0, 10, "year", true, "any");
  }, []);

  return (
    <ScrollView>
      <BrowseList title={"Latest on Disc"}>
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
    </ScrollView>
  );
};
