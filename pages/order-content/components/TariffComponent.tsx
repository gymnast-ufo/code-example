import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  CentreContainer,
  FlexContainer,
} from "../../../styles/shared-css/shared-components";
import { Tariff } from "../modals/tariff-choose/Tariff";
import { useGetTariffsQuery } from "../../../api";
import { RootState } from "../../../store";
import { ITariff } from "../../../types/tariff";
import { SkeletonTariff } from "../modals/tariff-choose/Tariff/SkeletonTariff";
import useError from "../../../helpers/error-handler";
import { TariffComponentStyled } from "./TariffComponent.styles";

interface ITariffCompoment {
  onClick: () => void;
}

const TariffCompoment: FC<ITariffCompoment> = ({ onClick }) => {
  const [tariffs, setTariffs] = useState<Array<ITariff>>([]);
  const region = useSelector((state: RootState) => state.currentRegion);

  const {
    data: tariffsData,
    isLoading,
    error,
  } = useGetTariffsQuery({
    fias_code: window?.globalSettings?.region?.currentRegionFiasId || region,
    WithPromotions: true,
  });

  useEffect(() => {
    if (tariffsData) {
      setTariffs(tariffsData);
    }
  }, [tariffsData]);

  useError(error);

  const skeletons = Array.from(Array(3), (_, i) => {
    return <SkeletonTariff key={i} noModal />;
  });

  const rendersTariffs = useMemo(
    () =>
      tariffs.map((tariff) => (
        <Tariff
          redButton
          key={tariff.id}
          tariff={tariff}
          noModal
          onClick={onClick}
        />
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

  let offsetTop = document?.getElementById("tariff-elem")?.offsetTop + 16;

  return (
    <TariffComponentStyled id={"tariff-elem"} offsetTop={offsetTop}>
      <Box pb={8}></Box>
      <FlexContainer column gap={12}>
        {content}
      </FlexContainer>
    </TariffComponentStyled>
  );
};

export default TariffCompoment;
