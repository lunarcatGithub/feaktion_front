import React from "react";

// components
import FictionScene from "~/Components/EpisodeScene/FictionScene";

export default function FictionSceneScreen({
  navigation,
  route,
}: any): JSX.Element {
  return <FictionScene navigation={navigation} route={route} />;
}
