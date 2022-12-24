import React from "react";
import InheritFiction from "~/Components/InheritFiction/InheritFiction";

export default function InheritFictionScreen({
  navigation,
  route,
}: any): JSX.Element {
  return <InheritFiction navigation={navigation} route={route} />;
}
