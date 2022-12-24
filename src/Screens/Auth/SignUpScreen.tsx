import React, { useState } from "react";
import { SignUpFirst } from "~/Components/SignUp/SignUpFirst";

// store
import { SignUpFirstStore } from "@Store/SignUpFirstStore";

export default function SignUpScreen({ navigation }: any) {
  return <SignUpFirst navigation={navigation} />;
}
