import React, { FC, useContext, useEffect } from "react";
import {
  Box,
  Container,
  FlexContainer,
  WhiteBlock,
} from "../../styles/shared-css/shared-components";
import {
  ErrorLabel,
  IFontFamily,
  Text,
} from "../../styles/shared-css/typography";
import PageHeadline from "../../components/form-controls/page-headline/page-headline";
import { Button } from "../../components/form-controls/button/button";
import useOrderContentController from "./order-content.controller";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { OrderCard } from "./components/OrderCard";
import { ModalsContainer } from "./components/ModalsContainer";
import { ControllerContext } from "./components/ControllerContext";
import { ContentBlock } from "./components/ContentBlock";
import { PriceCard } from "../../components/PriceCard";
import { getDescriptorDTO } from "./components/getDescriptorDTO";
import { GreyInfoBlock } from "./order-content.styles";
import { ThemeContext } from "styled-components";
import { ITariff } from "../../types/tariff";
import { IPhoneNumber } from "../../types/common";
import { PromoCodeAction } from "./components/PromoCodeAction";
import { useSendGTM } from "../../helpers/useSendGTM";
import { useLocation } from "../../helpers/useGetLocation";
import md5 from "crypto-js/md5";
import { useSearchParams } from "react-router-dom";
import Variant_1 from "./variant_1";
import Variant_2 from "./variant_2";
import Variant_3 from "./variant_3";
import { setVariant } from "../../store/slices/variantSlice";

interface IGetTotalPrice {
  (phone: IPhoneNumber, tariff: ITariff): number;
}

const getTotalPrice: IGetTotalPrice = (phone, tariff) => {
  const phonePrice = phone.price;
  const tariffPrice = tariff.price || 0;
  const tariffActivation = tariff.activationPrice || 0;

  return phonePrice + tariffPrice + tariffActivation;
};

const OrderContent: FC = () => {
  const selectedPhone = useSelector((state: RootState) => state.choosePhone);
  const selectedTariff = useSelector((state: RootState) => state.tariff);

  const selectedDevice = useSelector(
    (state: RootState) => state.selectedDevice
  );
  const user = useSelector((state: RootState) => state.userInfo);

  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const variant = searchParams.get("variant")
    ? +searchParams.get("variant")
    : 1;

  useEffect(() => {
    if (!searchParams.get("variant")) {
      dispatch(setVariant(""));
      return;
    }

    dispatch(setVariant(variant));
  }, [variant]);

  const { widget } = useLocation();
  const theme = useContext(ThemeContext);
  const sendGTM = useSendGTM();

  const controller = useOrderContentController();
  const { handlers, state, requests } = controller;
  const { isMobile, putCartErrorText } = state;
  const { phonesLoading, tariffsLoading, putCartLoading } = requests;
  const {
    handleOnNextButtonClick,
    handlePromoCodeClick,
    handlePhoneCheckClick,
    handlePriceClick,
    handleRemovingPromoClick,
  } = handlers;

  const totalPrice = getTotalPrice(selectedPhone, selectedTariff);
  const isNotMembrana = theme.name !== "membrana";
  const nextButtonLoading = phonesLoading || tariffsLoading || putCartLoading;

  useEffect(() => {
    if (!nextButtonLoading && selectedPhone.msisdn && selectedTariff.id) {
      sendGTM({
        event: "event",
        eventCategory: "eventCategory",
        eventAction: "element_show",
        eventLabel: "dalee_ready",
        userId: user.guid,
        userAuth: user.guid ? 1 : 0,
        screenName: widget.pathname || "/",
        actionGroup: "non_interactions",
        touchPoint: "web",
        CD1: selectedPhone ? md5(selectedPhone.msisdn).toString() : null,
      });
    }
  }, [nextButtonLoading]);

  const getVariantComponent = (variant: number) => {
    switch (variant) {
      case 1:
      case 4: return Variant_1;
      case 2: return Variant_2;
      case 3: return Variant_3;
      default: return Variant_1;
    }
  };
  const Component = getVariantComponent(variant);

  return (
    <ControllerContext.Provider value={controller}>
      <Container>
        <Component
          isMobile={isMobile}
          isNotMembrana={isNotMembrana}
          showPromocode={variant === 1}
          handlePromoCodeClick={handlePromoCodeClick}
          handleRemovingPromoClick={handleRemovingPromoClick}
          totalPrice={totalPrice}
          handleOnNextButtonClick={handleOnNextButtonClick}
          nextButtonLoading={nextButtonLoading}
          putCartErrorText={putCartErrorText}
          handlePhoneCheckClick={handlePhoneCheckClick}
          handlePriceClick={handlePriceClick}
        />
      </Container>
      <ModalsContainer />
    </ControllerContext.Provider>
  );
};

export default OrderContent;
