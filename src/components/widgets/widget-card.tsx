import type { WidgetSettings, WidgetTestimonial } from "./types";
import { WidgetAvatar } from "./widget-avatar";

const STARS = [1, 2, 3, 4, 5];

const visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;

function StarIcon({
  filled,
  fillColor,
  strokeColor,
}: {
  filled: boolean;
  fillColor: string;
  strokeColor: string;
}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? fillColor : "none"}
      stroke={filled ? fillColor : strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/** One testimonial, styled entirely inline so it renders the same anywhere. */
export function WidgetCard({
  testimony,
  widgetConfig,
}: {
  testimony: WidgetTestimonial;
  widgetConfig: WidgetSettings;
}) {
  const { rating } = testimony;
  const subtitle = [testimony.customerTitle, testimony.customerCompany]
    .filter((part) => part !== undefined && part !== "")
    .join(" at ");

  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: widgetConfig.backgroundColor,
        borderRadius: "12px",
        border: `1px solid color-mix(in srgb, ${widgetConfig.textColor} 10%, transparent)`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {widgetConfig.showRating && rating !== undefined && (
        <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
          <span style={visuallyHidden}>Rated {rating} out of 5</span>
          {STARS.map((star) => (
            <StarIcon
              key={star}
              filled={star <= rating}
              fillColor={widgetConfig.primaryColor}
              strokeColor={`color-mix(in srgb, ${widgetConfig.textColor} 30%, transparent)`}
            />
          ))}
        </div>
      )}

      <p
        style={{
          margin: "0 0 16px 0",
          fontSize: "14px",
          lineHeight: "1.6",
          color: widgetConfig.textColor,
        }}
      >
        &ldquo;{testimony.text}&rdquo;
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "auto" }}>
        {widgetConfig.showAvatar && (
          <WidgetAvatar
            name={testimony.customerName}
            url={testimony.avatarUrl}
            color={widgetConfig.primaryColor}
          />
        )}
        <div>
          <div style={{ fontWeight: 600, fontSize: "14px", color: widgetConfig.textColor }}>
            {testimony.customerName}
          </div>
          {subtitle !== "" && (
            <div
              style={{
                fontSize: "12px",
                color: `color-mix(in srgb, ${widgetConfig.textColor} 60%, transparent)`,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
