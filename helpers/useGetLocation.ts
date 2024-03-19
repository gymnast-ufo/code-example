import { useEffect, useState } from 'react';

const divider = '#';

export const useReplaceLocation = (newPage: string): string => {
  const { origin: { href }, widget: { getSearchQuery } } = useLocation();
  return `${href}#/${newPage}${getSearchQuery()}`;
};

export const useDivideLocation = () => {
  const { href } = window.location;

  if (href.includes(divider)) return;
  window.history.replaceState(null, '',`${href}${divider}/`);
};

const useGetLocationConstructor = (href: string) => {
  const [hrefState, setHrefState] = useState('');
  const [pathname, setPathname] = useState('');
  const search = new URLSearchParams(href.split('?')[1]);

  const getSearchObject = () => Object.fromEntries(search);

  const getSearchQuery = () => {
    const string = search.toString();
    return string.length ? `?${string}` : string;
  };

  useEffect(() => {
    setHrefState(href);
    setPathname(href.split('?')[0] || '');
  }, [href]);

  return {
    href: hrefState,
    pathname,
    search,
    getSearchObject,
    getSearchQuery,
  };
};

export const useLocation = () => {
  const href = window.location.href;
  const [originHref, widgetHref] = href.split(divider);

  const origin = useGetLocationConstructor(originHref || '');
  const widget = useGetLocationConstructor(widgetHref || '');

  /*
  * урл делится на часть сайта, и часть виджета
  * у каждого свои href и query параметры
  */
  return {
    origin,
    widget,
  };
};
