interface OrderContentInterface {
  isMobile: boolean;
  isNotMembrana: boolean;
  showPromocode: boolean;
  handlePromoCodeClick: () => void;
  handleRemovingPromoClick: () => void;
  totalPrice: number;
  handleOnNextButtonClick: () => void;
  nextButtonLoading: boolean;
  putCartErrorText?: string;
  handlePhoneCheckClick: () => void;
  handlePriceClick?: () => void;
}

export default OrderContentInterface;
