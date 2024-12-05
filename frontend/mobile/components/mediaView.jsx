import { View, Text } from "react-native"
export default function MediaView({title, year, genres, vote, overview}) {
  return (
    <View>
      <View >
        <Text style={{fontSize: 50, fontWeight: "bold"}}>{title}</Text>
        <Text style={{fontSize: 40, color: "darkgrey"}}>{year}</Text>
        <Text style={{fontSize: 20, color: "darkgrey", fontWeight: "bold"}}>{genres}</Text>
        {vote && <Text style={{fontSize: 20}}>{"⭐".repeat(vote)}{"🍅".repeat(5-vote)}</Text>}
        <Text style={{fontSize: 20}}>{overview}</Text>
      </View>
    </View>
  )
}