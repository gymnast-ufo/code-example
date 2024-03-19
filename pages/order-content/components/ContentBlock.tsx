import { FC, ReactNode, useContext } from "react";
import { ThemeContext } from "styled-components";
import {
  FlexContainer,
  GridContainer,
  Skeleton,
} from "../../../styles/shared-css/shared-components";
import {
  IFontFamily,
  SmallLink,
  Text,
} from "../../../styles/shared-css/typography";

export interface IContentBlock {
  loading?: boolean;
  title: string;
  titleIcon?: ReactNode;
  price?: string | ReactNode;
  description?: string | ReactNode;
  linkLabel?: string;
  isGreyBlock?: boolean;
  onClick?: () => void;
}

export const ContentBlock: FC<IContentBlock> = (props) => {
  const {
    loading,
    title,
    titleIcon,
    description,
    price,
    linkLabel,
    isGreyBlock,
    onClick,
  } = props;
  const theme = useContext(ThemeContext);

  const defaultLinkLabel = "Изменить";
  const showLinkContainer = loading || onClick;

  return (
    <GridContainer columns="1fr auto" gap={8}>
      <FlexContainer column gap={4}>
        <FlexContainer alignCenter gap={8}>
          {titleIcon}

          <Text
            font={IFontFamily.Compact}
            size={isGreyBlock ? 17 : 20}
            height={24}
            weight={500}
          >
            {title}
          </Text>
        </FlexContainer>

        <FlexContainer
          column
          gap={4}
          style={{ cursor: !!onClick && !titleIcon ? "pointer" : "default" }}
          onClick={onClick && !titleIcon ? onClick : () => {}}
        >
          {loading ? (
            <Skeleton height="20px" width="180px" />
          ) : (
            description && (
              <Text
                font={IFontFamily.Compact}
                size={isGreyBlock ? 14 : 17}
                height={24}
                weight={400}
                color={theme.secondTextColor}
                noSelection
              >
                {description}
              </Text>
            )
          )}

          {showLinkContainer && (
            <FlexContainer>
              {loading ? (
                <Skeleton height="20px" width="80px" />
              ) : (
                onClick && (
                  <SmallLink onClick={onClick}>
                    {linkLabel || defaultLinkLabel}
                  </SmallLink>
                )
              )}
            </FlexContainer>
          )}
        </FlexContainer>
      </FlexContainer>

      <FlexContainer>
        {loading ? (
          <Skeleton height="24px" width="64px" />
        ) : (
          <Text weight={500}>{price}</Text>
        )}
      </FlexContainer>
    </GridContainer>
  );
};
