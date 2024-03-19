import { useGetTariffsQuery } from "../../../api";
import { useEffect } from "react";
import { setTariff } from "../../../store/slices/tariffSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import useError from "../../../helpers/error-handler";
import { useSendGTM } from "../../../helpers/useSendGTM";
import { useLocation } from "../../../helpers/useGetLocation";
import { setTariffsList } from "../../../store/slices/tariffsList";
import md5 from "crypto-js/md5";
import { useSearchParams } from "react-router-dom";

export const useGetTariff = () => {
  const { widget } = useLocation();
  const dispatch = useDispatch();
  const region = useSelector((state: RootState) => state.currentRegion);
  const user = useSelector((state: RootState) => state.userInfo);
  const choosePhone = useSelector((state: RootState) => state.choosePhone);
  const sendGTM = useSendGTM();
  const fias_code =
    window?.globalSettings?.region?.currentRegionFiasId || region;

  // const skip = isOldDataLoaded === null || isOldDataLoaded;

  const [searchParams] = useSearchParams();
  const variant = searchParams.get("variant");

  const { data, error, isLoading, isFetching } = useGetTariffsQuery(
    {
      fias_code:
        window?.globalSettings?.region?.currentRegionFiasId || fias_code,
      WithPromotions: true,
    },
    { skip: variant == "3" }
  );

  useEffect(() => {
    if (!data?.length) return;

    dispatch(setTariffsList(data));
    dispatch(setTariff(data[0]));
    sendGTM({
      event: "event",
      eventCategory: "eventCategory",
      eventAction: "element_show",
      eventLabel: "tarif_ready",
      userId: user.guid,
      userAuth: user.guid ? 1 : 0,
      screenName: widget.pathname,
      actionGroup: "non_interactions",
      touchPoint: "web",
      CD1: choosePhone ? md5(choosePhone.msisdn).toString() : null,
    });
  }, [data]);

  useError(error);

  return [isLoading || isFetching];
};
