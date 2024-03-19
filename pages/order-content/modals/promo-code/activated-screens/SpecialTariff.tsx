import { FC } from 'react';
import { useSelector } from "react-redux";
import { Description, H4Title } from "../../../../../styles/shared-css/typography";
import { RootState } from "../../../../../store";
import { getTariffDescription } from "../../../../../helpers/getTariffDescription";
import { getTariffPriceLabel } from "../../../../../helpers/getTariffPriceLabel";

export const SpecialTariff: FC = () => {
  const selectedTariff = useSelector((state: RootState) => state.tariff);
  const tariffDescription = getTariffDescription(selectedTariff, { hasName: false });
  const tariffPriceLabel = getTariffPriceLabel(selectedTariff);

  return (
    <>
      <H4Title>Ваш тариф {selectedTariff.name}</H4Title>

      <Description>
        {tariffDescription}<br/>
        {tariffPriceLabel}
      </Description>
    </>
  )
};
