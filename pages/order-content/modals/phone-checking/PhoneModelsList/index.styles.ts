import styled from "styled-components";

export const PhoneModel = styled.div`
  display: flex;
  flex-flow: row nowrap;
  padding: 8px 0;
  border-bottom: 1px solid ${(p) => p.theme.backgroundStrokeColor};
  cursor: pointer;
`;
