import React from "react";
import UploadCover from "~/Components/UploadCover/UploadCover";

export default function UploadCoverScreen({
  navigation,
  route,
}: any): JSX.Element {
  return <UploadCover navigation={navigation} route={route} />;
}
