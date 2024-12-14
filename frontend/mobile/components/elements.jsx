import {
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useContext } from "react";
import ThemeContext from "../contexts/themeContext";
import Ionicons from "@expo/vector-icons/Ionicons";

const fontTiny = 13;
const fontSmall = 18;
const fontMedium = 23;
const fontLarge = 30;
const fontHuge = 40;

const padding = 15;

export const Div = ({ children, pad }) => {
  const theme = useContext(ThemeContext);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.backgroundColor,
        padding: pad ? padding : 0,
      }}
    >
      {children}
    </View>
  );
};

export const Scroll = ({
  children,
  pad,
  refreshing,
  onRefresh,
  stickyHeaderIndices,
  gap,
}) => {
  return (
    <ScrollView
      contentContainerStyle={{ gap, padding: pad ? padding : 0 }}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : null
      }
      stickyHeaderIndices={stickyHeaderIndices}
    >
      {children}
    </ScrollView>
  );
};

export const H1 = ({ children, dim, serif, numberOfLines }) => {
  if (!children) return;
  const theme = useContext(ThemeContext);

  return (
    <Text
      numberOfLines={numberOfLines}
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

export const H2 = ({ children, dim, serif, numberOfLines }) => {
  if (!children) return;
  const theme = useContext(ThemeContext);

  return (
    <Text
      numberOfLines={numberOfLines}
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

export const H3 = ({ children, dim, serif, numberOfLines }) => {
  if (!children) return;
  const theme = useContext(ThemeContext);

  return (
    <Text
      numberOfLines={numberOfLines}
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

export const P = ({ children, center, dim, numberOfLines, tiny }) => {
  if (!children) return;
  const theme = useContext(ThemeContext);

  return (
    <Text
      numberOfLines={numberOfLines}
      style={{
        color: theme[dim ? "colorDim" : "color"],
        fontSize: tiny ? fontTiny : fontSmall,
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
export const SearchBar = ({
  placeholder,
  value,
  setValue,
  onSubmit,
  autoFocus,
}) => {
  const theme = useContext(ThemeContext);
  return (
    <View
      style={{
        padding,
        backgroundColor: theme.backgroundColor,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          borderColor: theme.colorDim,
          borderWidth: 1,
          alignItems: "center",
          paddingVertical: 7,
          borderRadius: 50,
          flex: 1,
          paddingHorizontal: 10,
        }}
      >
        <Ionicons name="search-outline" size={25} color={theme.color} />
        <TextInput
          autoFocus={autoFocus}
          numberOfLines={1}
          style={{ flex: 1, color: theme.color, fontSize: fontSmall }}
          placeholder={placeholder}
          placeholderTextColor={theme.colorDim}
          onChangeText={setValue}
          value={value}
          onSubmitEditing={onSubmit ?? null}
        />
        {value !== null && (
          <TouchableOpacity onPress={() => setValue(null)}>
            <Ionicons name="close-outline" size={25} color={theme.color} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export const Button = ({ children, grow, onPress }) => {
  const theme = useContext(ThemeContext);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 10,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "grey",
        justifyContent: "center",
        backgroundColor: theme.buttonBackgroundColor,
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

        paddingHorizontal: 8,
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

export const Footer = ({}) => <View style={{ height: 30 }} />;
