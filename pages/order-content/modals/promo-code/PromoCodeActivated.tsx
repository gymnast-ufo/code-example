import { FC } from "react";
import { useSelector } from "react-redux";
import { FlexContainer, Icon } from '../../../../styles/shared-css/shared-components';
import { doneImage } from "../../../../svg/imagesLinks";
import { priceFormatter } from "../../../../helpers/priceFormatter";
import { FullDiscount } from "./activated-screens/FullDiscount";
import { PartialDiscount } from "./activated-screens/PartialDiscount";
import { SpecialTariff } from "./activated-screens/SpecialTariff";
import { FreeTraffic } from "./activated-screens/FreeTraffic";
import { RootState } from "../../../../store";
import { IPromoCodeSlice } from "../../../../store/slices/promoCodeSlice";

const getComponent = (promoCodeType: IPromoCodeSlice['type']) => {
  switch (promoCodeType) {
    case 'NUMBER': return FullDiscount;
    case 'TARIFF': return PartialDiscount;
    // case 'SPECIAL': return FreeTraffic;
    case 'ORDER': return SpecialTariff; //TODO: поменять TARIFF и ORDER местами
    default: return FullDiscount;
  }
};

export const PromoCodeActivated: FC = () => {
  const promoCode = useSelector((state: RootState) => state.promoCode);
  const price = priceFormatter({ price: promoCode.discount });
  const Component = getComponent(promoCode.type);

  return (
    <FlexContainer column alignCenter gap={16}>
      <Icon width={120} height={120}>
        <img src={doneImage} alt="Промокод активирован" />
      </Icon>

      <FlexContainer column alignCenter gap={4} style={{ textAlign: 'center' }}>
        <Component price={price} />
      </FlexContainer>
    </FlexContainer>
  );
};
