import React from "react";
import UserNotice from "~/Components/UserNotice/UserNotice";

export default function UserNoticeScreen({ navigation, route }: any) {
  return <UserNotice navigation={navigation} route={route} />;
}
