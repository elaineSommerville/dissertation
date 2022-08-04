import { ScrollView, Text, View } from "react-native";
import { useEffect, useState } from "react";

function Search({ navigation }) {
  const [search, setSearch] = useState("");
  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: "Search for buildings, architects, addresses...",
        hideNavigationBar: false,
        autoFocus: true,
        onChangeText: (event) => setSearch(event.nativeEvent.text),
      },
    });
  }, [navigation]);
  return (
    <View contentInsetAdjustmentBehavior="automatic">
      <Text>hello - in search</Text>
    </View>
  );
}

export default Search;
