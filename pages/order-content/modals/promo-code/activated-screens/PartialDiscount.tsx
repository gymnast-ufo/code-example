import { FC } from "react";
import { useSelector } from "react-redux";
import { Description, H4Title } from "../../../../../styles/shared-css/typography";
import { RootState } from "../../../../../store";
import { ITariff } from "../../../../../types/tariff";

const getSeparator = (index: number, array: ITariff[]) => {
  switch (true) {
    case index === 0: return '';
    case index === (array.length - 1): return ' или ';
    default: return ', ';
  }
};

export const PartialDiscount: FC<{ price: string }> = ({ price }) => {
  const tariffsList = useSelector((state: RootState) => state.tariffsList);
  const promoCode = useSelector((state: RootState) => state.promoCode);

  const filteredTariffs = tariffsList.filter((tariff) => {
    return promoCode.conditions?.tariffs?.includes(tariff.id.split('.')[0]);
  });
  const tariffNames = filteredTariffs.reduce((result, { name }, index, array) => {
    const separator = getSeparator(index, array);
    result += (separator + name);
    return result;
  }, '');

  return (
    <>
      <H4Title>Скидка {price}</H4Title>

      <Description>
        На оформление SIM-карты с тарифом {tariffNames}
      </Description>
    </>
  );
};
