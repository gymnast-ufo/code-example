import styled from "styled-components";
import { FC, MouseEventHandler, PropsWithChildren } from "react";
import variables from "../../../../../styles/variables";

interface ICategoryFilterElement {
  className?: string;
  onClick: MouseEventHandler<HTMLDivElement>;
  noModal?: boolean;
}

const FilterButton: FC<PropsWithChildren<ICategoryFilterElement>> = ({
  children,
  ...props
}) => <div {...props}>{children}</div>;
export const CategoryFilterElement = styled(FilterButton)`
  padding: 6px 16px;
  background-color: ${(p) =>
    p.noModal
      ? p.theme.backgroundInactiveColor
      : p.theme.backgroundSecondaryColor};
  white-space: nowrap;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${(p) => p.theme.textColor};
  cursor: pointer;

  &.active {
    background-color: ${(p) =>
      p.noModal ? p.theme.controlsSecondary : p.theme.buttonsPrimary};
    color: ${(p) =>
      p.noModal
        ? p.theme.secondaryControlTextColor
        : p.theme.primaryControlTextColor};
  }
`;

export const CategoriesFilterContainer = styled.div`
  overflow: hidden;
`;

interface ICategoriesContainer {
  noModal?: boolean;
}

export const CategoriesContainer = styled.div<ICategoriesContainer>`
  display: flex;
  flex-flow: row wrap;
  gap: 8px 4px;
  padding-right: ${(p) => (p.noModal ? "32px" : "0")};

  @media screen and (max-width: 1679px) {
    padding-right: ${(p) => (p.noModal ? "28px" : "0")};
  }

  @media screen and (max-width: 1439px) {
    padding-right: ${(p) => (p.noModal ? "24px" : "0")};
  }

  @media screen and (max-width: 1279px) {
    padding-right: ${(p) => (p.noModal ? "20px" : "0")};
  }
  @media screen and (max-width: 767px) {
    padding: ${(p) => (p.noModal ? "0 16px" : "0")};

    flex-flow: row nowrap;
  }
`;
