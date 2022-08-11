import { FlatList, View, StyleSheet } from "react-native";
import { useEffect, useState, useLayoutEffect } from "react";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ErrorOverlay from "../components/ui/ErrorOverlay";
import { searchLocations } from "../util/http";
import LocationItem from "../components/LocationItem";

function Search({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [search, setSearch] = useState(" ");
  const [searchResults, setSearchResults] = useState([]);
  useLayoutEffect(() => {
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
    async function getSearchResults(search) {
      console.log("search");
      console.log(search);
      if (search) {
        try {
          const result = await searchLocations(search, -5.852744, 54.597182);
          setSearchResults(result);
        } catch (error) {
          setError(error.message);
        }
        setIsLoading(false);
      }
    }
    // wait for at least two characters to be entered before searching
    if (search.length >= 2) {
      getSearchResults(search);
    }
  }, [search]);

  function renderLocationItem(itemData) {
    function pressHandler() {
      navigation.navigate("locationDetails", {
        locationId: itemData.item._id,
      });
    }
    const item = itemData.item;
    const locationItemProps = {
      id: item._id,
      name: item.name,
      address: item.visitorInfo.address,
      type: item.type,
      distance: (item.distance / 1609.344).toFixed(1),
    };
    return <LocationItem {...locationItemProps} onPress={pressHandler} />;
  }

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

  if (isLoading && search != " ") {
    return (
      <View style={styles.rootContainer}>
        <LoadingOverlay />
      </View>
    );
  } else {
    return (
      <View
        style={styles.rootContainer}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.listView}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item._id}
            renderItem={renderLocationItem}
            style={styles.flatList}
          />
        </View>
      </View>
    );
  }
}

export default Search;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingTop: 0,
  },
  flatList: {
    backgroundColor: "white",
    padding: 4,
    marginBottom: 32,
    marginTop: 145,
  },
});
