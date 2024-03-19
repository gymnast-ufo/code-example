import { FC } from 'react';
import { useDispatch } from "react-redux";
import { resetPromoCode } from "../../../../store/slices/promoCodeSlice";
import { ModalCard } from "../../../../components/modals/ModalCard";
import { IButtonTheme } from "../../../../components/form-controls/button/button";

interface IPromoCodeRemoving {
  open: boolean;
  onClose: () => void;
}

const PromoCodeRemoving: FC<IPromoCodeRemoving> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const handleRemovePromoCode = () => {
    dispatch(resetPromoCode());
    onClose();
  };

  const buttons = [
    {
      text: 'Оставить',
      onClick: onClose,
    },
    {
      text: 'Удалить',
      buttonTheme: IButtonTheme.GRAY,
      onClick: handleRemovePromoCode,
    },
  ];

  return (
    <ModalCard
      open={open}
      title="Промокод будет удалён"
      subTitle="Если вы передумаете, потребуется ввести промокод снова"
      buttons={buttons}
      onClose={onClose}
    />
  );
};

export default PromoCodeRemoving;
