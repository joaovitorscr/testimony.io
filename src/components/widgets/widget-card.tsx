import type {
  Testimonial,
  WidgetConfig,
} from "../../../generated/prisma/client";

interface WidgetCardProps {
  testimony: Testimonial;
  widgetConfig: WidgetConfig;
}

export function WidgetCard({ testimony, widgetConfig }: WidgetCardProps) {
  return (
    <div
      style={{
        margin: "0 0 15px 0",
        padding: "10px 15px",
        borderLeft: `4px solid ${widgetConfig.primaryColor}`,
        backgroundColor: widgetConfig.backgroundColor,
        borderRadius: "var(--radius-lg)",
      }}
    >
      <p
        style={{
          marginBlockStart: 0,
          marginBlockEnd: "5px",
          fontStyle: "italic",
          color: widgetConfig.textColor,
        }}
      >
        "{testimony.text}"
      </p>
      <footer style={{ fontSize: "0.9em", color: "#777" }}>
        — {testimony.customerName}{" "}
        {testimony.customerTitle && `, ${testimony.customerTitle}`}{" "}
        {testimony.customerCompany && `, ${testimony.customerCompany}`}
      </footer>
    </div>
  );
}
