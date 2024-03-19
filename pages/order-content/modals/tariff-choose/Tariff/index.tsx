import { FC, MouseEvent, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyledTariff } from "../index.styles";
import { ErrorLabel, Text } from "../../../../../styles/shared-css/typography";
import { FlexContainer } from "../../../../../styles/shared-css/shared-components";
import { TariffProps } from "./TariffProps";
import {
  Button,
  IButtonTheme,
} from "../../../../../components/form-controls/button/button";
import { setTariff } from "../../../../../store/slices/tariffSlice";
import { ControllerContext } from "../../../components/ControllerContext";
import { ITariff } from "../../../../../types/tariff";
import { getTariffPriceLabel } from "../../../../../helpers/getTariffPriceLabel";
import { AllIncludedTariff } from "./allIncludedTariff";
import { RootState } from "../../../../../store";
import { rus_to_latin } from "../../../../../helpers/string-helpers";
import { useSendGTM } from "../../../../../helpers/useSendGTM";
import md5 from "crypto-js/md5";
import { IPromoCodeSlice } from "../../../../../store/slices/promoCodeSlice";
import { setTariffToChoose } from "../../../../../store/slices/tariffToChoose";
import { setConfirmedTariff } from "../../../../../store/slices/confirmedTariff";
import { ThemeContext } from "styled-components";

interface ITariffProps {
  tariff: ITariff;
  redButton?: boolean;
  noModal?: boolean;
  onClick?: () => void;
}

const checkCanChangeTariff = (
  newTariff: ITariff["id"],
  promoCode: IPromoCodeSlice
): boolean => {
  if (promoCode.type !== "TARIFF") return true;
  if (!promoCode.conditions?.tariffs?.length) return true;

  const tariffCode = newTariff.split('.')[0];
  return !!promoCode.conditions?.tariffs?.includes(tariffCode);
};

export const Tariff: FC<ITariffProps> = ({
  tariff,
  redButton,
  onClick,
  noModal,
}) => {
  const { id, name, properties, description, allIncluded } = tariff;

  const dispatch = useDispatch();
  const sendGTM = useSendGTM();
  const theme = useContext(ThemeContext);

  const {
    state: { putCartErrorText },
    requests: { putCartLoading },
    handlers: { handleCloseModal, handleRemovingTariffClick },
  } = useContext(ControllerContext);
  const isMobile = window.innerWidth < 768;
  const headerGap = isMobile ? 8 : 12;

  const user = useSelector((state: RootState) => state.userInfo);
  const selectedPhone = useSelector((state: RootState) => state.choosePhone);
  const formOrderId = useSelector((state: RootState) => state.formOrderId);
  const selectedTariff = useSelector((state: RootState) => state.tariff);
  const promoCode = useSelector((state: RootState) => state.promoCode);

  const handleTariffChoose = async (_: MouseEvent<HTMLButtonElement>) => {
    if (checkCanChangeTariff(id, promoCode)) {
      onTariffChooseCallback();
    } else {
      dispatch(setTariffToChoose(id));
      handleRemovingTariffClick();
    }
  };
  const onTariffChooseCallback = () => {
    dispatch(setTariff(tariff));
    dispatch(setConfirmedTariff(tariff));
    handleCloseModal();

    sendGTM({
      event: "event",
      eventCategory: "eventCategory",
      eventAction: "button_click",
      eventLabel: "vybrat_tarif",
      eventValue: selectedPhone?.price.toString(),
      userId: user.guid,
      userAuth: user.guid ? 1 : 0,
      screenName: "/",
      eventContent: rus_to_latin(tariff.name.toString()),
      eventContext: tariff.price.toString(),
      buttonLocation: "popup",
      actionGroup: "interactions",
      touchPoint: "web",
      CD1: selectedPhone ? md5(selectedPhone.msisdn).toString() : null,
    });
    if (onClick) onClick();
  };

  return (
    <StyledTariff column gap={16} noModal={noModal}>
      {/*<TariffTypeMark type={type} />*/}

      {noModal ? (
        <FlexContainer column gap={6}>
          <FlexContainer alignCenter justifyBetween>
            <Text size={20} height={24} weight={500}>
              {name}
            </Text>

            <Text size={20} height={24} weight={500}>
              {getTariffPriceLabel(tariff)}
            </Text>
          </FlexContainer>

          <Text size={14} height={20}>
            {description}
          </Text>
        </FlexContainer>
      ) : (
        <FlexContainer column gap={noModal ? 8 : headerGap}>
          <Text
            size={isMobile ? 20 : 24}
            height={isMobile ? 24 : 28}
            weight={500}
          >
            {name}
          </Text>

          <Text size={isMobile ? 14 : 17} height={isMobile ? 20 : 24}>
            {description}
          </Text>
        </FlexContainer>
      )}

      {allIncluded ? (
        <AllIncludedTariff />
      ) : (
        <TariffProps noModal={noModal} properties={properties} />
      )}

      {/*<Socials socials={socials} />*/}

      {!noModal && (
        <Text size={24} height={28} weight={500}>
          {getTariffPriceLabel(tariff)}
        </Text>
      )}

      <FlexContainer column gap={4}>
        <Button
          isFullWidth
          isLoading={putCartLoading}
          buttonTheme={redButton ? "" : IButtonTheme.GRAY}
          onClick={handleTariffChoose}
          disabled={noModal && selectedTariff.id === tariff.id}
        >
          {noModal && selectedTariff.id === tariff.id ? "Выбрано" : "Выбрать"}
        </Button>

        {putCartErrorText && <ErrorLabel>{putCartErrorText}</ErrorLabel>}
      </FlexContainer>
    </StyledTariff>
  );
};
