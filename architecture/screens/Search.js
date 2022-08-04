import { Alert, ScrollView, Text, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ErrorOverlay from "../components/ui/ErrorOverlay";
import { searchLocations } from "../util/http";

function Search({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState();
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

  useEffect(() => {
    async function getSearchResult(search) {
      try {
        const result = await searchLocations(search);
        setSearchResult(result);
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    }
    getSearchResult(search);
  }, []);

  function errorHandler() {
    navigation.goBack();
  }

  if (error && !isLoading) {
    return (
      <ErrorOverlay
        buttonTitle="Go back"
        message={error}
        onConfirm={errorHandler}
      />
    );
  }

  if (isLoading) {
    return <LoadingOverlay />;
  } else {
    return (
      <View
        style={styles.rootContainer}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text>Search query below: </Text>
        <Text>{searchResult}</Text>
      </View>
    );
  }
}

export default Search;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingTop: 500,
  },
});
