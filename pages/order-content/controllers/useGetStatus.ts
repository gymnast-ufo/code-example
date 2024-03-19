import { useGetStatusByPhoneQuery } from "../../../api";
import { useEffect } from "react";
import { setUserkey } from "../../../store/slices/userKeySlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface IUseGetStatus {
  setIsOldDataLoaded: (value: boolean) => void;
}

export const useGetStatus = (props: IUseGetStatus) => {
  const { setIsOldDataLoaded } = props;

  const user = useSelector((state: RootState) => state.userInfo);

  const {
    data,
    fulfilledTimeStamp: orderDatafulfilledTimeStamp,
    error: orderDataError,
  } = useGetStatusByPhoneQuery(user?.msisdn, {
    skip: !user?.contract_number,
  });

  useEffect(() => {
    if (data) {
      const status = data?.[0].status?.toLowerCase() || null;
      const isCanceledOrder =
        status === null ||
        status.includes("cancel") ||
        status.includes("error") ||
        status.includes("timeout");

      //для ONLINE21-5804 ничего не удаляю, просто делаю, чтоб не предлагал старый заказ
      if (!isCanceledOrder){
        return
      }

      if (status?.includes("completed")) {
        setIsOldDataLoaded(false);
      }
    }
  }, [data]);

  useEffect(() => {
    if (orderDatafulfilledTimeStamp && !data) {
      setIsOldDataLoaded(false);
    }
  }, [data, orderDatafulfilledTimeStamp]);

  useEffect(() => {
    if (orderDataError) {
      setIsOldDataLoaded(false);
    }
  }, [orderDataError]);

  if (!data?.[0].status) return [];

  return [data];
};
