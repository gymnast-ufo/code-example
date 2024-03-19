import { FC, useContext } from "react";
import { ThemeContext } from "styled-components";
import { FlexContainer } from "../../../../../styles/shared-css/shared-components";
import { Text } from "../../../../../styles/shared-css/typography";
import { Sim } from "../../../../../svg";

export const AllIncludedTariff: FC = () => {
  const theme = useContext(ThemeContext);

  const PropIcon = Sim;
  const description = `Всё включено`;

  return (
    <FlexContainer column gap={16} style={{ color: theme.textColor }}>
      <FlexContainer gap={8} alignCenter>
        <PropIcon/>
        <Text weight={500}>{description}</Text>
      </FlexContainer>
    </FlexContainer>
  );
};
