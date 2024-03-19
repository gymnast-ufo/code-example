import { FC, useContext } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { resetPromoCode } from "../../../../store/slices/promoCodeSlice";
import { ModalCard } from "../../../../components/modals/ModalCard";
import { IButtonTheme } from "../../../../components/form-controls/button/button";
import { RootState } from "../../../../store";
import { ITariff } from "../../../../types/tariff";
import { setTariff } from "../../../../store/slices/tariffSlice";
import { ControllerContext } from "../../components/ControllerContext";

interface IIncorrectTariff {
  open: boolean;
  onClose: () => void;
}

const getSeparator = (index: number, array: ITariff[]) => {
  switch (true) {
    case index === 0: return '';
    case index === (array.length - 1): return ' или ';
    default: return ', ';
  }
};

export const IncorrectTariff: FC<IIncorrectTariff> = ({ open, onClose }) => {
  const {
    handlers: { handleTariffChooseClick },
  } = useContext(ControllerContext);
  const tariffIdToChoose = useSelector((state: RootState) => state.tariffToChoose);
  const tariffsList = useSelector((state: RootState) => state.tariffsList);
  const promoCode = useSelector((state: RootState) => state.promoCode);

  const tariffToChoose = tariffsList.find(({ id }) => id === tariffIdToChoose) as ITariff;

  const filteredTariffs = tariffsList.filter((tariff) => {
    return promoCode.conditions?.tariffs?.includes(tariff.id.split('.')[0]);
  });
  const tariffNames = filteredTariffs.reduce((result, { name }, index, array) => {
    const separator = getSeparator(index, array);
    result += (separator + name);
    return result;
  }, '');
  const subTitle= `Промокод действует только на оформление  продукта с тарифом ${tariffNames}`;

  const dispatch = useDispatch();
  const handleContinue = () => {
    dispatch(resetPromoCode());
    dispatch(setTariff(tariffToChoose));
    onClose();
  };
  const handleChangeTariff = () => {
    onClose();
    handleTariffChooseClick();
  };

  const buttons = [
    {
      text: "Выбрать другой тариф",
      onClick: handleChangeTariff,
    },
    {
      text: 'Продолжить без промокода',
      buttonTheme: IButtonTheme.GRAY,
      onClick: handleContinue,
    },
  ];

  return (
    <ModalCard
      open={open}
      title="Оформить этот тариф с промокодом не получится"
      subTitle={subTitle}
      buttons={buttons}
      onClose={onClose}
    />
  );
};
