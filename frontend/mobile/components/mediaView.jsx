import { H1, H2, P } from "./elements";
import secToString from "../helpers/secToString";
import {
  CastScroll,
  Backdrop,
  Overview,
  Vote,
  Logo,
  Genres,
  ThemedStatusBar,
  StatusBarFill,
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
      {backdrop_path ? (
        <Backdrop backdrop_path={backdrop_path}>
          <Vote vote_average={vote_average} />
          {/* <Logo logo_path={logo_path} /> */}
        </Backdrop>
      ) : (<StatusBarFill />)}
      <H2 style={{ paddingHorizontal: pad }}>{title}</H2>
      <P dim tiny style={{ paddingHorizontal: pad }}>
        {[year, secToString(duration), genres].filter((i) => i).join(" | ")}
      </P>

      {children}

      <Overview text={overview} />

      <CastScroll data={cast} />
    </>
  );
}
