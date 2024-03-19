import { FC, memo, useCallback, useState } from "react";
import { debounce, isEqual } from "lodash";
import { useSelector } from "react-redux";
import Textbox from "../../../../../components/form-controls/textbox/textbox";
import {
  Box,
  FlexContainer,
} from "../../../../../styles/shared-css/shared-components";
import { IFiltersState } from "../types";
import { Checkbox } from "../../../../../components/form-controls/checkbox/checkbox";
import { CategoriesFilter } from "./CategoriesFilter";
import { defaultFilters } from "../";
import { BoxWithRightPadding } from "../../../order-content.styles";
import { RootState } from "../../../../../store";

interface IFilters {
  loading: boolean;
  onUpdateFilters: (newFilters: IFiltersState) => void;
  noModal?: boolean;
}

export const Filters: FC<IFilters> = memo(
  ({ loading, onUpdateFilters, noModal }) => {
    const [filters, setFilters] = useState(defaultFilters);
    const { search, showEndedDigit } = filters;

    const phoneCategories = useSelector(
      (state: RootState) => state.phoneCategories
    );

    const debouncedSetSearch = useCallback(
      debounce((value: string) => {
        updateFiltersState({ search: value });
      }, 700),
      [filters, phoneCategories]
    );
    const handleClearSearch = () => {
      updateFiltersState({ search: "" });
    };

    const handleShowEndedDigit = (value: boolean) => {
      updateFiltersState({ showEndedDigit: value });
    };

    const handlePriceClick = (newCategory: IFiltersState["category"]) => {
      updateFiltersState({ category: newCategory });
    };

    const updateFiltersState = (newStateParts: Partial<IFiltersState>) => {
      const newState = Object.assign({}, filters, newStateParts);
      setFilters(newState);
      if (!isEqual(filters, newState)) {
        onUpdateFilters(newState);
      }
    };

    return (
      <FlexContainer column gap={16}>
        <BoxWithRightPadding ignore={!noModal}>
          <Textbox
            value={search}
            onAccept={debouncedSetSearch}
            mask={"00000000000"}
            inputMode="numeric"
            placeholder="Поиск по цифрам"
            onClickIcon={handleClearSearch}
          />
        </BoxWithRightPadding>

        {((noModal && search) || !noModal) && (
          <Box>
            <Checkbox value={showEndedDigit} onChange={handleShowEndedDigit}>
              Показать только с цифрами в конце
            </Checkbox>
          </Box>
        )}

        <CategoriesFilter
          loading={loading}
          onClick={handlePriceClick}
          noModal={noModal}
        />
      </FlexContainer>
    );
  }
);
