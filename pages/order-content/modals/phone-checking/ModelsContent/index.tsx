import { FC } from "react";
import { useSelector } from "react-redux";
import { IPhoneModel } from "../../../../../types/common";
import { PhoneModelsList } from "../PhoneModelsList";
import { ListLoader } from "./ListLoader";
import { ModelError } from "./ModelError";
import { RootState } from "../../../../../store";
import { ModelSuccess } from "./ModelSuccess";
import { useSendGTM } from "../../../../../helpers/useSendGTM";
import md5 from "crypto-js/md5";
import { Button } from "../../../../../components/form-controls/button/button";
import { Link } from "react-router-dom";
import { rus_to_latin } from "../../../../../helpers/string-helpers";

interface IModelsContent {
  search: string;
  filteredList: IPhoneModel[];
}

export const ModelsContent: FC<IModelsContent> = ({ search, filteredList }) => {
  const choseDeviceID = useSelector((state: RootState) => state.chooseDeviceID);
  const modelsList = useSelector((state: RootState) => state.devices);
  const user = useSelector((state: RootState) => state.userInfo);
  const selectedPhone = useSelector((state: RootState) => state.choosePhone);
  const selectedTariff = useSelector((state: RootState) => state.tariff);

  const sendGTM = useSendGTM();

  const choseModel = modelsList.find(
    (model) => model.device_id === choseDeviceID
  ) as IPhoneModel;

  if (!search && !filteredList.length) {
    return <ListLoader />;
  }

  if (choseDeviceID && search === choseModel.device) {
    return <ModelSuccess choseModel={choseModel} />;
  }

  if (search && !filteredList.length) {
    sendGTM({
      event: "event",
      eventCategory: "eventCategory",
      eventAction: "error",
      eventLabel: "ne_nashli_model",
      userId: user.guid,
      userAuth: user.guid ? 1 : 0,
      screenName: "/",
      eventContent: search.split(" ").join("_"),
      actionGroup: "interactions",
      touchPoint: "web",
      CD1: selectedPhone ? md5(selectedPhone.msisdn).toString() : null,
    });

    const handleGetPlastic = () => {
      sendGTM({
        event: "event",
        eventCategory: "eventCategory",
        eventAction: "button_click",
        eventLabel: "poluchit_plastikovuyu_kartu",
        eventValue: selectedPhone.price.toString(),
        userId: user?.guid,
        userAuth: user?.guid ? 1 : 0,
        screenName: "/",
        eventContent: (selectedTariff?.price || 0).toString(),
        buttonLocation: "popup",
        actionGroup: "interactions",
        productName: rus_to_latin(selectedTariff?.name || ""),
        touchPoint: "web",
        CD1: selectedPhone ? md5(selectedPhone.msisdn).toString() : null,
      });
    };

    return (
      <>
        <ModelError />
        <Link
          to="https://some-page.com"
          target="_self"
          style={{ width: "100%" }}
          onClick={handleGetPlastic}
        >
          <Button isFullWidth>Получить пластиковую карту</Button>
        </Link>
      </>
    );
  }

  return <PhoneModelsList filteredList={filteredList} />;
};
