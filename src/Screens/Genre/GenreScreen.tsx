import React from "react";
import { Genre } from "~/Components/Common/Genre";

export default function GenreScreen({ navigation, route }: any): JSX.Element {
  return <Genre navigation={navigation} route={route} />;
}
