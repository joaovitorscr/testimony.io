(() => {
  const getQueryParam = (name) => {
    name = name.replace(/[[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  };

  // The placeholder div *inside* the iframe's document
  const widgetDiv = document.getElementById("testimonial-widget");
  if (!widgetDiv) {
    console.error("Testimonial widget placeholder not found inside iframe.");
    return;
  }

  // Get widgetId from URL query parameter
  const widgetId = getQueryParam("widgetId");

  if (!widgetId) {
    console.error("Testimonial widget ID not found in iframe URL.");
    widgetDiv.innerHTML = "<p>Widget ID missing from embed URL.</p>";
    return;
  }

  const embedDomain = window.location.origin; // This will be the origin of the iframe (e.g., http://localhost:3000)

  const input = { json: { widgetId, domain: embedDomain } };
  const apiUrl = `http://localhost:3000/api/trpc/widget.getWidgetContent?input=${encodeURIComponent(
    JSON.stringify(input)
  )}`;

  fetch(apiUrl)
    .then(async (response) => {
      if (!response.ok) {
        return response.json().then((err) => Promise.reject(err));
      }
      return response.json().then((data) => data.result.data.json);
    })
    .then((data) => {
      if (data?.html) {
        widgetDiv.innerHTML = data.html;
      } else {
        console.error("Unexpected tRPC response structure in iframe.");
        widgetDiv.innerHTML = "<p>Failed to load widget content.</p>";
      }
    })
    .catch((error) => {
      if (error?.error?.json) {
        const trpcError = error.error.json;

        if (trpcError.data?.code === "FORBIDDEN") {
          widgetDiv.innerHTML =
            "<p>Widget is not authorized for this domain.</p>";
        } else {
          console.error(
            `tRPC Error in iframe: ${trpcError.data?.code} - ${trpcError.message}`
          );
          widgetDiv.innerHTML = "<p>Failed to load widget due to an error.</p>";
        }
      } else {
        console.error("Failed to load widget in iframe:", error);
        widgetDiv.innerHTML = "<p>Failed to load widget.</p>";
      }
    });
})();
