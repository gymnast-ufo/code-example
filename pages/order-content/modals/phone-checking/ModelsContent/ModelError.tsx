import { FC, useContext } from "react";
import { ThemeContext } from "styled-components";
import { Text } from "../../../../../styles/shared-css/typography";

export const ModelError: FC = () => {
  const theme = useContext(ThemeContext);

  return (
    <Text color={theme.secondTextColor}>
      Не нашли модель в списке поддерживаемых устройств.
      Более актуальную информацию уточните у производителя
    </Text>
  );
};
