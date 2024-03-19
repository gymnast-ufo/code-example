import { IPhoneModel } from "../../../types/common";
import { IContentBlock } from "./ContentBlock";
import { InfoFill, OkIcon } from "../../../svg";
import React, { useContext } from "react";
import { Icon } from "../../../styles/shared-css/shared-components";
import { ThemeContext } from "styled-components";

export const getDescriptorDTO = (
  selectedDevice: IPhoneModel,
  onClick?: () => void
): Omit<IContentBlock, "onClick" | "price"> => {
  const theme = useContext(ThemeContext);

  const confirmAwaiting = {
    title: !!onClick ? "Совместимость eSIM" : "Поддержка eSIM",
    titleIcon: (
      <Icon width={18} height={18} color={theme.accentActive}>
        <InfoFill />
      </Icon>
    ),
    description: (
      <>
        {!!onClick ? (
          <a style={{ cursor: "pointer" }} onClick={onClick}>
            Проверьте
          </a>
        ) : (
          <span>Проверьте</span>
        )}
        ,{" "}
        {!!onClick
          ? "работает ли eSIM на вашем смартфоне"
          : "доступна ли технология на вашем устройстве."}
      </>
    ),
    linkLabel: !!onClick ? null : "Проверить",
  };
  const confirmed = {
    title: !!onClick ? "Совместимость eSIM" : "Поддержка eSIM",
    titleIcon: (
      <Icon width={18} height={18} color={theme.accentPositive}>
        <OkIcon />
      </Icon>
    ),
    description: `Ваш ${selectedDevice.device} поддерживает технологию.`,
    linkLabel: "Проверить другую модель",
  };

  return selectedDevice.device_id ? confirmed : confirmAwaiting;
};
