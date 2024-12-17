import { useContext } from "react";
import ThemeContext from "../contexts/themeContext";
import { H1, H2, P } from "./elements";
import secToString from "../helpers/secToString";
import { CastScroll, Backdrop, Overview, Vote } from "./ui";

const pad = 10;

export default function MediaView({
  title,
  year,
  genres,
  vote_average,
  overview,
  duration,
  backdrop_path,
  children,
  cast,
}) {
  const theme = useContext(ThemeContext);
  return (
    <>
      <Backdrop backdrop_path={backdrop_path} />

      <Vote vote_average={vote_average} />
      <H1 style={{paddingHorizontal: pad}}>{title}</H1>
      <P dim tiny style={{paddingHorizontal: pad}}>
        {[year, secToString(duration), genres].filter((i) => i).join(" | ")}
      </P>

      {children}

      <Overview text={overview} />

      <CastScroll data={cast} />
    </>
  );
}
