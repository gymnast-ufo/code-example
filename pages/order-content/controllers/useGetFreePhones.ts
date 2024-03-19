import { useLazyGetFreePhonesQuery } from "../../../api";
import { useEffect } from "react";
import { IPhoneNumber } from "../../../types/common";
import { setChoosePhone } from "../../../store/slices/choosePhoneSlice";
import { setConfirmPhone } from "../../../store/slices/confirmPhoneSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import useError from "../../../helpers/error-handler";
import { useSendGTM } from "../../../helpers/useSendGTM";
import md5 from "crypto-js/md5";

interface IUseGetFreePhones {
  (): [Function, boolean];
}

export const useGetFreePhones: IUseGetFreePhones = () => {
  const dispatch = useDispatch();
  const phoneCategories = useSelector((state: RootState) => state.phoneCategories);
  const user = useSelector((state: RootState) => state.userInfo);
  const sendGTM = useSendGTM();

  const [getFreePhonesTrigger, { data, error, isLoading, isFetching }] = useLazyGetFreePhonesQuery();

  useEffect(() => {
    if (data?.[0]) {
      const phonePrice = phoneCategories
        .find(({ code }) => code === data[0].salabilityCategoryCode)
        ?.categoryCost || 0;

      const freePhoneForChoose: IPhoneNumber = {
        msisdn: data[0].msisdn,
        salabilityCategoryCode: data[0].salabilityCategoryCode,
        price: phonePrice,
        hostCode: data[0].hostCode,
        msisdnLinked: data[0].msisdnLinked,
        phoneTypeCode: data[0].phoneTypeCode,
        reserveNumber: null,
      };

      dispatch(setChoosePhone(freePhoneForChoose));
      dispatch(setConfirmPhone(true));
      sendGTM({
        event: "event",
        eventCategory: "eventCategory",
        eventAction: "element_show",
        eventLabel: "nomer_ready",
        userId: user.guid,
        userAuth: user.guid ? 1 : 0,
        screenName: "/",
        actionGroup: "non_interactions",
        touchPoint: "web",
        CD1: freePhoneForChoose ? md5(freePhoneForChoose.msisdn).toString() : null,
      });
    }
  }, [data]);

  useError(error);

  return [getFreePhonesTrigger, isLoading || isFetching];
};
