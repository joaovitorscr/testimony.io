(() => {
  const widgetDiv = document.getElementById("testimonial-widget");
  if (!widgetDiv) {
    console.error("Testimonial widget placeholder not found.");
    return;
  }

  const widgetId = widgetDiv.dataset.widgetId;
  if (!widgetId) {
    console.error("Testimonial widget ID not found.");
    return;
  }

  const embedDomain = window.location.origin;

  const input = { json: { widgetId, domain: embedDomain } };
  const apiUrl = `http://localhost:3000/api/trpc/widget.getWidgetContent?input=${encodeURIComponent(JSON.stringify(input))}`;

  fetch(apiUrl)
    .then(async (response) => {
      if (!response.ok) {
        // Handle network errors or non-2xx responses
        return response.json().then((err) => Promise.reject(err));
      }

      return response.json().then((data) => data.result.data.json);
    })
    .then((data) => {
      if (data?.html) {
        widgetDiv.innerHTML = data.html;
      } else {
        console.error("Unexpected tRPC response structure");
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
            `tRPC Error: ${trpcError.data?.code} - ${trpcError.message}`
          );
          widgetDiv.innerHTML = "<p>Failed to load widget due to an error.</p>";
        }
      } else {
        widgetDiv.innerHTML = "<p>Failed to load widget.</p>";
      }
    });
})();
