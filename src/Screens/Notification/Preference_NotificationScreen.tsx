import React from "react";

// components
import PreferenceNotification from "~/Components/Notification/Preference_Notification";

export default function PreferenceNotificationScreen({
  navigation,
}: any): JSX.Element {
  return <PreferenceNotification navigation={navigation} />;
}
