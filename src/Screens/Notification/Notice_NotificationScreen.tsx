import React from "react";

// compoentns
import NoticeNotification from "~/Components/Notification/Notice_Notification";

export default function NoticeNotificationScreen({
  navigation,
}: any): JSX.Element {
  return <NoticeNotification navigation={navigation} />;
}
