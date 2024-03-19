import { FC } from 'react';
import { Description, H4Title } from "../../../../../styles/shared-css/typography";

export const FullDiscount: FC<{ price: string }> = ({ price }) => (
  <>
    <H4Title>Номер за {price} — бесплатно</H4Title>

    <Description>
      Выберите любой номер за {price},<br/>
      а он станет бесплатным
    </Description>
  </>
);
