import { FC, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FlexContainer } from "../../../../styles/shared-css/shared-components";
import { PromoCodeActivated } from "./PromoCodeActivated";
import { GetPromoCode } from "./GetPromoCode";
import {
  Button,
  IButtonTheme,
} from "../../../../components/form-controls/button/button";
import {
  useLazyCheckPromoCodeQuery,
  useLazyGetFreePhonesCategoriesQuery,
  useLazyGetTariffsQuery,
} from "../../../../api";
import Textbox from "../../../../components/form-controls/textbox/textbox";
import { ControllerContext } from "../../components/ControllerContext";
import { RootState } from "../../../../store";
import {
  resetPromoCode,
  setPromoCode,
} from "../../../../store/slices/promoCodeSlice";
import { useLocation } from "../../../../helpers/useGetLocation";
import { ICategoryCode } from "../../../../types/common";
import { setPhoneCategories } from "../../../../store/slices/phoneCategoriesSlice";
import { IPromoCodeCheckAPI } from "../../../../api/types/promoCodes";
import { resetTariff, setTariff } from "../../../../store/slices/tariffSlice";
import { useSendGTM } from "../../../../helpers/useSendGTM";
import { setTariffsList } from "../../../../store/slices/tariffsList";
import md5 from "crypto-js/md5";
import { tariffsSorter } from "../../../../helpers/tariffsSorter";
import {
  getPromocodeFromPromis,
  getPromoCodeType,
} from "../../../../helpers/getPromocodeFromAPI";

const getErrorText = (promoCodeData: IPromoCodeCheckAPI): string => {
  const { status } = promoCodeData.voucher;

  if (status === "NOT_FOUND") return "Такого промокода нет";
  if (status === "REDEMPTION_QUANTITY_IS_OVER")
    return "Промокод уже использован";
  if (status !== "ACTIVE") return "Истёк срок действия промокода";
  return "Такого промокода нет";
};

const PromoCodeModal: FC = () => {
  const { origin, widget } = useLocation();
  const [input, setInput] = useState("");
  const [valid, setValid] = useState<boolean | null>(null);
  const [errorLabel, setErrorLabel] = useState("");
  const [isFirstUpload, setIsFirstUpload] = useState(true);
  const queryPromoCode =
    origin.search.get("promocode") || widget.search.get("promocode");
  const { handlers, requests } = useContext(ControllerContext);

  const dispatch = useDispatch();
  const sendGTM = useSendGTM();

  const promoCode = useSelector((state: RootState) => state.promoCode);
  const user = useSelector((state: RootState) => state.userInfo);
  const currentRegion = useSelector((state: RootState) => state.currentRegion);
  const chosePhone = useSelector((state: RootState) => state.choosePhone);
  const phoneCategories = useSelector(
    (state: RootState) => state.phoneCategories
  );
  const fiasCode =
    window?.globalSettings?.region?.currentRegionFiasId || currentRegion;
  const selectedTariff = useSelector((state: RootState) => state.tariff);

  const [
    checkPromoCodeTrigger,
    { data, error, isLoading, isFetching, fulfilledTimeStamp },
  ] = useLazyCheckPromoCodeQuery();
  const [
    getCategoriesTrigger,
    {
      data: categoriesData,
      isLoading: isCategoriesLoading,
      isFetching: isCategoriesFetching,
    },
  ] = useLazyGetFreePhonesCategoriesQuery();
  const [
    getTariffsTrigger,
    { data: tariffsData, isLoading: tariffsDataLoading },
  ] = useLazyGetTariffsQuery();

  const selectedTariffId = selectedTariff.id?.split(".")[0];
  const isPromoCodeActive = !!promoCode.value && !errorLabel;
  const hasSomeLoading =
    isLoading ||
    isFetching ||
    requests.phonesLoading ||
    tariffsDataLoading ||
    isCategoriesFetching ||
    isCategoriesLoading;
  const isActivateButtonLoading = hasSomeLoading || requests.putCartLoading;
  const isCorrectTariff =
    promoCode.type === "TARIFF"
      ? !!promoCode.conditions?.tariffs?.includes(selectedTariffId)
      : true;
  const isShowPromoCodeActivatedScreen =
    isPromoCodeActive && !hasSomeLoading && isCorrectTariff;

  const onCorrectPromoCode = (data: IPromoCodeCheckAPI) => {
    const {
      order: { promotion },
      tariffList,
    } = data;
    const discount = promotion?.reward?.discount;
    const discountType = discount?.type;
    const promoCodeType = getPromoCodeType(discountType, tariffList);

    switch (promoCodeType) {
      case "NUMBER":
        onPhoneNumberTypePromocode(data);
        break;
      case "TARIFF":
        onTariffTypePromocode(data);
        break;
      default:
        break;
    }

    sendGTMActivationResult(true);
  };
  const onIncorrectPromoCode = (data: IPromoCodeCheckAPI) => {
    setErrorLabel(getErrorText(data));
    sendGTMActivationResult(false);

    if (isFirstUpload && queryPromoCode) {
      handlers.getFreePhones({
        categoriesCode: ICategoryCode.N,
        fiasCode: fiasCode,
        numberCount: 1,
        mask: "79%",
      });
    }
    setIsFirstUpload(false);
  };

  const onPhoneNumberTypePromocode = (promoCodeData: IPromoCodeCheckAPI) => {
    const newPromoCode = getPromocodeFromPromis(promoCodeData);
    const discount = promoCodeData.order.promotion?.reward?.discount;
    const isGoldNumber = chosePhone.salabilityCategoryCode === ICategoryCode.G;
    const getPhonesPayload = {
      categoriesCode: ICategoryCode.G,
      fiasCode: fiasCode,
      numberCount: 1,
      mask: "79%",
    };

    dispatch(setPromoCode(newPromoCode));

    if (!phoneCategories.length) {
      getCategoriesTrigger();
    } else {
      const goldCategoryPrice =
        phoneCategories.find(({ code }) => code === ICategoryCode.G)
          ?.categoryCost || 0;
      const discountValue =
        discount?.type === "PERCENT" ? goldCategoryPrice : discount?.value || 0;

      dispatch(
        setPromoCode({
          ...newPromoCode,
          discount: discountValue,
        })
      );
    }

    if (!isGoldNumber) handlers.getFreePhones(getPhonesPayload);
  };
  const onTariffTypePromocode = (promoCodeData: IPromoCodeCheckAPI) => {
    const newPromocode = getPromocodeFromPromis(promoCodeData);
    const discount = promoCodeData.order.promotion?.reward.discount.value;
    dispatch(setPromoCode({ ...newPromocode, discount }));

    const isCorrectCurrentTariff = newPromocode.conditions?.tariffs?.includes(
      selectedTariff.id.split(".")[0]
    );
    if (isCorrectCurrentTariff) return;

    getTariffsTrigger({ fias_code: fiasCode, WithPromotions: true });
  };

  useEffect(() => {
    if (!data || isLoading || isFetching) return;

    const { redemptionRemaining, status } = data.voucher;
    const isCorrectPromoCode =
      !!redemptionRemaining && redemptionRemaining > 0 && status === "ACTIVE";

    if (isCorrectPromoCode) {
      onCorrectPromoCode(data);
    } else {
      onIncorrectPromoCode(data);
    }
  }, [data, fulfilledTimeStamp]);

  useEffect(() => {
    if (!categoriesData) return;
    dispatch(setPhoneCategories(categoriesData));
  }, [categoriesData]);

  useEffect(() => {
    if (!categoriesData || !data) return;

    const { redemptionRemaining, status } = data.voucher;
    const isCorrectPromoCode =
      !!redemptionRemaining && redemptionRemaining > 0 && status === "ACTIVE";

    if (!isCorrectPromoCode) return;

    const {
      order: { promotion },
    } = data;
    const discount = promotion?.reward?.discount;
    const discountType = discount?.type;

    const goldCategoryPrice =
      phoneCategories.find(({ code }) => code === ICategoryCode.G)
        ?.categoryCost || 0;
    const discountValue =
      discountType === "PERCENT" ? goldCategoryPrice : discount?.value || 0;
    const promoCodeType = getPromoCodeType(discountType);

    dispatch(
      setPromoCode({
        ...promoCode,
        type: promoCodeType,
        discount: discountValue,
      })
    );
  }, [data, categoriesData]);

  useEffect(() => {
    if (error) {
      setErrorLabel("Такого промокода нет");
      sendGTMActivationResult(false);
    }
  }, [error]);

  useEffect(() => {
    if (!tariffsData?.length || !promoCode.conditions?.tariffs?.length) return;

    dispatch(resetTariff());
    const tariffCodes = promoCode.conditions?.tariffs;

    const catalog = tariffCodes.reduce((obj, id) => {
      obj[id] = id;
      return obj;
    }, {} as Record<string, string>);

    const sortedTariffs = tariffsSorter({
      tariffs: tariffsData,
      catalog,
      propToSort: "id",
    });

    dispatch(setTariffsList(sortedTariffs));
    dispatch(setTariff(sortedTariffs[0]));
  }, [tariffsData]);

  const handleSetSearch = (value: string) => {
    setErrorLabel("");
    setInput(value || "");
  };
  const handleCancelPromoCode = () => {
    sendGTMButtonHandler("izmenit_promokod");
    handleSetSearch("");
    dispatch(resetPromoCode());
  };

  const onPromocodeClick = () => {
    sendGTM({
      event: "event",
      eventCategory: "eventCategory",
      eventAction: "element_click",
      eventLabel: "vvedite_promokod",
      userId: user.guid,
      userAuth: user.guid ? 1 : 0,
      screenName: window.location.pathname,
      buttonLocation: "popup",
      actionGroup: "interactions",
      touchPoint: "web",
      CD1: chosePhone ? md5(chosePhone.msisdn).toString() : null,
    });
  };

  const sendGTMActivationResult = (isOk: boolean) => {
    sendGTM({
      event: "event",
      eventCategory: "eventCategory",
      eventAction: isOk ? "confirmed" : "rejected",
      eventLabel: "aktivirovat",
      userId: user.guid,
      userAuth: user.guid ? 1 : 0,
      screenName: window.location.pathname,
      buttonLocation: "popup",
      actionGroup: "interactions",
      touchPoint: "web",
      CD1: chosePhone ? md5(chosePhone.msisdn).toString() : null,
    });
  };

  const sendGTMButtonHandler = (type: string) => {
    sendGTM({
      event: "event",
      eventCategory: "eventCategory",
      eventAction: "button_click",
      eventLabel: type,
      userId: user.guid,
      userAuth: user.guid ? 1 : 0,
      screenName: window.location.pathname,
      eventContext: "promokod_aktivirovan",
      buttonLocation: "popup",
      actionGroup: "interactions",
      touchPoint: "web",
      CD1: chosePhone ? md5(chosePhone.msisdn).toString() : null,
    });
  };

  const handlePromoCodeActivate = () => checkPromoCodeTrigger(input);

  const handleContinueClick = () => {
    sendGTMButtonHandler("prodolzhit");
    handlers.handleCloseModal();
  };

  useEffect(() => {
    setValid(input.length > 3);
  }, [input]);

  useEffect(() => {
    if (!!queryPromoCode) {
      handleSetSearch(queryPromoCode);
      getCategoriesTrigger();
      checkPromoCodeTrigger(queryPromoCode);
    }
  }, []);

  return (
    <FlexContainer column gap={16}>
      {isShowPromoCodeActivatedScreen ? (
        <PromoCodeActivated />
      ) : (
        <GetPromoCode />
      )}

      {!isShowPromoCodeActivatedScreen && (
        <Textbox
          value={input}
          mask={String}
          placeholder="Введите промокод"
          valid={!!valid}
          hasError={!!error || !!errorLabel}
          errorLabel={errorLabel}
          onAccept={handleSetSearch}
          onClick={onPromocodeClick}
        />
      )}

      {isShowPromoCodeActivatedScreen ? (
        <>
          <Button isFullWidth onClick={handleContinueClick}>
            Продолжить
          </Button>

          <Button
            isFullWidth
            buttonTheme={IButtonTheme.GRAY}
            onClick={handleCancelPromoCode}
          >
            Изменить промокод
          </Button>
        </>
      ) : (
        <Button
          isFullWidth
          isLoading={isActivateButtonLoading}
          disabled={!valid}
          onClick={handlePromoCodeActivate}
        >
          Активировать
        </Button>
      )}
    </FlexContainer>
  );
};

export default PromoCodeModal;
