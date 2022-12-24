import React from "react";

// components
import FictionEditor from "~/Components/UploadEditor/FictionEditor";

export default function FictionEditorScreen({
  navigation,
  route,
}: any): JSX.Element {
  return <FictionEditor navigation={navigation} route={route} />;
}
