import type { WidgetSettings, WidgetTestimonial } from "./types";
import { WidgetCard } from "./widget-card";

/** The embeddable list or grid of testimonial cards. */
export function TestimonialWidget({
  testimonies,
  widgetConfig,
}: {
  testimonies: WidgetTestimonial[];
  widgetConfig: WidgetSettings;
}) {
  const isGridLayout = widgetConfig.displayLayout === "grid";

  return (
    <div
      style={{
        padding: "1rem",
        display: isGridLayout ? "grid" : "flex",
        flexDirection: isGridLayout ? undefined : "column",
        gridTemplateColumns: isGridLayout
          ? `repeat(${widgetConfig.gridColumns}, minmax(0, 1fr))`
          : undefined,
        gap: `${widgetConfig.gridGap}px`,
        overflowY: "auto",
        height: "fit-content",
        width: "100%",
        flex: 1,
      }}
    >
      {testimonies.map((testimony) => (
        <WidgetCard key={testimony._id} testimony={testimony} widgetConfig={widgetConfig} />
      ))}
    </div>
  );
}
