import React from "react";
import UserNoticeUpload from "~/Components/UserNoticeUpload/UserNoticeUpload";

export default function UserNoticeUploadScreen({
  navigation,
  route,
}: any): JSX.Element {
  return <UserNoticeUpload navigation={navigation} route={route} />;
}
