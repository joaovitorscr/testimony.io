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
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          No testimonies have been collected yet.
        </h3>
        <p
          style={{ fontSize: "1rem", color: "gray", letterSpacing: "-0.025em" }}
        >
          Start collecting on testimonies.io dashboard
        </p>
      </div>
    );
  }

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
