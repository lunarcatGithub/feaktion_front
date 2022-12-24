import React from "react";
import Comment from "~/Components/Comment/Comment";

export default function ReplyScreen({ navigation, route }: any): JSX.Element {
  return <Comment navigation={navigation} route={route} />;
}
