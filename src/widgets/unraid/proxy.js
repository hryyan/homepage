import { formatApiCall } from "utils/proxy/api-helpers";
import { httpProxy } from "utils/proxy/http";
import getServiceWidget from "utils/config/service-helpers";
import createLogger from "utils/logger";

const logger = createLogger("qbittorrentProxyHandler");

export default async function unraidProxyHandler(req, res) {
  const { group, service, endpoint } = req.query;
  console.log("group:", group);
  console.log("service:", service);
  console.log("endpoint:", endpoint);

  if (!group || !service) {
    logger.debug("Invalid or missing service '%s' or group '%s'", service, group);
    return res.status(400).json({ error: "Invalid proxy service type" });
  }

  const widget = await getServiceWidget(group, service);

  if (!widget) {
    logger.debug("Invalid or missing widget for service '%s' in group '%s'", service, group);
    return res.status(400).json({ error: "Invalid proxy service type" });
  }

  const url = new URL(formatApiCall("{url}/api/{endpoint}", { endpoint, ...widget }));
  const params = { method: "GET", headers: {} };
  let [status, _, data] = await httpProxy(url, params);

  if (status !== 200) {
    logger.error("HTTP %d getting data from unraid.  Data: %s", status, data);
  }
  return res.status(status).send(data);
}
