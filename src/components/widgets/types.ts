export type WidgetSettings = {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  displayLayout: "list" | "grid";
  displayOrder: "newest" | "oldest";
  showRating: boolean;
  showAvatar: boolean;
  gridColumns: number;
  gridGap: number;
};

export type WidgetTestimonial = {
  _id: string;
  customerName: string;
  customerCompany?: string;
  customerTitle?: string;
  rating?: number;
  text: string;
  avatarUrl: string | null;
};
