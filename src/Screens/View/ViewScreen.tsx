import React from "react";

// components
import View from "~/Components/View/View";

export default function ViewScreen({ navigation, route }: any): JSX.Element {
  return <View navigation={navigation} route={route} />;
}
