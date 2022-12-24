import React from "react";

// components
import CommentNotification from "~/Components/Notification/Comment_Notification";

export default function CommentNotificationScreen({
  navigation,
}: any): JSX.Element {
  return <CommentNotification navigation={navigation} />;
}
