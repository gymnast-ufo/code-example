import styled from "styled-components";
import { Text } from "../../styles/shared-css/typography";

export const CompactBoldText = styled.div`
  font-family: Compact;
  font-size: 17px;
  font-weight: 500;
  line-height: 24px;
`;

export const CompactGreyLabel = styled.div`
  font-family: Compact;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${(p) => p.theme.secondTextColor};
`;

export const GreyInfoBlock = styled.div`
  background: ${(p) => p.theme.backgroundTertiary};
  font-family: Compact;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  padding: 12px 16px;
  border-radius: 12px;
`;

export const CrossedText = styled.span`
  display: inline-block;
  position: relative;
  overflow: hidden;
  color: ${(p) => p.theme.secondTextColor};

  &:before {
    content: "";
    display: inline-block;
    position: absolute;
    width: 105%;
    height: 2px;
    top: 50%;
    transform: rotate(-7.851deg) translateY(-50%);
    background-color: ${(p) => p.theme.brandRed};
  }
`;

export const PriceCardWrapper = styled.span`
  display: inline-flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 8px;
`;

export const Variant_2Styled = styled.div`
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 767px) {
    padding: 20px;
    height: calc(100svh - ${document.getElementById("app")?.offsetTop + 40}px);
  }

  @media screen and (max-height: 812px) {
    height: auto;
  }
`;

export const Variant_3Styled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media screen and (max-width: 767px) {
    height: calc(100svh - ${document.getElementById("app")?.offsetTop}px);
  }
`;

export const OrderContentStyled = styled.div`
  @media screen and (max-width: 767px) {
    flex: 1;
  }
`;

export const ButtonWrapper_V2 = styled.div`
  @media screen and (max-width: 767px) {
    margin: -20px;
    background: ${(p) => p.theme.backgroundElevatedColor};
    padding: 20px 20px 24px 20px;
    border-radius: 24px 24px 0 0;
  }
`;

export const ButtonWrapper_V3 = styled.div`
  background: ${(p) => p.theme.backgroundElevatedColor};
  padding: 20px;
  border-radius: 24px;

  @media screen and (max-width: 767px) {
    padding: 20px 20px 24px 20px;
    border-radius: 24px 24px 0 0;
  }
`;

interface ContentBlock_2StyledInterface {
  hasIcon?: boolean;
  top?: boolean;
  noBottom?: boolean;
}

export const ContentBlock_2Styled = styled.div<ContentBlock_2StyledInterface>`
  background: ${(p) => p.theme.backgroundElevatedColor};
  border-radius: ${(p) => (p.top ? "24px" : p.hasIcon ? "18px" : "16px")};
  padding: 32px;
  padding-bottom: ${(p) => (p.noBottom ? 0 : "32px")};

  @media screen and (max-width: 1679px) {
    padding: 28px;
    padding-bottom: ${(p) => (p.noBottom ? 0 : "28px")};
  }

  @media screen and (max-width: 1439px) {
    padding: 24px;
    padding-bottom: ${(p) => (p.noBottom ? 0 : "24px")};
  }

  @media screen and (max-width: 1279px) {
    padding: 20px;
    padding-bottom: ${(p) => (p.noBottom ? 0 : "20px")};
  }
  @media screen and (max-width: 767px) {
    padding: ${(p) => (p.hasIcon ? "16px" : "12px 16px")};
    border-radius: ${(p) =>
      p.top ? "0px 0px 24px 24px" : p.hasIcon ? "18px" : "16px"};
    padding-bottom: ${(p) => (p.noBottom ? 0 : "16px")};
  }
`;

interface IBoxWithRightPadding {
  ignore?: boolean;
  bottom?: boolean;
}

export const BoxWithRightPadding = styled.div<IBoxWithRightPadding>`
  padding-right: ${(p) => (p.ignore ? 0 : "32px")};
  padding-bottom: ${(p) => (p.bottom ? "32px" : 0)};

  @media screen and (max-width: 1679px) {
    padding-right: ${(p) => (p.ignore ? 0 : "28px")};
    padding-bottom: ${(p) => (p.bottom ? "28px" : 0)};
  }

  @media screen and (max-width: 1439px) {
    padding-right: ${(p) => (p.ignore ? 0 : "24px")};
    padding-bottom: ${(p) => (p.bottom ? "24px" : 0)};
  }

  @media screen and (max-width: 1279px) {
    padding-right: ${(p) => (p.ignore ? 0 : "20px")};
    padding-bottom: ${(p) => (p.bottom ? "20px" : 0)};
  }
  @media screen and (max-width: 767px) {
    padding-right: ${(p) => (p.ignore ? 0 : "16px")};
    padding-bottom: ${(p) => (p.bottom ? "16px" : 0)};
  }
`;

export const CardTitle = styled.div`
  position: absolute;
  padding: 32px;
  width: 100%;
  margin-right: -32px;

  @media screen and (max-width: 1679px) {
    padding: 28px;
    margin-right: -28px;
  }

  @media screen and (max-width: 1439px) {
    padding: 24px;
    margin-right: -24px;
  }

  @media screen and (max-width: 1279px) {
    padding: 20px;
    margin-right: -20px;
  }
  @media screen and (max-width: 767px) {
    padding: 16px;
    margin-right: -16px;
  }
`;
