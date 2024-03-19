import { FC } from "react";
import { StyledTariff } from "../index.styles";
import {
  FlexContainer,
  Skeleton,
} from "../../../../../styles/shared-css/shared-components";

interface ISkeletonTariff {
  noModal?: boolean;
}

export const SkeletonTariff: FC<ISkeletonTariff> = ({ noModal }) => {
  return (
    <StyledTariff column gap={16} noModal={noModal}>
      <Skeleton height="28px" width="70%" />

      <FlexContainer column gap={8}>
        <Skeleton height="17px" width="100%" />
        <Skeleton height="17px" width="100%" />
      </FlexContainer>

      <Skeleton height="24px" width="100px" />
      <Skeleton height="24px" width="100px" />
      <Skeleton height="24px" width="100px" />

      <Skeleton height="28px" width="120px" />
    </StyledTariff>
  );
};
