import { FC } from "react";
import { ITariffType } from "../types";
import variables from "../../../../../styles/variables";
import { StyledTypeMark } from "./index.styles";

interface ITariffTypeMark {
  type: ITariffType;
}

const tariffTypeLabels = {
  [ITariffType.DEFAULT]: '',
  [ITariffType.CUSTOMIZE]: 'Настраиваемый',
  [ITariffType.FAMILY]: 'Семейный',
};
const labelsColors = {
  [ITariffType.CUSTOMIZE]: variables.colors.constantLightBlueberry,
  [ITariffType.FAMILY]: variables.colors.constantNormalOrange,
};

export const TariffTypeMark: FC<ITariffTypeMark> = ({ type }) => {
  if (type === ITariffType.DEFAULT) {
    return <></>;
  }

  return (
    <StyledTypeMark background={labelsColors[type]}>
      {tariffTypeLabels[type]}
    </StyledTypeMark>
  );
};
