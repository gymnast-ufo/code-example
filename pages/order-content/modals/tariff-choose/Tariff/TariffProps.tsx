import { FC, useContext, useMemo } from "react";
import { ThemeContext } from "styled-components";
import { FlexContainer } from "../../../../../styles/shared-css/shared-components";
import { Text } from "../../../../../styles/shared-css/typography";
import { Call, Mail, Sim } from "../../../../../svg";
import { ITariffConditions } from "../../../../../helpers/getTariffConditions";
import { ITariffPropType } from "../../../../../types/tariff";

interface ITariffProps {
  properties: ITariffConditions;
  noModal?: boolean;
}

const propIcons = {
  [ITariffPropType.internet]: Sim,
  [ITariffPropType.sms]: Mail,
  [ITariffPropType.voice]: Call,
};

export const TariffProps: FC<ITariffProps> = ({ properties, noModal }) => {
  const theme = useContext(ThemeContext);
  const isMobile = window.innerWidth < 768;
  const propsGap = isMobile ? 8 : 12;

  const renderedProps = useMemo(() => {
    const entries = Object.entries(properties);
    return entries.map(([key, condition]) => {
      const { value, unitOfMeasure } = condition;
      const PropIcon = propIcons[key as ITariffPropType];
      const description = `${value} ${unitOfMeasure}`;

      return (
        <FlexContainer key={key} gap={8} alignCenter>
          <PropIcon />
          <Text weight={500}>{description}</Text>
        </FlexContainer>
      );
    });
  }, [properties]);

  return (
    <FlexContainer
      column
      gap={noModal ? 8 : propsGap}
      style={{ color: theme.textColor }}
    >
      {renderedProps}
    </FlexContainer>
  );
};
