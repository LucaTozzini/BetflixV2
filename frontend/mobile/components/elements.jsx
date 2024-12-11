import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useContext } from "react";
import ThemeContext from "../contexts/themeContext";
import Ionicons from "@expo/vector-icons/Ionicons";

const fontTiny = 15;
const fontSmall = 20;
const fontMedium = 30;
const fontLarge = 35;
const fontHuge = 40;

export const Body = ({ children, pad }) => {
  const theme = useContext(ThemeContext);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.backgroundColor,
        padding: pad ? 13 : 0,
        gap: 10,
      }}
    >
      {children}
    </View>
  );
};

export const Div = ({ children, pad }) => {
  return (
    <ScrollView contentContainerStyle={{ gap: 10, padding: pad ? 13 : 0 }}>
      {children}
    </ScrollView>
  );
};

export const H1 = ({ children, dim, serif }) => {
  const theme = useContext(ThemeContext);

  return (
    <Text
      style={{
        color: theme[dim ? "colorDim" : "color"],
        fontSize: fontHuge,
        fontWeight: "bold",
        fontFamily: serif ? "serif" : undefined,
      }}
    >
      {children}
    </Text>
  );
};

export const H2 = ({ children, dim, serif }) => {
  const theme = useContext(ThemeContext);

  return (
    <Text
      style={{
        color: theme[dim ? "colorDim" : "color"],
        fontSize: fontLarge,
        fontWeight: "bold",
        fontFamily: serif ? "serif" : undefined,
      }}
    >
      {children}
    </Text>
  );
};

export const H3 = ({ children, dim, serif }) => {
  const theme = useContext(ThemeContext);
  return (
    <Text
      style={{
        color: theme[dim ? "colorDim" : "color"],
        fontSize: fontMedium,
        fontFamily: serif ? "serif" : undefined,
      }}
    >
      {children}
    </Text>
  );
};

export const P = ({ children, center, dim }) => {
  const theme = useContext(ThemeContext);

  return (
    <Text
      style={{
        color: theme[dim ? "colorDim" : "color"],
        fontSize: fontSmall,
        textAlign: center ? "center" : undefined,
      }}
    >
      {children}
    </Text>
  );
};

/* 
  Searchbar          clear (hide when value is empty)
     |                 |
     v                 v
 ___________________   _
|___________________| |_|

*/
export const SearchBar = ({ placeholder, value, setValue, onSubmit }) => {
  const theme = useContext(ThemeContext);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "stretch",
        height: 47,
        gap: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          borderColor: "grey",
          borderWidth: 1,
          alignItems: "center",
          paddingHorizontal: 7,
          borderRadius: 50,
          flex: 1,
          paddingHorizontal: 10,
        }}
      >
        <Ionicons name="search-outline" size={25} color={theme.color} />
        <TextInput
          numberOfLines={1}
          style={{ flex: 1, color: theme.color, fontSize: fontSmall }}
          placeholder={placeholder}
          placeholderTextColor={theme.colorDim}
          onChangeText={setValue}
          value={value}
          onSubmitEditing={onSubmit ?? null}
        />
      </View>

      <View
        style={{
          display: value === null || value === "" ? "none" : "flex",
          aspectRatio: 1,
          borderRadius: "50%",
          borderWidth: 1,
          borderColor: "grey",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity onPress={() => setValue(null)}>
          <Ionicons name="close-outline" size={25} color={theme.color} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const Button = ({ children, grow, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 10,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "grey",
        justifyContent: "center",
        borderRadius: 10,
        alignItems: "center",
        gap: 10,
        flex: grow ? 1 : undefined,
      }}
    >
      {children}
    </TouchableOpacity>
  );
};

export const Chip = ({ children }) => {
  const theme = useContext(ThemeContext);
  return (
    <Text
      style={{
        color: theme.colorDim,
        fontSize: fontTiny,
        textAlign: "center",

        paddingHorizontal: 15,
        paddingVertical: 5,

        borderWidth: 1,
        borderColor: theme.colorDim,
        borderRadius: 20,
      }}
    >
      {children}
    </Text>
  );
};
