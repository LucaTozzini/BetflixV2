import { H1, P } from "./elements";
import secToString from "../helpers/secToString";
import {
  CastScroll,
  Backdrop,
  Overview,
  Vote,
  Logo,
  Genres,
  ThemedStatusBar,
} from "./ui";
import { Image } from "react-native";
const pad = 10;

export default function MediaView({
  title,
  year,
  genres,
  vote_average,
  overview,
  duration,
  backdrop_path,
  logo_path,
  children,
  cast,
}) {
  return (
    <>
      {(backdrop_path || logo_path || genres) && (
        <Backdrop backdrop_path={backdrop_path}>
          <Logo logo_path={logo_path} />
        </Backdrop>
      )}
      <Genres genres={genres?.split(/[,&]/)} />
      <Vote vote_average={vote_average} />
      <H1 style={{ paddingHorizontal: pad }}>{title}</H1>
      <P dim tiny style={{ paddingHorizontal: pad }}>
        {[year, secToString(duration)].filter((i) => i).join(" | ")}
      </P>

      {children}

      <Overview text={overview} />

      <CastScroll data={cast} />
    </>
  );
}
