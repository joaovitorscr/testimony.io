import type React from "react";
import type {
  Testimonial,
  WidgetConfig,
} from "../../../generated/prisma/client";
import { WidgetCard } from "./widget-card";

interface TestimonialWidgetProps {
  testimonies: Testimonial[];
  widgetConfig: WidgetConfig;
}

const TestimonialWidget: React.FC<TestimonialWidgetProps> = ({
  testimonies,
  widgetConfig,
}) => {
  if (!testimonies || testimonies.length === 0) {
    return <div className="no-testimonies">No testimonies yet.</div>;
  }

  console.log("Testimonies:", testimonies);
  console.log("Widget Config:", widgetConfig);

  const isGridLayout = widgetConfig.displayLayout === "grid";

  return (
    <div
      className="testimonial-widget-container"
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
        <WidgetCard
          key={testimony.id}
          testimony={testimony}
          widgetConfig={widgetConfig}
        />
      ))}
    </div>
  );
};

export default TestimonialWidget;
