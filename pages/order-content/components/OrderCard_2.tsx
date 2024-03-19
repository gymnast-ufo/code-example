import { FC, useContext } from "react";
import { ThemeContext } from "styled-components";
import { ContentBlock } from "./ContentBlock_2";
import { phoneFormatter } from "../../../helpers/phoneFormatter";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { FlexContainer } from "../../../styles/shared-css/shared-components";
import { ControllerContext } from "./ControllerContext";
import { getConfirmTariff } from "./helpers";
import { PriceCard } from "../../../components/PriceCard";
import { PhoneIcon } from "../../../svg/phone-icon";
import { TariffIcon } from "../../../svg/tariff-icon";
import { getTariffPriceLabel } from "../../../helpers/getTariffPriceLabel";

export const OrderCard: FC = () => {
  const selectedPhone = useSelector((state: RootState) => state.choosePhone);
  const tariff = useSelector((state: RootState) => state.tariff);
  const theme = useContext(ThemeContext);

  const { msisdn, price } = selectedPhone;

  const { handlers, requests } = useContext(ControllerContext);
  const { phonesLoading, tariffsLoading } = requests;
  const { handleNumberChooseClick, handleTariffChooseClick } = handlers;

  const phoneNumberDescription = msisdn || "Выберите номер";
  const confirmTariff = getConfirmTariff(tariff);
  const isNotMembrana = theme.name !== "membrana";

  return (
    <FlexContainer column gap={12}>
      <ContentBlock
        loading={phonesLoading}
        price={price ? <PriceCard price={price} /> : "Бесплатно"}
        text={phoneFormatter(phoneNumberDescription)}
        onClick={isNotMembrana && handleNumberChooseClick}
        hasText
        noDescription
        icon={<PhoneIcon />}
      />

      <ContentBlock
        loading={tariffsLoading}
        price={getTariffPriceLabel(tariff)}
        text={tariff.name}
        description={confirmTariff.description_2}
        hasText
        onClick={handleTariffChooseClick}
        icon={<TariffIcon />}
      />
    </FlexContainer>
  );
};
