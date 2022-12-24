import React from "react";

// components
import UploadCoverEdit from "~/Components/UploadCoverEdit/UploadCoverEdit";

export default function UploadCoverEditScreen({
  navigation,
  route,
}: any): JSX.Element {
  return <UploadCoverEdit navigation={navigation} route={route} />;
}
