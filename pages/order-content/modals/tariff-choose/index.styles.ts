import styled from "styled-components";
import { FlexContainer } from "../../../../styles/shared-css/shared-components";

interface IStylesTariff {
  noModal?: boolean;
}

export const StyledTariff = styled(FlexContainer)<IStylesTariff>`
  padding: 20px;
  border-radius: 24px;
  background-color: ${(p) =>
    p.noModal ? p.theme.backgroundModalColor : p.theme.backgroundElevatedColor};
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.12))
    drop-shadow(0px 8px 8px rgba(0, 0, 0, 0.08));
`;
