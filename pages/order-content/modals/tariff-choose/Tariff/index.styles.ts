import styled from "styled-components";
import variables from "../../../../../styles/variables";
import { Property } from "csstype";

export const DefaultIcon = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${variables.colors.white};
  border-radius: 50%;
  color: ${variables.colors.sharkColor};
  background-color: ${variables.colors.whiteSmokeColor2};
  font-weight: 500;
`;

interface IStyledTypeMark {
  background?: Property.BackgroundColor;
}
export const StyledTypeMark = styled.div<IStyledTypeMark>`
  display: flex;
  align-self: flex-start;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  padding: 2px 4px;
  border-radius: 4px;
  color: ${(p) => p.theme.textColor};
  background-color: ${(p) => p.background};
`;
