import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function LocationItem({ id, name, address, type, onPress }) {
  return (
    <View style={styles.viewContainer} key={id}>
      <Pressable onPress={onPress}>
        <View style={styles.innerContainer}>
          <View style={styles.typeView}>
            <Ionicons name="home-outline" size={30} />
          </View>
          <View style={styles.nameAddressView}>
            <Text style={styles.nameView}>{name}</Text>
            <Text style={styles.addressView}>{address}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export default LocationItem;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: "white",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  nameView: {
    fontWeight: "bold",
  },
  addressView: {
    color: "#888",
  },
  textInput: {
    width: "100%",
    height: 35,
    fontSize: 18,
    flex: 1,
  },
  typeView: {
    width: 75,
    flex: 0.15,
  },
  nameAddressView: {
    flex: 0.85,
    alignItems: "flex-start",
  },
  innerContainer: {
    flexDirection: "row",
  },
});
