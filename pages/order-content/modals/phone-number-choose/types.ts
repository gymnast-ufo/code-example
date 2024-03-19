import { ICategoryCode } from "../../../../types/common";

export interface IFiltersState {
  search: string;
  showEndedDigit: boolean;
  category: ICategoryCode | undefined;
}
