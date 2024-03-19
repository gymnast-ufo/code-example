import { FC, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import { FlexContainer } from "../../../../../styles/shared-css/shared-components";
import { Button } from "../../../../../components/form-controls/button/button";
import { Text } from "../../../../../styles/shared-css/typography";
import { setConfirmPhone } from "../../../../../store/slices/confirmPhoneSlice";
import { phoneFormatter } from "../../../../../helpers/phoneFormatter";
import { priceFormatter } from "../../../../../helpers/priceFormatter";
import { ThemeContext } from "styled-components";
import { useSendGTM } from "../../../../../helpers/useSendGTM";
import { IPhoneNumber } from "../../../../../types/common";
import { setChoosePhone } from "../../../../../store/slices/choosePhoneSlice";
import md5 from "crypto-js/md5";
import { setConfirmedNumber } from "../../../../../store/slices/confirmedNumber";

interface ISelectedPhoneModal {
  selectedPhone: IPhoneNumber;
  onModalClose: () => void;
  onClick?: () => void;
  isVariant3?: boolean;
}

export const SelectedPhoneModal: FC<ISelectedPhoneModal> = ({
  selectedPhone,
  onModalClose,
  isVariant3,
}) => {
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const sendGTM = useSendGTM();

  const user = useSelector((state: RootState) => state.userInfo);

  const { msisdn, price } = selectedPhone;

  const handlePhoneConfirm = () => {
    dispatch(setConfirmPhone(true));
    dispatch(setChoosePhone(selectedPhone));
    dispatch(setConfirmedNumber(selectedPhone));

    sendGTM({
      event: "event",
      eventCategory: "eventCategory",
      eventAction: "button_click",
      eventLabel: "vybrat_nomer",
      eventValue: selectedPhone.price.toString(),
      userId: user.guid,
      userAuth: user.guid ? 1 : 0,
      screenName: "/",
      buttonLocation: "popup",
      actionGroup: "interactions",
      touchPoint: "web",
      CD1: selectedPhone ? md5(selectedPhone.msisdn).toString() : null,
    });

    onModalClose();
  };

  return (
    <>
      {isVariant3 ? (
        <Button isFullWidth onClick={handlePhoneConfirm}>
          Продолжить
        </Button>
      ) : (
        <FlexContainer column gap={4}>
          <FlexContainer justifyBetween alignCenter>
            <FlexContainer column>
              <Text size={20} height={28} noSelection>
                {phoneFormatter(msisdn)}
              </Text>

              <Text color={theme.tertiaryTextColor}>
                {priceFormatter({ price, freePrice: "Бесплатно" })}
              </Text>
            </FlexContainer>

            <Button style={{ minWidth: "100px" }} onClick={handlePhoneConfirm}>
              Выбрать
            </Button>
          </FlexContainer>
        </FlexContainer>
      )}
    </>
  );
};
