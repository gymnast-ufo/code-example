import { FC, useContext } from "react";
import {ThemeContext} from "styled-components";
import { ContentBlock } from "./ContentBlock";
import { phoneFormatter } from "../../../helpers/phoneFormatter";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { FlexContainer } from "../../../styles/shared-css/shared-components";
import { ControllerContext } from "./ControllerContext";
import { getConfirmTariff } from "./helpers";
import { PriceCard } from "../../../components/PriceCard";

export const OrderCard: FC = () => {
  const selectedPhone = useSelector((state: RootState) => state.choosePhone);
  const tariff = useSelector((state: RootState) => state.tariff);
  const theme = useContext(ThemeContext);

  const { msisdn, price } = selectedPhone;

  const { handlers, requests } = useContext(ControllerContext);
  const { phonesLoading, tariffsLoading } = requests;
  const {
    handleNumberChooseClick,
    handleTariffChooseClick,
  } = handlers;

  const phoneNumberDescription = msisdn || "Выберите номер";
  const confirmTariff = getConfirmTariff(tariff);
  const isNotMembrana = theme.name !== 'membrana';

  return (
    <FlexContainer column gap={16}>
      <ContentBlock
        loading={phonesLoading}
        title="Номер"
        price={<PriceCard price={price} place="number" />}
        description={phoneFormatter(phoneNumberDescription)}
        onClick={isNotMembrana && handleNumberChooseClick}
      />

      <ContentBlock
        loading={tariffsLoading}
        title="Тариф"
        price={<PriceCard price={confirmTariff.price} place="tariff" />}
        description={confirmTariff.description}
        onClick={handleTariffChooseClick}
      />

      <ContentBlock
        loading={tariffsLoading}
        title="Активация eSIM"
        description="Будут зачислены на ваш мобильный счёт и спишутся после активации eSIM"
        price={confirmTariff.activationPrice}
      />
    </FlexContainer>
  );
};
