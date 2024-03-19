import { FC } from "react";
import { FlexContainer } from "../../../../../../styles/shared-css/shared-components";
import { Bolded, Text } from "../../../../../../styles/shared-css/typography";
import { androidFAQ } from "../../../../../../svg/imagesLinks";

export const AndroidFAQ: FC = () => {
  return (
    <FlexContainer column gap={16}>
      <Text>
        Зайдите в <Bolded>Настройки</Bolded> — <Bolded>Система</Bolded>
        или <Bolded>О телефоне</Bolded>. Внутри вы найдёте
        пункт <Bolded>Имя устройства</Bolded> или <Bolded>Название модели</Bolded>
      </Text>

      <img src={androidFAQ} alt="Номер модели телефона" />
    </FlexContainer>
  );
};
