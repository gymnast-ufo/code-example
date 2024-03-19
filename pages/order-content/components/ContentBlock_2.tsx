import { FC, ReactNode, useContext } from "react";
import { ThemeContext } from "styled-components";
import {
  Flex1,
  FlexContainer,
  Skeleton,
} from "../../../styles/shared-css/shared-components";
import {
  IFontFamily,
  SmallLink,
  Text,
} from "../../../styles/shared-css/typography";
import { ChevronRedIcon } from "../../../svg/chevron-red";
import { ContentBlock_2Styled } from "../order-content.styles";

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
  noDescription?: boolean;
  hasText?: boolean;
  text?: boolean;
}

export const ContentBlock: FC<IContentBlock> = (props) => {
  const {
    onlyLinkTouch,
    loading,
    title,
    titleIcon,
    description,
    price,
    linkLabel,
    isGreyBlock,
    onClick,
    text,
    icon,
    noDescription,
    hasText,
    descriptionFirst,
  } = props;
  const theme = useContext(ThemeContext);
  // const loading = true;

  const showLinkContainer = loading || onClick;

  return (
    <ContentBlock_2Styled
      hasIcon={!!icon}
      style={{
        cursor: !loading && onClick && !onlyLinkTouch ? "pointer" : "default",
      }}
      onClick={onClick && !onlyLinkTouch ? onClick : () => {}}
    >
      <FlexContainer alignCenter gap={12}>
        {icon}

        <Flex1>
          <FlexContainer
            column
            gap={4}
            style={{
              flexDirection: descriptionFirst ? "column-reverse" : "column",
            }}
          >
            <>
              {title && (
                <FlexContainer alignCenter gap={8}>
                  {titleIcon}

                  <Text
                    font={IFontFamily.Compact}
                    size={17}
                    height={24}
                    weight={500}
                  >
                    {title}
                  </Text>
                </FlexContainer>
              )}
            </>

            {hasText && (
              <>
                {loading ? (
                  <Skeleton height="24px" width="180px" />
                ) : (
                  <Text
                    font={IFontFamily.Compact}
                    size={17}
                    height={24}
                    weight={400}
                    noSelection
                  >
                    {text}
                  </Text>
                )}
              </>
            )}

            {!noDescription && (
              <>
                {loading ? (
                  <Skeleton height="20px" width="180px" />
                ) : (
                  description && (
                    <Text
                      font={IFontFamily.Compact}
                      size={14}
                      height={20}
                      weight={400}
                      color={theme.secondTextColor}
                      noSelection
                    >
                      {description}
                    </Text>
                  )
                )}
              </>
            )}

            {showLinkContainer && linkLabel && (
              <FlexContainer>
                {loading ? (
                  <Skeleton height="20px" width="80px" />
                ) : (
                  onClick && (
                    <SmallLink onClick={onClick}>{linkLabel}</SmallLink>
                  )
                )}
              </FlexContainer>
            )}

            <FlexContainer>
              {loading ? (
                <Skeleton height="24px" width="64px" />
              ) : (
                <Text weight={500}>{price}</Text>
              )}
            </FlexContainer>
          </FlexContainer>
        </Flex1>

        {icon && <ChevronRedIcon />}
      </FlexContainer>
    </ContentBlock_2Styled>
  );
};
