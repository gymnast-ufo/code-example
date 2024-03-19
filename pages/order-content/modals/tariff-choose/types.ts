import { ITariffPropType } from "../../../../types/tariff";

export enum ITariffType {
  DEFAULT = 'DEFAULT',
  CUSTOMIZE = 'CUSTOMIZE',
  FAMILY = 'FAMILY',
}

export interface ITariffProperty {
  type: ITariffPropType;
  description: string;
}

export interface ITariffSocials {
  icons: string[];
  description: string;
}
