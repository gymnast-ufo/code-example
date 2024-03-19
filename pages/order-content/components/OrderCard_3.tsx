import { FC, useContext, useEffect, useState } from "react";
import { ThemeContext } from "styled-components";
import { ContentBlock } from "./ContentBlock_2";
import { phoneFormatter } from "../../../helpers/phoneFormatter";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  Box,
  Flex1,
  FlexContainer,
  HRLine,
  WhiteBlock,
} from "../../../styles/shared-css/shared-components";
import { ControllerContext } from "./ControllerContext";
import { getConfirmTariff } from "./helpers";
import { TariffIcon } from "../../../svg/tariff-icon";
import PhoneNumberChoose from "./PhoneNumberChoose";
import { Description, Link, Text } from "../../../styles/shared-css/typography";
import { OkBigIcon } from "../../../svg/ok-big";
import { priceFormatter } from "../../../helpers/priceFormatter";

export const OrderCard: FC = () => {
  const selectedPhone = useSelector((state: RootState) => state.choosePhone);
  const tariff = useSelector((state: RootState) => state.tariff);
  const theme = useContext(ThemeContext);

  const [isEditNumber, setIsEditNumber] = useState(false);

  const { msisdn, price } = selectedPhone;

  const { handlers, requests } = useContext(ControllerContext);

  const phoneNumberDescription = msisdn || "Выберите номер";
  const confirmTariff = getConfirmTariff(tariff);
  const isNotMembrana = theme.name !== "membrana";

  useEffect(() => {
    if (!msisdn) setIsEditNumber(true);
  }, []);

  return (
    <FlexContainer column gap={12}>
      {/* <ContentBlock
        loading={phonesLoading}
        price={price ? <PriceCard price={price} /> : "Бесплатно"}
        description={phoneFormatter(phoneNumberDescription)}
        onClick={isNotMembrana && handleNumberChooseClick}
        icon={<PhoneIcon />}
      /> */}
      <WhiteBlock borderRadius="24px">
        {!isEditNumber ? (
          <>
            <Box mb={12}>
              <FlexContainer justifyBetween>
                <Text weight={500}>Номер</Text>

                <Link onClick={() => setIsEditNumber(true)}>Изменить</Link>
              </FlexContainer>
            </Box>

            <FlexContainer gap={12}>
              <OkBigIcon />
              <Flex1 column>
                <Box mb={8}>
                  <FlexContainer style={{ width: "100%" }} justifyBetween>
                    <Text>{phoneFormatter(msisdn)}</Text>
                    <Text weight={500}>
                      {priceFormatter({ price, freePrice: "Бесплатно" })}
                    </Text>
                  </FlexContainer>
                </Box>
                <HRLine mb={8} />
                <Box>
                  <FlexContainer style={{ width: "100%" }} justifyBetween>
                    <Text>Активация eSIM</Text>
                    <Text weight={500}>
                      {priceFormatter({ price: 100, freePrice: "Бесплатно" })}
                    </Text>
                  </FlexContainer>
                </Box>

                <Text size={14}>
                  <Description>Зачислим и спишем после активации </Description>
                </Text>
              </Flex1>
            </FlexContainer>
          </>
        ) : (
          <>
            <Box mb={16}>
              <Text weight={500}>Выберите номер</Text>
            </Box>
            <PhoneNumberChoose
              onModalClose={() => {
                setIsEditNumber(false);
              }}
            />
          </>
        )}
      </WhiteBlock>

      {!isEditNumber && <></>}
    </FlexContainer>
  );
};
