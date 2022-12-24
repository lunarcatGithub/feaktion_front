declare module "authTypeModule" {
  export namespace loginType {
    type login =
      | { type: "userId"; text: string }
      | { type: "password"; text: string | number }
      | {};

    type alertOrValue = { type: string; text: string };
  }
}
