import styled from "styled-components";

interface ITariffComponentStyled {
  offsetTop: number;
}

export const TariffComponentStyled = styled.div<ITariffComponentStyled>`
  overflow: auto;
  height: 484px;
  overflow: auto;

  padding: 0 32px 32px 32px;
  margin-left: -32px;

  @media screen and (max-width: 1679px) {
    margin-left: -28px;
    padding: 0 28px 28px 28px;
  }

  @media screen and (max-width: 1439px) {
    margin-left: -24px;
    padding: 0 24px 24px 24px;
  }

  @media screen and (max-width: 1279px) {
    margin-left: -20px;
    padding: 0 20px 20px 20px;
  }

  @media screen and (max-width: 767px) {
    margin-left: -16px;
    padding: 0 16px 16px 16px;
    height: calc(100svh - ${(p) => p.offsetTop}px);
  }
`;
