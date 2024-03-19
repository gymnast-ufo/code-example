import { FC, lazy, useContext } from "react";
import { ModalPage } from "../../../components/modals/ModalPage";
import { IModalType } from "../order-content.controller";
import { ControllerContext } from "./ControllerContext";
import PromoCodeRemoving from "../modals/promo-code-removing";
import { IncorrectTariff } from "../modals/incorrect-tariff";

const PhoneNumberChoose = lazy(() => import("../modals/phone-number-choose"));
const TariffChoose = lazy(() => import("../modals/tariff-choose"));
const PhoneChecking = lazy(() => import("../modals/phone-checking"));
const PromoCodeModal = lazy(() => import("../modals/promo-code"));
const PriceModal = lazy(() => import("../modals/price-description"));

export const ModalsContainer: FC = () => {
  const controller = useContext(ControllerContext);
  const { state, handlers } = controller;
  const { openModalType } = state;
  const { handleCloseModal } = handlers;

  const isNumberModalType = openModalType === IModalType.NUMBER;
  const isTariffModalType = openModalType === IModalType.TARIFF;
  const isPhoneModalType = openModalType === IModalType.PHONE;
  const isPromoCodeModalType = openModalType === IModalType.PROMO;
  const isPriceModalType = openModalType === IModalType.PRICE;
  const isRemovingPromoModalType = openModalType === IModalType.REMOVE_PROMO;
  const isRemovingTariffModalType = openModalType === IModalType.REMOVE_TARIFF;

  return (
    <>
      <ModalPage
        open={isNumberModalType}
        title="Выберите номер"
        onClose={handleCloseModal}
      >
        <PhoneNumberChoose onModalClose={handleCloseModal} />
      </ModalPage>

      <ModalPage
        open={isTariffModalType}
        title="Выберите тариф"
        subTitle="После активации eSIM вы сможете его поменять или настроить"
        onClose={handleCloseModal}
      >
        <TariffChoose />
      </ModalPage>

      <ModalPage
        open={isPhoneModalType}
        title="Проверка устройства"
        onClose={handleCloseModal}
      >
        <PhoneChecking />
      </ModalPage>

      <ModalPage
        smallSize
        open={isPromoCodeModalType}
        onClose={handleCloseModal}
      >
        <PromoCodeModal />
      </ModalPage>

      <PromoCodeRemoving
        open={isRemovingPromoModalType}
        onClose={handleCloseModal}
      />

      <ModalPage
        smallSize
        open={isPriceModalType}
        onClose={handleCloseModal}
        title="Что входит в стоимость"
      >
        <PriceModal />
      </ModalPage>

      <IncorrectTariff
        open={isRemovingTariffModalType}
        onClose={handleCloseModal}
      />
    </>
  );
};
