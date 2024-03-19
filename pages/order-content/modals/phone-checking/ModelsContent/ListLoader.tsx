import { FC } from "react";
import { FlexContainer, Skeleton } from "../../../../../styles/shared-css/shared-components";

export const ListLoader: FC = () => {
  const skeletons = Array.from(Array(5), (_, index: number) => (
    <Skeleton key={index} height="24px" width="100%" />
  ));

  return (
    <FlexContainer column gap={20}>{skeletons}</FlexContainer>
  );
};
