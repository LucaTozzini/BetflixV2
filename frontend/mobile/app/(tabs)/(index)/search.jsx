import {useEffect, useState } from "react";

import useQueries from "../../../hooks/useQueries";

import { Scroll, SearchBar, Div, Footer } from "../../../components/elements";
import { PosterScroll, StatusBarFill } from "../../../components/ui";

export default () => {
  const local = useQueries();
  const external = useQueries();
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (!value) {
      local.reset();
      external.reset();
      return;
    }

    local.searchMedia(value);
    external.fetchMovies(value);
  }, [value]);

  return (
    <Div>
      <StatusBarFill />
      <Scroll gap={10} stickyHeaderIndices={[0]}>
        <SearchBar
          autoFocus
          value={value}
          setValue={setValue}
          placeholder={"Search movies and shows..."}
        />

        <PosterScroll header={"On Disc"} data={local.data} />
        <PosterScroll header={"External"} data={external.data} />
        <Footer />
      </Scroll>
    </Div>
  );
};
