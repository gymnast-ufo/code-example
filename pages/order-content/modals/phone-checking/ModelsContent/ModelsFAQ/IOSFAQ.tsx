import { FC } from "react";
import { FlexContainer } from "../../../../../../styles/shared-css/shared-components";
import { Bolded, Text } from "../../../../../../styles/shared-css/typography";
import { iOsFAQ } from "../../../../../../svg/imagesLinks";

export const IOSFAQ: FC = () => {
  return (
    <FlexContainer column gap={16}>
      <Text>
        Выберите <Bolded>Настройки</Bolded> — <Bolded>Основные</Bolded>
         — <Bolded>Об этом устройстве</Bolded>.
        Справа от пункта <Bolded>Номер модели</Bolded> отображается артикул.
        Чтобы увидеть номер модели, нажмите артикул
      </Text>

      <img
        width="100%"
        height="auto"
        src={iOsFAQ}
        alt="Номер модели телефона"
      />
    </FlexContainer>
  );
};
