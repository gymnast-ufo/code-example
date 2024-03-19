import React, { FC, memo, MouseEvent } from "react";
import { PhoneListItem } from "./PhoneListItem";
import {
  Box,
  FlexContainer,
  Skeleton,
} from "../../../../../styles/shared-css/shared-components";
import {
  Button,
  IButtonTheme,
} from "../../../../../components/form-controls/button/button";
import { IPhoneNumber } from "../../../../../types/common";
import { EmptyList } from "./EmptyList";
import { BoxWithRightPadding } from "../../../order-content.styles";
import { ListContainer } from "./index.styles";

interface IPhoneList {
  loading: boolean;
  limit: number;
  list: IPhoneNumber[];
  selectedPhone?: IPhoneNumber;
  onItemClick: (number: IPhoneNumber) => void;
  onUpload: (event: MouseEvent<HTMLButtonElement>) => void;
  noModal?: boolean;
  setIsClicked?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PhoneList: FC<IPhoneList> = memo(({
  loading,
  limit,
  list,
  selectedPhone,
  onItemClick,
  onUpload,
  noModal,
  setIsClicked,
}) => {
  const showMoreButton = list.length >= limit && !loading;

  const onListItemClick = (clickedPhone: IPhoneNumber["msisdn"]) => {
    const clickedFullNumber = list.find(
      ({ msisdn }) => msisdn === clickedPhone
    );
    if (setIsClicked) setIsClicked(true);
    if (!clickedFullNumber) {
      console.error("Выбранный номер не найден");
      return;
    }

    onItemClick(clickedFullNumber);
  };

  let content;
  if (loading) {
    content = Array.from(Array(6), (_, i) => {
      return (
        <BoxWithRightPadding ignore={!noModal}>
          <Skeleton key={i} height="24px" width="100%" />
        </BoxWithRightPadding>
      );
    });
  } else if (list.length) {
    content = list.map((phoneListItem) => (
      <BoxWithRightPadding key={phoneListItem.msisdn} ignore={!noModal}>
        <PhoneListItem
          phone={phoneListItem}
          selectedPhone={selectedPhone}
          onClick={onListItemClick}
        />
      </BoxWithRightPadding>
    ));
  } else {
    content = <EmptyList />;
  }

  return (
    <FlexContainer
      column
      gap={24}
      style={
        noModal && {
          flex: "1",
          height: "calc(100% - 230px)",
        }
      }
    >
      <ListContainer>
        {content}

        {showMoreButton && (
          <BoxWithRightPadding bottom ignore={!noModal}>
            <Button
              isFullWidth
              buttonTheme={IButtonTheme.GRAY}
              onClick={onUpload}
            >
              Показать ещё
            </Button>
          </BoxWithRightPadding>
        )}
      </ListContainer>
    </FlexContainer>
  );
});
