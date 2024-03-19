import styled from "styled-components";

interface IPhoneNumberChooseStyled {
  offsetTop: number;
}

export const PhoneNumberChooseStyled = styled.div<IPhoneNumberChooseStyled>`
  height: 484px;
  @media screen and (max-width: 767px) {
    height: calc(100svh - ${(p) => p.offsetTop}px);
  }
`;
