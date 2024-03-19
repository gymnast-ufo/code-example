import { useGetShoppingCardQuery } from "../../../api";
import { useEffect } from "react";
import { getTariffConditions } from "../../../helpers/getTariffConditions";
import { setTariff } from "../../../store/slices/tariffSlice";
import { ITariffPaymentTypes } from "../../../api/types/tariff";
import { setChoosePhone } from "../../../store/slices/choosePhoneSlice";
import { useDispatch, useSelector } from "react-redux";
import { setPromoCode } from "../../../store/slices/promoCodeSlice";
import { RootState } from "../../../store";
import { ITariff } from "../../../types/tariff";
import { getPromocodeFromCart } from "../../../helpers/getPromocodeFromAPI";

interface IUseGetCard {
  statusData: any;
}

export const useGetCard = (props: IUseGetCard) => {
  const { statusData } = props;
  const currentRegion = useSelector((state: RootState) => state.currentRegion);
  const dispatch = useDispatch();

  const key = statusData?.[0].key;
  const skip =
    !statusData ||
    statusData?.[0]?.status?.toLowerCase?.()?.includes?.("completed");

  const { data } = useGetShoppingCardQuery(key, { skip });

  useEffect(() => {
    if (!data) return;
    if (
      data.geographicLocation.fiasCode !==
      (window?.globalSettings?.region?.currentRegionFiasId || currentRegion)
    )
      return;
    const tariffData = data.tariffInfo;
    const phoneData = data.phoneInfo;

    const { id, name, description, charge, profile, geographicarea, payments } =
      tariffData;
    const properties = getTariffConditions(tariffData);
    const activation = payments.filter((payment) => payment.type == ITariffPaymentTypes.ONETIME);
    const activationPrice = Number(activation[0].price);

    const newTariff: ITariff = {
      id,
      name,
      description,
      code: profile?.code || null,
      price: Number(charge?.price || profile?.price) || 0,
      properties: properties,
      period: charge?.periodtype || null,
      geographicarea,
      activationPrice,
      allIncluded: name.toLowerCase() === "мтс супер",
    };
    const newPhone = {
      msisdn: phoneData.msisdn,
      salabilityCategoryCode: phoneData.salabilityCategoryCode,
      price: +phoneData.price,
      hostCode: phoneData.hostCode,
      msisdnLinked: phoneData.msisdnLinked,
      phoneTypeCode: phoneData.phoneTypeCode,
      reserveNumber: phoneData.reserveNumber,
    };
    const newPromoCode = getPromocodeFromCart(data);

    dispatch(setTariff(newTariff));
    dispatch(setChoosePhone(newPhone));
    dispatch(setPromoCode(newPromoCode));
  }, [data]);
  return [data];
};
