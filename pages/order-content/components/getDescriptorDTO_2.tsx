import { IPhoneModel } from "../../../types/common";
import { IContentBlock } from "./ContentBlock";

export const getDescriptorDTO_2 = (
  selectedDevice: IPhoneModel,
  onClick: () => void
): Omit<IContentBlock, "onClick" | "price"> => {
  const confirmAwaiting = {
    description: (
      <>
        {!!onClick ? (
          <a style={{ cursor: "pointer" }} onClick={onClick}>
            Проверьте
          </a>
        ) : (
          <span>Проверьте</span>
        )}
        , поддерживает ли ваше устройство eSIM
      </>
    ),
    linkLabel: null,
  };
  const confirmed = {
    description: `Ваш ${selectedDevice.device} поддерживает технологию.`,
    linkLabel: "Проверить другую модель",
  };

  return selectedDevice.device_id ? confirmed : confirmAwaiting;
};
