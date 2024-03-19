import { FC, ReactNode, useContext, useMemo } from "react";
import { ITariffSocials } from "../types";
import { Box, FlexContainer, Icon } from "../../../../../styles/shared-css/shared-components";
import { Text } from "../../../../../styles/shared-css/typography";
import { Kion, Music, Telegram, Whatsapp, Youtube, Zaschitnik } from "../../../../../svg/socials";
import { DefaultIcon } from "./index.styles";
import { ThemeContext } from "styled-components";
import { matchTVIcon, tiktokIcon } from "../../../../../svg/imagesLinks";

interface ISocials {
  socials: ITariffSocials;
}

const maxIconsToRender = 4;

const iconsData: Record<string, ReactNode> = {
  telegram: <Telegram />,
  tiktok: <img src={tiktokIcon} alt="Tiktok" />,
  youtube: <Youtube />,
  zaschitnik: <Zaschitnik />,
  kion: <Kion />,
  music: <Music />,
  whatsapp: <Whatsapp />,
  match: <img src={matchTVIcon} alt="матч ТВ" />,
};

export const Socials: FC<ISocials> = ({ socials }) => {
  const { icons, description } = socials;
  const theme = useContext(ThemeContext);

  const renderedIcons = useMemo(() => {
    const iconsToRender = [...icons];
    if (iconsToRender.length > maxIconsToRender) {
      const iconsToShow = 2;
      const iconsToHide = iconsToRender.length - iconsToShow;
      const hiddenLabel = `+${iconsToHide}`;

      iconsToRender.splice(iconsToShow, iconsToHide, hiddenLabel);
    }

    return iconsToRender.map((icon, index) => {
      const FoundIcon = iconsData?.[icon];
      const renderedIcon = FoundIcon ? FoundIcon : <DefaultIcon>{icon}</DefaultIcon>;
      const isLastElement = index === (iconsToRender.length - 1);

      return (
        <Box key={icon} mr={isLastElement ? 0 : -14}>
          <Icon
            width={44}
            height={44}
            border={`2px solid ${theme.backgroundElevatedColor}`}
            radius="50%"
          >
            {renderedIcon}
          </Icon>
        </Box>
      );
    });
  }, [icons]);

  return (
    <FlexContainer alignCenter gap={16}>
      <FlexContainer>{renderedIcons}</FlexContainer>

      <Text size={14} height={20}>{description}</Text>
    </FlexContainer>
  );
};
