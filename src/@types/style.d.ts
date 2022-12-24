declare namespace Style {
  type Theme = {
    toggle: string | null;
  };
}

declare module "@emotion/styled" {
  import { CreateStyled } from "@emotion/styled/types/index";

  export * from "@emotion/styled/types/index";
  const customStyled: CreateStyled<App.Theme>;
  export default customStyled;
}
