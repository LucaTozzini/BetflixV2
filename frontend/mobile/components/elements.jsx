import {
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { useContext } from "react";
import ThemeContext from "../contexts/themeContext";
import Ionicons from "@expo/vector-icons/Ionicons";

const fontTiny = 12;
const fontSmall = 15;
const fontMedium = 18;
const fontLarge = 20;
const fontHuge = 22;

const padding = 10;

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
      showsVerticalScrollIndicator={false}
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

export const AnimatedScroll = ({
  children,
  pad,
  refreshing,
  onRefresh,
  stickyHeaderIndices,
  gap,
  onScroll,
}) => {
  return (
    <Animated.ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap, padding: pad ? padding : 0 }}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : null
      }
      stickyHeaderIndices={stickyHeaderIndices}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      {children}
    </Animated.ScrollView>
  );
};

export const H1 = ({
  children,
  center,
  dim,
  serif,
  numberOfLines,
  style,
  pad,
}) => {
  if (!children) return null;
  const theme = useContext(ThemeContext);
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          color: theme[dim ? "colorDim" : "color"],
          fontSize: fontHuge,
          fontWeight: "bold",
          fontFamily: serif ? "serif" : undefined,
          textAlign: center ? "center" : undefined,
          paddingHorizontal: pad ? padding : 0,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const H2 = ({ children, center, dim, serif, numberOfLines, style, pad }) => {
  if (!children) return;
  const theme = useContext(ThemeContext);

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          color: theme[dim ? "colorDim" : "color"],
          fontSize: fontLarge,
          fontWeight: "bold",
          fontFamily: serif ? "serif" : undefined,
          textAlign: center ? "center" : undefined,
          paddingHorizontal: pad ? padding : 0,

        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const H3 = ({ children, center, dim, serif, numberOfLines, style, pad }) => {
  if (!children) return;
  const theme = useContext(ThemeContext);

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          color: theme[dim ? "colorDim" : "color"],
          fontSize: fontMedium,
          fontFamily: serif ? "serif" : undefined,
          textAlign: center ? "center" : undefined,
          fontWeight: "bold",
          paddingHorizontal: pad ? padding : 0,

        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const P = ({ children, text, center, dim, numberOfLines, tiny, style, pad }) => {
  if (!children) return;
  const theme = useContext(ThemeContext);

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          color: theme[dim ? "colorDim" : "color"],
          fontSize: tiny ? fontTiny : fontSmall,
          textAlign: center ? "center" : undefined,
          paddingHorizontal: pad ? padding : 0,

        },
        style,
      ]}
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

Must be placed inside a scrollview for it to display properly, don't know why but it works
*/
export const SearchBar = ({
  placeholder,
  value,
  setValue,
  onSubmit,
  autoFocus,
  numberPad,
  style,
}) => {
  const theme = useContext(ThemeContext);
  return (
    <View
      style={[
        {
          padding,
          backgroundColor: theme.backgroundColor,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          borderColor: theme.colorDim,
          borderWidth: 1,
          alignItems: "center",
          borderRadius: 50,
          paddingHorizontal: 10,
        }}
      >
        {!numberPad && (
          <Ionicons name="search-outline" size={25} color={theme.color} />
        )}
        <TextInput
          autoFocus={autoFocus}
          numberOfLines={1}
          textAlign={numberPad ? "center" : undefined}
          style={{
            flex: 1,
            color: theme.color,
            fontSize: fontSmall,
            height: 45,
          }}
          placeholder={placeholder}
          placeholderTextColor={theme.colorDim}
          onChangeText={setValue}
          value={value}
          onSubmitEditing={onSubmit ?? null}
          keyboardType={numberPad ? "numeric" : "default"}
        />
        {!numberPad && value !== null && (
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
        flex: grow ? 1 : undefined,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "grey",
        justifyContent: "center",
        backgroundColor: theme.buttonBackgroundColor,
        borderRadius: 10,
        alignItems: "center",
        gap: 10,
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

export const Footer = ({}) => <View style={{ height: 70 }} />;
