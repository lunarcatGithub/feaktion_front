import React from "react";
import EditorWorkCheck from "~/Components/WorkCheck/EditorWorkCheck";

export default function EditorWorkCheckScreen({
  navigation,
  route,
}: any): JSX.Element {
  return <EditorWorkCheck navigation={navigation} route={route} />;
}
