import { ITariff } from "../../../types/tariff";
import {
  getTariffDescription,
  getTariffDescription_v2,
} from "../../../helpers/getTariffDescription";
import {
  getPriceLabel,
  getTariffPriceLabel,
} from "../../../helpers/getTariffPriceLabel";

export const getConfirmTariff = (tariff?: ITariff) => {
  if (!tariff?.id) {
    return {
      price: 0,
      activationPrice: "",
      description: "Выберите тариф",
    };
  }

  return {
    price: tariff.price,
    activationPrice: getPriceLabel(tariff.activationPrice),
    description: getTariffDescription(tariff),
    description_2: getTariffDescription_v2(tariff),
  };
};
