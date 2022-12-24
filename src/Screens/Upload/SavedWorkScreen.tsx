import React from "react";
import SavedWork from "~/Components/SavedWork/SavedWork";

export default function SavedWorkScreen({
  navigation,
  route,
}: any): JSX.Element {
  return <SavedWork navigation={navigation} route={route} />;
}
