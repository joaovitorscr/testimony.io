import type {
  Testimonial,
  WidgetConfig,
} from "../../../generated/prisma/client";

interface WidgetCardProps {
  testimony: Testimonial;
  widgetConfig: WidgetConfig;
}

function StarIcon({
  filled,
  fillColor,
  strokeColor,
  index,
}: {
  filled: boolean;
  fillColor: string;
  strokeColor: string;
  index: number;
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
      aria-label={`Star ${index + 1}${filled ? " filled" : ""}`}
      role="img"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function WidgetCard({ testimony, widgetConfig }: WidgetCardProps) {
  const initials = testimony.customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const hasAvatar = testimony.customerAvatarUrl;

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
      {/* Rating */}
      {widgetConfig.showRating && testimony.rating && (
        <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={`star-${testimony.id}-${i}`}
              index={i}
              filled={i < (testimony.rating ?? 0)}
              fillColor={widgetConfig.primaryColor}
              strokeColor={`color-mix(in srgb, ${widgetConfig.textColor} 30%, transparent)`}
            />
          ))}
        </div>
      )}

      {/* Testimonial text */}
      <p
        style={{
          margin: "0 0 16px 0",
          fontSize: "14px",
          lineHeight: "1.6",
          color: widgetConfig.textColor,
        }}
      >
        "{testimony.text}"
      </p>

      {/* Author info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginTop: "auto",
        }}
      >
        {widgetConfig.showAvatar && (
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              backgroundColor: widgetConfig.primaryColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {hasAvatar ? (
              // biome-ignore lint: img element is required for widget embeddability in external apps
              <img
                src={testimony.customerAvatarUrl ?? ""}
                alt={testimony.customerName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  // Hide the image and show initials on error
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement("span");
                    fallback.textContent = initials;
                    fallback.style.cssText = `
                      color: #fff;
                      font-size: 12px;
                      font-weight: 600;
                    `;
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <span
                style={{
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {initials}
              </span>
            )}
          </div>
        )}
        <div>
          <div
            style={{
              fontWeight: 600,
              fontSize: "14px",
              color: widgetConfig.textColor,
            }}
          >
            {testimony.customerName}
          </div>
          {(testimony.customerTitle || testimony.customerCompany) && (
            <div
              style={{
                fontSize: "12px",
                color: `color-mix(in srgb, ${widgetConfig.textColor} 60%, transparent)`,
              }}
            >
              {testimony.customerTitle}
              {testimony.customerTitle && testimony.customerCompany && " at "}
              {testimony.customerCompany}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
