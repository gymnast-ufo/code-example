import { FC } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  IButtonTheme,
} from "../../../components/form-controls/button/button";
import { Text } from "../../../styles/shared-css/typography";
import {
  Box,
  FlexContainer,
  Icon,
} from "../../../styles/shared-css/shared-components";
import { RootState } from "../../../store";
import { InfoOutline, Trash } from "../../../svg";

interface IPromoCodeAction {
  onPromoCodeClick: () => void;
  onRemovingPromoClick: () => void;
}

export const PromoCodeAction: FC<IPromoCodeAction> = ({
  onPromoCodeClick,
  onRemovingPromoClick,
}) => {
  const promoCode = useSelector((state: RootState) => state.promoCode);

  return (
    <FlexContainer gap={8}>
      <Button
        isFullWidth
        buttonTheme={IButtonTheme.SECONDARY}
        onClick={onPromoCodeClick}
      >
        {promoCode.value ? (
          <>
            <Box mr={8}>
              <Text weight={500} color="currentColor">
                {promoCode.value}
              </Text>
            </Box>

            <Icon>
              <InfoOutline />
            </Icon>
          </>
        ) : (
          "Ввести промокод"
        )}
      </Button>

      {promoCode.value && (
        <Button buttonTheme={IButtonTheme.GRAY} onClick={onRemovingPromoClick}>
          <Icon>
            <Trash />
          </Icon>
        </Button>
      )}
    </FlexContainer>
  );
};
