import { useContext } from "react";
import ThemeContext from "../contexts/themeContext";
import { Chip, H2, P } from "./elements";
import { View, Image, TouchableOpacity } from "react-native";

export const SpotLight = ({ header, title, poster, genres, onPress }) => {
  const theme = useContext(ThemeContext);
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.6 : 1}
      onPress={onPress}
      style={{
        gap: 10,
        alignItems: "center",
      }}
    >
      {header && <H2 serif>{header}</H2>}
      <Image
        source={{ uri: poster }}
        style={{
          height: 350,
          aspectRatio: 2 / 3,
          borderRadius: 20,
        }}
      />
      <P center>
        {title}
        <P dim> 2024</P>
      </P>
      {genres && (
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {genres.map((i, index) => (
            <Chip key={index}>{i}</Chip>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};
