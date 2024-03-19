import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  CentreContainer,
  FlexContainer,
} from "../../../../styles/shared-css/shared-components";
import { Tariff } from "./Tariff";
import { useLazyGetTariffsQuery } from "../../../../api";
import { RootState } from "../../../../store";
import { ITariff } from "../../../../types/tariff";
import { SkeletonTariff } from "./Tariff/SkeletonTariff";
import useError from "../../../../helpers/error-handler";

const TariffChoose: FC = () => {
  const [tariffs, setTariffs] = useState<Array<ITariff>>([]);
  const region = useSelector((state: RootState) => state.currentRegion);
  const tariffsList = useSelector((state: RootState) => state.tariffsList);
  const variant = useSelector((state: RootState) => state.variant);

  const [getTariffsTrigger, { data: tariffsData, isLoading, error }] =
    useLazyGetTariffsQuery();

  useEffect(() => {
    if (tariffsData) {
      setTariffs(tariffsData);
    }
  }, [tariffsData]);

  useEffect(() => {
    if (tariffsList.length) {
      setTariffs(tariffsList);
    } else {
      const fias_code =
        window?.globalSettings?.region?.currentRegionFiasId || region;
      getTariffsTrigger({ fias_code, WithPromotions: true });
    }
  }, []);

  useError(error);

  const skeletons = Array.from(Array(3), (_, i) => {
    return <SkeletonTariff key={i} />;
  });

  const rendersTariffs = useMemo(
    () =>
      tariffs.map((tariff) => (
        <Tariff key={tariff.id} tariff={tariff} redButton={variant === 2} />
      )),
    [tariffs]
  );

  let content: ReactNode;

  if (isLoading) {
    content = skeletons;
  } else if (!!tariffs.length) {
    content = rendersTariffs;
  } else {
    content = <CentreContainer>Нет подходящих тарифов</CentreContainer>;
  }

  return (
    <FlexContainer column gap={20}>
      {content}
    </FlexContainer>
  );
};

export default TariffChoose;
