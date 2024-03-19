import styled from "styled-components";
import variables from "../../../../../styles/variables";

export const MatchedNumber = styled.span`
  background-color: ${(p) =>
    p.theme.name === "light"
      ? variables.colors.constantLightestRaspberry
      : variables.colors.constantDarkestRaspberry};
`;
export const GovCode = styled.span`
  color: ${(p) => p.theme.tertiaryTextColor};
`;

interface IListContainer {
  noModal?: boolean;
}

export const ListContainer = styled.div<IListContainer>`
  display: flex;
  flex-direction: column;
  gap: 24px;

  overflow: auto;
`;
