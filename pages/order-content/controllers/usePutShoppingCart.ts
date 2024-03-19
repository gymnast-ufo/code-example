import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useLazyPutShoppingCardQuery } from "../../../api";
import useError from "../../../helpers/error-handler";
import Navigator from "../../../components/Navigator";
import { IPutShoppingCardResponseData } from "../../../api/types/shoppingCart";
import { RootState } from "../../../store";

interface IUsePutShoppingCart {
  (): {
    data?: IPutShoppingCardResponseData;
    isLoading: boolean;
    errorText: string;
    fulfilledTimeStamp?: number;
  };
}

export const usePutShoppingCart: IUsePutShoppingCart = () => {
  const [errorText, setErrorText] = useState("");

  const selectedPhone = useSelector((state: RootState) => state.choosePhone);
  const selectedTariff = useSelector((state: RootState) => state.tariff);
  const userkey = useSelector((state: RootState) => state.userkey);
  const currentRegion = useSelector((state: RootState) => state.currentRegion);
  const promocode = useSelector((state: RootState) => state.promoCode);
  const fiasCode = useSelector((state: RootState) => state.currentRegion);

  const navigator = new Navigator();

  const [trigger, { data, error, isLoading, isFetching, fulfilledTimeStamp }] =
    useLazyPutShoppingCardQuery();

  const debouncedPutCart = useCallback(
    debounce(() => {
      const cartData = {
        key: userkey,
        body: {
          phoneInfo: {
            hostCode: selectedPhone.hostCode,
            phoneTypeCode: selectedPhone.phoneTypeCode,
            salabilityCategoryCode: selectedPhone.salabilityCategoryCode,
            msisdn: selectedPhone.msisdn,
          },
          tariffInfo: {
            id: selectedTariff.id,
          },
          geographicLocation: {
            fiasCode:
              window?.globalSettings?.region?.currentRegionFiasId || fiasCode,
          },
          promoCodeInfo: { value: promocode.value },
        },
      };

      trigger(cartData);
    }, 300),
    [selectedPhone, selectedTariff, userkey, currentRegion, promocode, fiasCode]
  );

  useEffect(() => {
    if (!selectedPhone.msisdn || !selectedTariff.id) return;

    setErrorText("");
    debouncedPutCart();
  }, [
    selectedPhone,
    selectedTariff,
    userkey,
    currentRegion,
    promocode,
    fiasCode,
  ]);

  useEffect(() => {
    !!error && setErrorText("Произошла ошибка. Попробуйте позднее");

    if ((error as FetchBaseQueryError)?.status === 409) {
      navigator.navigate("error-choose-another-number");
    }
  }, [error]);

  useError(error);

  return {
    data,
    isLoading: isLoading || isFetching,
    errorText,
    fulfilledTimeStamp,
  };
};
