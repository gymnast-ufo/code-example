import { FC, ReactNode, useContext } from "react";
import { ThemeContext } from "styled-components";
import {
  IFontFamily,
  SmallLink,
  Text,
} from "../../../styles/shared-css/typography";

export interface IContentBlock {
  onlyLinkTouch?: boolean;
  loading?: boolean;
  title: string;
  titleIcon?: ReactNode;
  price?: string | ReactNode;
  description?: string | ReactNode;
  linkLabel?: string;
  isGreyBlock?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  descriptionFirst?: boolean;
}

export const ContentBlockCheckPhone_3: FC<IContentBlock> = (props) => {
  const { description, linkLabel, onClick } = props;
  const theme = useContext(ThemeContext);

  return (
    <div>
      <Text
        font={IFontFamily.Compact}
        size={17}
        height={24}
        weight={400}
        noSelection
      >
        {description}
      </Text>

      <SmallLink onClick={onClick}>{linkLabel}</SmallLink>
    </div>
  );
};
