import { ChangeEvent, FC, memo } from "react";
import { useSelector } from "react-redux";
import { priceFormatter } from "../../../../../helpers/priceFormatter";
import { Description } from "../../../../../styles/shared-css/typography";
import { RadioButton } from "../../../../../components/form-controls/radio/radio-button";
import { Flex1 } from "../../../../../styles/shared-css/shared-components";
import { RootState } from "../../../../../store";
import { IPhoneNumber } from "../../../../../types/common";
import reactStringReplace from "react-string-replace";
import { transform } from "../../../../../helpers/phone-highlight-service";
import { MatchedNumber } from "./index.styles";

interface IPhoneListItem {
  phone: IPhoneNumber;
  selectedPhone?: IPhoneNumber;
  onClick: (clickedPhone: IPhoneNumber["msisdn"]) => void;
}

export const PhoneListItem: FC<IPhoneListItem> = memo(({
  phone,
  selectedPhone,
  onClick,
}) => {
  const { msisdn, price } = phone;
  const phoneFilters = useSelector((state: RootState) => state.phoneFilters);
  const isPhoneChecked = phone.msisdn === selectedPhone?.msisdn;

  const handleChange = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    onClick(target.value);
  };

  const matchedPhoneNumber = reactStringReplace(
    transform(
      msisdn,
      phoneFilters.search.replaceAll(/\D/g, ""),
      phoneFilters.showEndedDigit
    ),
    /match(\d)match/,
    (match, i) => <MatchedNumber key={i}>{match}</MatchedNumber>
  );

  const phoneLabel = (
    <Flex1 justifyBetween alignCenter>
      <div>{matchedPhoneNumber}</div>

      <Description>
        {priceFormatter({ price, freePrice: "Бесплатно" })}
      </Description>
    </Flex1>
  );

  return (
    <RadioButton
      id={msisdn}
      name="phone"
      value={msisdn}
      checked={isPhoneChecked}
      label={phoneLabel}
      onChange={handleChange}
    />
  );
});
