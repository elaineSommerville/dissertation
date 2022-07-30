import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LOCATIONS } from "../data/dummy-data";
import LocationItem from "../components/LocationItem";
import { useEffect, useState } from "react";
import { fetchLocations } from "../util/http";

function DiscoveryScreen({ navigation }) {
  const [fetchedLocations, setFetchedLocations] = useState([]);
  useEffect(() => {
    async function getLocations() {
      const locations = await fetchLocations();
      setFetchedLocations(locations);
      const displayedLocations = fetchedLocations.filter((locationItem) => {
        return locationItem;
      });
    }
    getLocations();
  }, []);

  const displayedLocations = fetchedLocations.filter((locationItem) => {
    return locationItem;
  });

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

  return (
    <View style={styles.rootContainer}>
      <View style={styles.searchView}>
        <TextInput style={styles.textInput} placeholder="search"></TextInput>
        <Ionicons name="search" size={18} color="black" />
      </View>
      <View style={styles.listView}>
        {/* <ScrollView alwaysBounceVertical={false} style={styles.scrollViewView}>
          {displayedLocations.map((item, id) => (
            <LocationItem item={item} />
          ))}
        </ScrollView> */}
        <FlatList
          data={displayedLocations}
          keyExtractor={(item) => item._id}
          renderItem={renderLocationItem}
          style={styles.flatList}
        />
      </View>
    </View>
  );
}
export default DiscoveryScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    marginHorizontal: 45,
  },
  searchView: {
    marginVertical: 12,
    flexDirection: "row",
    paddingBottom: 10,
  },
  listView: {},
  textInput: {
    width: "100%",
    height: 35,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "black",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "black",
    padding: 6,
    fontSize: 18,
    flex: 1,
  },
  flatList: {
    backgroundColor: "white",
    padding: 4,
    marginBottom: 32,
  },
});
