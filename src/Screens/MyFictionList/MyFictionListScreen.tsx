import React from "react";

// components
import MyFictionList from "~/Components/FictionList/MyFictionList";

export default function MyFictionListScreen({ navigation }: any): JSX.Element {
  return <MyFictionList navigation={navigation} />;
}
