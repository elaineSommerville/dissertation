import { useLayoutEffect } from "react";
import { Button, Text, View } from "react-native";
// import useNavigation from "@react-navigation/native";

function Profile({ navigation, route }) {
  // const navigation = useNavigation();
  console.log(navigation.getParent());
  console.log(route);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <Button
            onPress={() => navigation.navigate(route.params.parent)}
            title="< Back"
            color="white"
          />
        );
      },
    });
  }, []);
  return (
    <View>
      <Text>Profile page</Text>
    </View>
  );
}

export default Profile;
