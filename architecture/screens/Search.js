import { FlatList, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ErrorOverlay from "../components/ui/ErrorOverlay";
import { searchLocations } from "../util/http";
import LocationItem from "../components/LocationItem";

function Search({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [search, setSearch] = useState(" ");
  const [searchResults, setSearchResults] = useState([]);
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
    async function getSearchResults(search) {
      console.log("search");
      console.log(search);
      if (search) {
        try {
          const result = await searchLocations(search);
          setSearchResults(result);
          console.log("");
          console.log(result);
          console.log("");
        } catch (error) {
          setError(error.message);
        }
        setIsLoading(false);
      }
    }
    getSearchResults(search);
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
      address: item.address,
      type: item.type,
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

  if (isLoading) {
    return <LoadingOverlay />;
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
