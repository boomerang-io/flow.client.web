import { useQuery as rqUseQuery } from "react-query";
import { resolver } from "Config/servicesConfig";

export default function useQuery(url, ...props) {
  return rqUseQuery(url, resolver.query(url), ...props);
}
