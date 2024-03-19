import { useGetUserInfoQuery } from "../../../api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { useEffect } from "react";
import { setUserInfo } from "../../../store/slices/userInfoSlice";

export const useGetUser = () => {
  const dispatch = useDispatch();
  const userkey = useSelector((state: RootState) => state.userkey);

  const { data, error } = useGetUserInfoQuery({
    key: userkey,
  });

  useEffect(() => {
    if (!data) return;

    if (data?.contract_number) {
      dispatch(setUserInfo(data));
    }
  }, [data]);

  return [data];
};
