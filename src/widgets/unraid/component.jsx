import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";


export default function Component({ service }) {

  const { widget } = service;

  const { data: torrentData, error: torrentError } = useWidgetAPI(widget, "vms");

  if (torrentError) {
    return <Container service={service} error={torrentError} />;
  }

  if (!torrentData) {
    return (
      <Container service={service}>
      </Container>
    );
  } else {
    return (
      <Container service={service}>
        {torrentData.map((item) =>
          <Block
            label={item.status}
            value={<a
                     href={service.href + "/api/vms/" + item.uuid + "/" + (item.status === "OFFLINE" ? "start" : "stop")}
                     target="_blank">{item.name}</a>}
            key={item.uuid}
          />
        )}
      </Container>
    );
  }
}
