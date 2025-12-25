import type React from "react";
import type {
  Testimonial,
  WidgetConfig,
} from "../../../generated/prisma/client";

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

  return (
    <div className="testimonial-widget-container">
      {testimonies.map((testimony) => (
        <div
          key={testimony.id}
          style={{
            margin: "0 0 15px 0",
            padding: "10px 15px",
            borderLeft: "4px solid #007bff",
            backgroundColor: "#f9f9f9",
            borderRadius: "4px",
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
      ))}
    </div>
  );
};

export default TestimonialWidget;
