import { FC, useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  FlexContainer,
} from "../../../styles/shared-css/shared-components";
import { IFiltersState } from "../modals/phone-number-choose/types";
import { PhoneList } from "../modals/phone-number-choose/PhoneList";
import { Filters } from "../modals/phone-number-choose/Filters";
import { RootState, useAppDispatch } from "../../../store";
import { ModalPage } from "../../../components/modals/ModalPage";
import { SelectedPhoneModal } from "../modals/phone-number-choose/SelectedPhoneModal";
import {
  ICategory,
  ICategoryCode,
  IGetFreePhonesQueries,
  IPhoneNumber,
} from "../../../types/common";
import { api, useLazyGetFreePhonesCategoriesQuery } from "../../../api";
import {
  resetPhoneCategories,
  setPhoneCategories,
} from "../../../store/slices/phoneCategoriesSlice";
import { setPhoneFilters } from "../../../store/slices/phoneFiltersSlice";
import { PhoneNumberChooseStyled } from "./PhoneNumberChoose.styles";

interface IPhoneNumberChoose {
  onModalClose: () => void;
}

interface IGetQueries {
  (newFilters?: IFiltersState, newLimit?: number): IGetFreePhonesQueries[];
}

export const defaultFilters: IFiltersState = {
  search: "",
  showEndedDigit: false,
  category: undefined,
};

const getMask = (filters: IFiltersState): string => {
  const { search, showEndedDigit } = filters;
  if (!search) {
    return "79%";
  }

  const clearedSearch = search.length > 9 ? search.slice(-9) : search;
  const suffix = showEndedDigit ? "" : "*";
  return `79*${clearedSearch}${suffix}`;
};

const PhoneNumberChoose: FC<IPhoneNumberChoose> = ({ onModalClose }) => {
  const [filters, setFilters] = useState<IFiltersState>(defaultFilters);
  const [modalOpen, setModalOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [limit, setLimit] = useState(0);
  const [rawFreePhoneList, setRawFreePhoneList] = useState<IPhoneNumber[]>([]);
  const [preparedFreePhoneList, setPreparedFreePhoneList] = useState<
    IPhoneNumber[]
  >([]);
  const [phonesLoading, setPhonesLoading] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<IPhoneNumber>({
    msisdn: "",
    salabilityCategoryCode: ICategoryCode.N,
    price: 0,
    hostCode: "",
    msisdnLinked: "",
    phoneTypeCode: "",
    reserveNumber: null,
  });

  const isMobile = window.innerWidth < 768;

  const ref = useRef();

  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();

  const stateSelectedPhone = useSelector(
    (state: RootState) => state.choosePhone
  );

  const currentRegion = useSelector((state: RootState) => state.currentRegion);
  const phoneCategories = useSelector(
    (state: RootState) => state.phoneCategories
  );

  const handleIncreaseLimit = () => {
    const toIncrease = !!filters.category ? 10 : 3;
    const newLimit = limit + toIncrease;
    setLimit(newLimit);

    const queries = getQueries(filters, newLimit);
    getFreePhones(queries);
  };
  const resetLimit = () => {
    const toReset = !!filters.category ? 10 : 3;
    setLimit(toReset);
  };

  const onUpdateFilters = (newFilters: IFiltersState) => {
    setFilters(newFilters);
    resetLimit();
    const newLimit = !!newFilters.category ? 10 : 3;

    const queries = getQueries(newFilters, newLimit);
    getFreePhones(queries);
  };

  const getQueries: IGetQueries = (newFilters = filters, newLimit = limit) => {
    if (!newFilters.category) {
      return phoneCategories.map((category) => ({
        categoriesCode: category.code,
        fiasCode:
          window?.globalSettings?.region?.currentRegionFiasId || currentRegion,
        numberCount: newLimit,
        mask: getMask(newFilters),
      }));
    }

    return [
      {
        categoriesCode: newFilters.category,
        fiasCode:
          window?.globalSettings?.region?.currentRegionFiasId || currentRegion,
        numberCount: newLimit,
        mask: getMask(newFilters),
      },
    ];
  };

  const [getCategories, { data: categoriesData, isLoading, isFetching }] =
    useLazyGetFreePhonesCategoriesQuery();
  useEffect(() => {
    if (!categoriesData) return;

    dispatch(setPhoneCategories(categoriesData));
  }, [categoriesData]);

  const getFreePhones = useCallback(
    async (queries: IGetFreePhonesQueries[]) => {
      setPreparedFreePhoneList([]);
      setPhonesLoading(true);

      try {
        const options = { subscribe: true, forceRefetch: true };
        const promises = queries.map((queryDTO) => {
          return appDispatch(
            api.endpoints.getFreePhones.initiate(queryDTO, options)
          );
        });
        const response = await Promise.allSettled(promises);

        if (!response?.length) return;

        const data: IPhoneNumber[] = response
          .filter((promise) => promise.status === "fulfilled")
          .map((promise) => promise?.value?.data || [])
          .flat();

        setRawFreePhoneList(data);
      } catch (error) {
        console.error(error);
      } finally {
        setPhonesLoading(false);
      }
    },
    []
  );

  const onNumberClick = (number: IPhoneNumber) => {
    setSelectedPhone(number);
  };

  useEffect(() => {
    resetLimit();
    getCategories();

    if (stateSelectedPhone.msisdn) {
      setSelectedPhone(stateSelectedPhone);
    }

    return () => {
      dispatch(resetPhoneCategories());
    };
  }, []);

  useEffect(() => {
    if (!phoneCategories) return;

    const queries = getQueries();

    getFreePhones(queries);
  }, [phoneCategories]);

  useEffect(() => {
    dispatch(setPhoneFilters(filters));
  }, [filters]);

  useEffect(() => {
    resetLimit();
  }, [filters.category]);

  useEffect(() => {
    setModalOpen(isClicked);
  }, [isClicked]);

  useEffect(() => {
    if (!phoneCategories || !rawFreePhoneList?.length) return;

    const categoriesObj = phoneCategories.reduce((target, category) => {
      target[category.code] = category;
      return target;
    }, {} as Record<ICategoryCode, ICategory>);

    const prepared = rawFreePhoneList.map((phone) => {
      const price =
        categoriesObj[phone.salabilityCategoryCode]?.categoryCost || 0;
      return { ...phone, price };
    });

    setPreparedFreePhoneList(prepared);
  }, [phoneCategories, rawFreePhoneList]);

  let offsetTop =
    document?.getElementById("elem")?.offsetTop +
    12 +
    document.getElementById("variant-header-3")?.offsetHeight +
    document.getElementById("app")?.offsetTop;

  return (
    <PhoneNumberChooseStyled id="elem" offsetTop={offsetTop}>
      <FlexContainer column gap={24} fullHeight>
        <Filters
          noModal
          loading={isLoading || isFetching}
          onUpdateFilters={onUpdateFilters}
        />

        <PhoneList
          loading={isLoading || isFetching || phonesLoading}
          limit={limit}
          list={preparedFreePhoneList}
          selectedPhone={selectedPhone}
          onItemClick={onNumberClick}
          onUpload={handleIncreaseLimit}
          noModal
          setIsClicked={setIsClicked}
        />
      </FlexContainer>

      <ModalPage open={modalOpen} withBackground={false} smallSize isFullWidth>
        <SelectedPhoneModal
          selectedPhone={selectedPhone}
          onModalClose={onModalClose}
          isVariant3
        />
      </ModalPage>
    </PhoneNumberChooseStyled>
  );
};

export default PhoneNumberChoose;
