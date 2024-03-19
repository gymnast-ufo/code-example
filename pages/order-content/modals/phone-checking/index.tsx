import { FC, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { FlexContainer } from "../../../../styles/shared-css/shared-components";
import Textbox from "../../../../components/form-controls/textbox/textbox";
import { RootState } from "../../../../store";
import { IPhoneModel } from "../../../../types/common";
import { useGetDevicesQuery } from "../../../../api";
import { setDevices } from "../../../../store/slices/devicesSlice";
import { ModelsContent } from "./ModelsContent";

const filterModelList = (modelList: IPhoneModel[], search: string): IPhoneModel[] => {
  if (!search) {
    return modelList;
  }

  const loweredSearch = search.toLowerCase();
  return modelList.filter((model) => {
    const name = model.device.toLowerCase();
    const manufacturer = model.manufacturer.toLowerCase();

    return name.includes(loweredSearch) || manufacturer.includes(loweredSearch);
  });
};

const PhoneChecking: FC = () => {
  const [search, setSearch] = useState('');
  const [filteredModelsList, setFilteredModelsList] = useState<IPhoneModel[]>([]);

  const dispatch = useDispatch();
  const modelsList = useSelector((state: RootState) => state.devices);
  const choseDeviceID = useSelector((state: RootState) => state.chooseDeviceID);

  const handleSetSearch = useCallback(debounce((event: any) => {
    setSearch(event);
  }, 500), []);
  const handleClearSearch = () => setSearch('');

  const { data: devicesData } = useGetDevicesQuery();

  useEffect(() => {
    if (devicesData?.length) {
      dispatch(setDevices(devicesData));
    }
  }, [devicesData]);

  useEffect(() => {
    setFilteredModelsList(filterModelList(modelsList, search));
  }, [modelsList, search]);

  useEffect(() => {
    if (choseDeviceID) {
      const choseModel = modelsList.find((model) => model.device_id === choseDeviceID) as IPhoneModel;
      setSearch(choseModel.device);
    }
  }, [choseDeviceID]);

  return (
    <FlexContainer column gap={24}>
      <Textbox
        value={search}
        mask={/^(.*?)$/}
        placeholder="Модель телефона"
        onAccept={handleSetSearch}
        onClickIcon={handleClearSearch}
      />

      <ModelsContent search={search} filteredList={filteredModelsList} />
    </FlexContainer>
  );
};

export default PhoneChecking;
