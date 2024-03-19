import { FC, useContext } from "react";
import { Button } from "../../../../components/form-controls/button/button";
import { ControllerContext } from "../../components/ControllerContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import {
  Box,
  FlexContainer,
} from "../../../../styles/shared-css/shared-components";
import { Text, Description } from "../../../../styles/shared-css/typography";
import { priceFormatter } from "../../../../helpers/priceFormatter";

const PriceModal: FC = () => {
  const selectedPhone = useSelector((state: RootState) => state.choosePhone);
  const tariff = useSelector((state: RootState) => state.tariff);
 

  const {
    handlers: { handleCloseModal },
  } = useContext(ControllerContext);
  return (
    <>
      <Box mb={16}>
        <Text size={17} weight={500}>
          <FlexContainer column gap={8}>
            <FlexContainer justifyBetween>
              <div>Номер</div>
              <div>{priceFormatter({ price: selectedPhone.price })}</div>
            </FlexContainer>
            <FlexContainer justifyBetween>
              <div>Тариф</div>
              <div>{priceFormatter({ price: tariff.price })}</div>
            </FlexContainer>
            <FlexContainer justifyBetween>
              <div>Активация карты</div>
              <div>{priceFormatter({ price: tariff.activationPrice })}</div>
            </FlexContainer>
          </FlexContainer>
        </Text>
        <Description>Зачислим и спишем после активации</Description>
      </Box>
      <Button isFullWidth onClick={handleCloseModal}>
        Понятно
      </Button>
    </>
  );
};

export default PriceModal;
