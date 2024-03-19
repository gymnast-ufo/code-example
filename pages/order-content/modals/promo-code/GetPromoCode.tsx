import { FC } from "react";
import { FlexContainer } from "../../../../styles/shared-css/shared-components";
import { Description, H4Title } from "../../../../styles/shared-css/typography";
import { promoCodeImage } from "../../../../svg/imagesLinks";

export const GetPromoCode: FC = () => {
  return (
    <FlexContainer column gap={16}>
      <img width="100%" src={promoCodeImage} alt="Промокод" />

      <FlexContainer column gap={4}>
        <H4Title>Активируйте промокод</H4Title>

        <Description>Введите промокод, чтобы приобрести номер на специальных условиях</Description>
      </FlexContainer>
    </FlexContainer>
  );
};
