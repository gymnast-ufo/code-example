import { FC, MouseEvent, useEffect, useState } from "react";
import { priceFormatter } from "../../../../../helpers/priceFormatter";
import { IFiltersState } from "../types";
import { CategoriesContainer, CategoryFilterElement } from "./index.styles";
import { ICategoryCode } from "../../../../../types/common";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { Skeleton } from "../../../../../styles/shared-css/shared-components";
import { MouseScroll } from "../../../../../components/HorizontalScroll";

interface ICategoriesFilter {
  loading: boolean;
  onClick: (newCategory: IFiltersState["category"]) => void;
  noModal?: boolean;
}

export const CategoriesFilter: FC<ICategoriesFilter> = ({
  loading,
  onClick,
  noModal,
}) => {
  const [choseCategory, setChoseCategory] =
    useState<IFiltersState["category"]>(undefined);

  const phoneCategories = useSelector(
    (state: RootState) => state.phoneCategories
  );

  const handlePriceClick =
    (category: ICategoryCode) => (_: MouseEvent<HTMLElement>) => {
      const categoryToChoose =
        category === choseCategory ? undefined : category;
      setChoseCategory(categoryToChoose);
    };

  useEffect(() => {
    onClick(choseCategory);
  }, [choseCategory]);

  const skeletons = Array.from(Array(4), (_, i) => {
    return <Skeleton key={i} height="32px" width="90px" br="20px" />;
  });

  const pricesElements = phoneCategories.map(({ categoryCost, code }) => {
    const activeClass = choseCategory === code ? "active" : undefined;

    return (
      <CategoryFilterElement
        key={code}
        className={activeClass}
        onClick={handlePriceClick(code)}
        noModal
      >
        {priceFormatter({ price: categoryCost, freePrice: "Бесплатные" })}
      </CategoryFilterElement>
    );
  });

  return (
    <MouseScroll noModal={noModal}>
      <CategoriesContainer noModal={noModal}>
        {loading ? skeletons : pricesElements}
      </CategoriesContainer>
    </MouseScroll>
  );
};
