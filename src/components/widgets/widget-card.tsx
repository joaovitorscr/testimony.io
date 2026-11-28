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

function StarIcon({ filled }: { filled: boolean }) {
  const color = filled ? "var(--tm-accent)" : "var(--tm-border)";
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={color}
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/** One testimonial, styled inline from the widget's CSS variables. */
export function WidgetCard({
  testimonial,
  settings,
}: {
  testimonial: WidgetTestimonial;
  settings: WidgetSettings;
}) {
  const { rating } = testimonial;
  const subtitle = [testimonial.customerTitle, testimonial.customerCompany]
    .filter((part) => part !== undefined && part !== "")
    .join(", ");

  return (
    <figure
      style={{
        position: "relative",
        margin: 0,
        padding: "20px",
        backgroundColor: "var(--tm-bg)",
        color: "var(--tm-fg)",
        borderRadius: "8px",
        border: "1px solid var(--tm-border)",
        boxShadow: "0 1px 1px 0 rgb(15 23 42 / 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      {settings.showRating && rating !== undefined && (
        <div style={{ display: "flex", gap: "2px" }}>
          <span style={visuallyHidden}>Rated {rating} out of 5</span>
          {STARS.map((star) => (
            <StarIcon key={star} filled={star <= rating} />
          ))}
        </div>
      )}

      <blockquote
        style={{
          margin: 0,
          fontSize: "14px",
          lineHeight: 1.65,
          overflowWrap: "anywhere",
          whiteSpace: "pre-line",
        }}
      >
        {testimonial.text}
      </blockquote>

      <figcaption
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "auto",
          paddingTop: "14px",
          borderTop: "1px solid var(--tm-border)",
        }}
      >
        {settings.showAvatar && (
          <WidgetAvatar name={testimonial.customerName} url={testimonial.avatarUrl} />
        )}
        <div style={{ minWidth: 0 }}>
          <div
            style={{ fontWeight: 600, fontSize: "13px", lineHeight: 1.4, overflowWrap: "anywhere" }}
          >
            {testimonial.customerName}
          </div>
          {subtitle !== "" && (
            <div
              style={{
                fontSize: "12px",
                lineHeight: 1.4,
                color: "var(--tm-muted)",
                overflowWrap: "anywhere",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
