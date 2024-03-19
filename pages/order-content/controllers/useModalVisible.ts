import { useState } from "react";
import { IModalType } from "../order-content.controller";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useSendGTM } from "../../../helpers/useSendGTM";
import md5 from "crypto-js/md5";

interface IUseModalVisibleHandlers {
  handleCloseModal: () => void;
  handleNumberChooseClick: () => void;
  handlePhoneCheckClick: () => void;
  handleTariffChooseClick: () => void;
  handlePromoCodeClick: () => void;
  handlePriceClick: () => void;
  handleRemovingPromoClick: () => void;
}
interface IUseModalVisible {
  (): [IModalType | null, IUseModalVisibleHandlers];
}

export const useModalVisible: IUseModalVisible = () => {
  const [openModalType, setOpenModalType] = useState<IModalType | null>(null);

  const sendGTM = useSendGTM();

  const selectedPhone = useSelector((state: RootState) => state.choosePhone);
  const selectedTariff = useSelector((state: RootState) => state.tariff);
  const selectedDevice = useSelector(
    (state: RootState) => state.selectedDevice
  );
  const user = useSelector((state: RootState) => state.userInfo);
  const formOrderId = useSelector((state: RootState) => state.formOrderId);

  const handleNumberChooseClick = () => {
    sendGTM({
      event: "event",
      eventCategory: "eventCategory",
      eventAction: "element_click",
      eventLabel: "izmenit_nomer",
      eventValue: selectedPhone?.price?.toString(),
      userId: user.guid,
      userAuth: user.guid ? 1 : 0,
      screenName: "/",
      actionGroup: "interactions",
      touchPoint: "web",
      CD1: selectedPhone ? md5(selectedPhone.msisdn).toString() : null,
    });

    setOpenModalType(IModalType.NUMBER);
  };
  const handleTariffChooseClick = () => {
    sendGTM({
      event: "event",
      eventCategory: "eventCategory",
      eventAction: "element_click",
      eventLabel: "izmenit_tarif",
      eventValue: selectedTariff?.price?.toString(),
      userId: user.guid,
      userAuth: user.guid ? 1 : 0,
      screenName: "/",
      eventContent: selectedTariff?.name,
      actionGroup: "interactions",
      touchPoint: "web",
      CD1: selectedPhone ? md5(selectedPhone.msisdn).toString() : null,
    });

    setOpenModalType(IModalType.TARIFF);
  };
  const handlePhoneCheckClick = () => {
    sendGTM({
      event: "event",
      eventCategory: "eventCategory",
      eventAction: "element_click",
      eventLabel: selectedDevice.device_id
        ? "proverit_druguu_model"
        : "proverit",
      eventValue: "proverit",
      userId: user.guid,
      userAuth: user.guid ? 1 : 0,
      screenName: "/",
      actionGroup: "interactions",
      touchPoint: "web",
      CD1: selectedPhone ? md5(selectedPhone.msisdn).toString() : null,
    });

    setOpenModalType(IModalType.PHONE);
  };
  const handlePromoCodeClick = () => {
    setOpenModalType(IModalType.PROMO);
  };
  const handleRemovingPromoClick = () => {
    setOpenModalType(IModalType.REMOVE_PROMO);
  };
  const handleRemovingTariffClick = () => {
    setOpenModalType(IModalType.REMOVE_TARIFF);
  };

  const handlePriceClick = () => {
    setOpenModalType(IModalType.PRICE);
  };

  const handleCloseModal = () => setOpenModalType(null);

  const handlers = {
    handleCloseModal,
    handleNumberChooseClick,
    handlePhoneCheckClick,
    handleTariffChooseClick,
    handlePromoCodeClick,
    handlePriceClick,
    handleRemovingPromoClick,
    handleRemovingTariffClick,
  };
  return [openModalType, handlers];
};
