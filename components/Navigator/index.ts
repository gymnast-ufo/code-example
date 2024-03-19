import { useNavigate as useReactNavigate } from "react-router-dom";
import { useLocation } from "../../helpers/useGetLocation";
import { chainify } from "./chainify";
import { removeSlash } from "../../helpers/string-helpers";

type IQueryParams = Record<string, string | number | boolean>;

class Navigator {
  private _navigate;
  private _params: URLSearchParams;

  constructor() {
    const { widget } = useLocation();
    this._navigate = useReactNavigate();
    this._params = widget.search;
  }

  public addParams(newParams: IQueryParams) {
    const origin = this.args || this;

    for (let paramKey in newParams) {
      origin._params.set(paramKey, String(newParams[paramKey]));
    }

    return this.c_delay().c_chain(function () {
      this.c_next();
    }, origin);
  }

  public removeParams(...params: string[]) {
    const origin = this.args || this;

    function remove() {
      for (let param in params) {
        origin._params.delete(param);
      }
      this.c_next();
    }

    return this.c_delay().c_chain(remove, origin);
  }

  public navigate(newLocation: string) {
    const origin = this.args || this;

    return this.c_delay().c_chain(function () {
      const cleanedLocation = removeSlash(newLocation);
      const stringified = origin._params.toString();
      const query = !!stringified ? `?${stringified}` : "";
      const navigateTo = `/${cleanedLocation}${query}`;

      origin._navigate(navigateTo);
      this.c_next();
    }, origin);
  }
}

export default chainify(Navigator);
