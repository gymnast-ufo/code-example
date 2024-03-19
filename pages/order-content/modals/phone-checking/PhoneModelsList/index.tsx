import { FC, useMemo } from "react";
import { PhoneModel } from "./index.styles";
import { IPhoneModel } from "../../../../../types/common";
import { useDispatch } from "react-redux";
import { setDeviceID } from "../../../../../store/slices/chooseDeviceIDSlice";

interface IPhoneModelsList {
  filteredList: IPhoneModel[];
}

export const PhoneModelsList: FC<IPhoneModelsList> = ({ filteredList }) => {
  const dispatch = useDispatch();
  const handleModelClick = (clickedDeviceID: IPhoneModel['device_id']) => () => {
    dispatch(setDeviceID(clickedDeviceID));
  };

  const memorized = useMemo(() => {
    return filteredList.map((model) => (
      <PhoneModel key={model.device_id} onClick={handleModelClick(model.device_id)}>
        {model.device}
      </PhoneModel>
    ));
  }, [filteredList]);

  if (!filteredList.length) {
    return <></>;
  }

  return <div>{memorized}</div>;
};
