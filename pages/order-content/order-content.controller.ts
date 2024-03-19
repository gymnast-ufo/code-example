import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext } from "styled-components";
import { resetDevice } from "../../store/slices/selectedDeviceSlice";
import { resetUserInfo } from "../../store/slices/userInfoSlice";
import { resetTariff } from "../../store/slices/tariffSlice";
import { resetTotalPrice } from "../../store/slices/totalPriceSlice";
import { resetChoosePhone } from "../../store/slices/choosePhoneSlice";
import { resetConfirmedNumber } from "../../store/slices/confirmedNumber";
import { resetExtra } from "../../store/slices/extraSlice";
import { resetIccid } from "../../store/slices/iccidSlice";
import { resetOperation } from "../../store/slices/operationSlice";
import { useEffect, useState } from "react";
import { setUserkey } from "../../store/slices/userKeySlice";
import { useGetUser } from "./controllers/useGetUser";
import { useGetFreePhones } from "./controllers/useGetFreePhones";
import { useGetTariff } from "./controllers/useGetTariff";
import { RootState } from "../../store";
import { rus_to_latin } from "../../helpers/string-helpers";
import { useModalVisible } from "./controllers/useModalVisible";
import { v4 as uuidv4 } from "uuid";
import { useReplaceLocation, useLocation } from "../../helpers/useGetLocation";
import { baseUrl } from "../../params";
import {
  IPromoCodeSlice,
  resetPromoCode,
  setPromoCode,
} from "../../store/slices/promoCodeSlice";
import {
  useGetSysVarQuery,
  useLazyGetFreePhonesCategoriesQuery,
} from "../../api";
import Navigator from "../../components/Navigator";
import { resetFormOrderId } from "../../store/slices/formOrderIdSlice";
import { ICategoryCode } from "../../types/common";
import { usePutShoppingCart } from "./controllers/usePutShoppingCart";
import { setPhoneCategories } from "../../store/slices/phoneCategoriesSlice";
import { useSendGTM } from "../../helpers/useSendGTM";
import md5 from "crypto-js/md5";
import { useSearchParams } from "react-router-dom";
import { resetConfirmedTariff } from "../../store/slices/confirmedTariff";

export enum IModalType {
  NUMBER = "NUMBER",
  TARIFF = "TARIFF",
  PHONE = "PHONE",
  PROMO = "PROMO",
  REMOVE_PROMO = "REMOVE_PROMO",
  PRICE = "PRICE",
  REMOVE_TARIFF = "REMOVE_TARIFF",
}

const isIframe = window !== window.parent;

const useOrderContentController = () => {
  const [isMobile, setIsMobile] = useState(false);

  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { origin, widget } = useLocation();
  const navigator = new Navigator();
  const sendGTM = useSendGTM();

  const successUrl = useReplaceLocation(
    isIframe ? "processing-iframe" : "processing-data"
  );
  const isMembrana =
    theme.name === "membrana" ||
    origin.search.get("theme") === "membrana" ||
    widget.search.get("theme") === "membrana";
  const isNotMembrana = !isMembrana;
  const queryPromoCode =
    origin.search.get("promocode") || widget.search.get("promocode") || "";

  const [searchParams] = useSearchParams();
  const variant = searchParams.get("variant");

  const selectedPhone = useSelector((state: RootState) => state.choosePhone);
  const selectedTariff = useSelector((state: RootState) => state.tariff);
  const userkey = useSelector((state: RootState) => state.userkey);
  const currentRegion = useSelector((state: RootState) => state.currentRegion);
  const promocode = useSelector((state: RootState) => state.promoCode);

  const [openModalType, handlers] = useModalVisible();
  const [user] = useGetUser();
  const [getFreePhones, phonesLoading] = useGetFreePhones();
  const [tariffsLoading] = useGetTariff();
  const { data: shoppingCartData, isLoading, errorText } = usePutShoppingCart();
  const [getCategories, { data: categoriesData }] =
    useLazyGetFreePhonesCategoriesQuery();

  const { data: sysVar } = useGetSysVarQuery({});

  const resetPersistValues = () => {
    dispatch(resetDevice());
    dispatch(resetUserInfo());
    dispatch(resetTariff());
    dispatch(resetTotalPrice());
    dispatch(resetChoosePhone());
    dispatch(resetConfirmedNumber());
    dispatch(resetConfirmedTariff());
    dispatch(resetExtra());
    dispatch(resetIccid());
    dispatch(resetOperation());
    dispatch(resetFormOrderId());
    dispatch(resetPromoCode());
  };

  const handleOnNextButtonClick = () => {
    sendGTM({
      event: "event",
      eventCategory: "eventCategory",
      eventAction: "button_click",
      eventLabel: "dalee",
      eventValue: selectedPhone.price.toString(),
      userId: user?.guid,
      userAuth: user?.guid ? 1 : 0,
      screenName: widget.pathname,
      eventContent: selectedTariff?.price.toString(),
      eventContext: "some_context",
      buttonLocation: "screen",
      actionGroup: "interactions",
      productName: rus_to_latin(selectedTariff?.name || ""),
      touchPoint: "web",
      CD1: selectedPhone ? md5(selectedPhone.msisdn).toString() : null,
    });

    const encoded = encodeURIComponent(successUrl);
    const url = `${baseUrl}auth/web-sso?success_url=${encoded}`;
    window.open(url, "_self");
  };

  const createNewUserkey = () => {
    resetPersistValues();
    dispatch(setUserkey(`${Date.now()}-${uuidv4()}`));
  };

  const handleNewOrderClick = () => {
    sendGTM({
      event: "event",
      eventCategory: "eventCategory",
      eventAction: "button_click",
      eventLabel: "oformit_novuu_zayavku",
      userId: user?.guid,
      userAuth: user?.guid ? 1 : 0,
      screenName: widget.pathname,
      eventContent: "some_content",
      buttonLocation: "screen",
      actionGroup: "interactions",
      touchPoint: "web",
      CD1: selectedPhone ? md5(selectedPhone.msisdn).toString() : null,
    });
    resetPersistValues();
    createNewUserkey();
  };

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }

    createNewUserkey();

    if (isNotMembrana) {
      getCategories();
      if (!!queryPromoCode) handlers.handlePromoCodeClick();
    }

    if ((isMembrana || !queryPromoCode) && variant != "3") {
      getFreePhones({
        categoriesCode: ICategoryCode.N,
        fiasCode:
          window?.globalSettings?.region?.currentRegionFiasId || currentRegion,
        numberCount: 1,
        mask: "79%",
      });
    }

    sendGTM({
      event: "event",
      eventCategory: "eventCategory",
      eventAction: "element_show",
      eventLabel: "widget_ready",
      userId: user?.guid,
      userAuth: user?.guid ? 1 : 0,
      screenName: widget.pathname || "/",
      actionGroup: "non_interactions",
      touchPoint: "web",
    });
  }, []);

  useEffect(() => {
    if (!categoriesData) return;
    dispatch(setPhoneCategories(categoriesData));
  }, [categoriesData]);

  useEffect(() => {
    if (sysVar?.["esim.continue-order"] === "true")
      localStorage.setItem("continue-order", "true");
  }, [userkey, sysVar]);

  return {
    state: {
      isMobile,
      openModalType,
      putCartErrorText: errorText,
    },
    requests: {
      phonesLoading,
      tariffsLoading,
      putCartLoading: isLoading,
    },
    handlers: {
      getFreePhones,
      resetPersistValues,
      handleOnNextButtonClick,
      handleNewOrderClick,
      ...handlers,
    },
  };
};

export default useOrderContentController;
