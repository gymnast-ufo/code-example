import { FC, useContext, useState } from "react";
import { ThemeContext } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  FlexContainer,
  Icon,
} from "../../../../../styles/shared-css/shared-components";
import { SuccessSmall } from "../../../../../svg";
import { SmallLink, Text } from "../../../../../styles/shared-css/typography";
import { Button } from "../../../../../components/form-controls/button/button";
import { ControllerContext } from "../../../components/ControllerContext";
import { IPhoneModel } from "../../../../../types/common";
import { ModalPage } from "../../../../../components/modals/ModalPage";
import { IOSFAQ } from "./ModelsFAQ/IOSFAQ";
import { setDevice } from "../../../../../store/slices/selectedDeviceSlice";
import { setDeviceID } from "../../../../../store/slices/chooseDeviceIDSlice";
import { AndroidFAQ } from "./ModelsFAQ/AndroidFAQ";
import { RootState } from "../../../../../store";
import { useSendGTM } from "../../../../../helpers/useSendGTM";
import md5 from "crypto-js/md5";

interface IModelSuccess {
  choseModel: IPhoneModel;
}

export const ModelSuccess: FC<IModelSuccess> = ({ choseModel }) => {
  const [openFAQModal, setOpenFAQModal] = useState(false);
  const user = useSelector((state: RootState) => state.userInfo);
  const formOrderId = useSelector((state: RootState) => state.formOrderId);
  const selectedPhone = useSelector((state: RootState) => state.choosePhone);

  const isApple = choseModel.manufacturer === "Apple";
  const phoneLabel = isApple ? "iPhone" : "телефона";

  const theme = useContext(ThemeContext);
  const {
    handlers: { handleCloseModal },
  } = useContext(ControllerContext);
  const dispatch = useDispatch();
  const sendGTM = useSendGTM();

  const handleConfirmDevice = () => {
    sendGTM({
      event: "event",
      eventCategory: "eventCategory",
      eventAction: "button_click",
      eventLabel: "k_polucheniu",
      userId: user.guid,
      userAuth: user.guid ? 1 : 0,
      screenName: "/",
      buttonLocation: "popup",
      actionGroup: "interactions",
      touchPoint: "web",
      CD1: selectedPhone ? md5(selectedPhone.msisdn).toString() : null,
    });
    dispatch(setDevice(choseModel));
    dispatch(setDeviceID(0));
    handleCloseModal();
  };

  const handleOpenFAQ = () => {
    sendGTM({
      event: "event",
      eventCategory: "eventCategory",
      eventAction: "element_click",
      eventLabel: "kak_uznat_model_iphone",
      userId: user.guid,
      userAuth: user.guid ? 1 : 0,
      screenName: "/",
      actionGroup: "interactions",
      touchPoint: "web",
      CD1: selectedPhone ? md5(selectedPhone.msisdn).toString() : null,
    });
    setOpenFAQModal(true);
  };
  const handleCloseFAQ = () => setOpenFAQModal(false);

  return (
    <>
      <FlexContainer column gap={24}>
        <FlexContainer gap={16} alignCenter>
          <Icon width={18} height={18} color={theme.accentPositive}>
            <SuccessSmall />
          </Icon>

          <Text>Ваше устройство поддерживает продукт</Text>
        </FlexContainer>

        <FlexContainer column gap={8}>
          {choseModel.versions && (
            <Text size={14} height={20} color={theme.secondTextColor}>
              Номера моделей, поддерживающие продукт: (
              {choseModel.versions.join(", ")})
            </Text>
          )}

          <SmallLink onClick={handleOpenFAQ}>
            Как узнать модель {phoneLabel}?
          </SmallLink>

          <Text size={14} height={20} color={theme.secondTextColor}>
            Обратите внимание:
            <br />
            Модели для рынка Китая не поддерживают продукт. Смартфоны, которые
            связаны с конкретным оператором связи (приобретённые, например,
            на рынках США и Европы), могут также не работать с продуктом
            и SIM-картами МТС
          </Text>
        </FlexContainer>

        <Button isFullWidth onClick={handleConfirmDevice}>
          К получению продукта
        </Button>
      </FlexContainer>

      <ModalPage
        smallSize
        open={openFAQModal}
        title="Поиск номера модели"
        onBack={handleCloseFAQ}
      >
        {isApple ? <IOSFAQ /> : <AndroidFAQ />}
      </ModalPage>
    </>
  );
};
