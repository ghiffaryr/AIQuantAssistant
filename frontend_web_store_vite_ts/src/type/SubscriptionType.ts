type SubscriptionResponseType = {
  content: SubscriptionType[];
  totalPages?: number;
};

type SubscriptionType = {
  expTime?: string;
  productCategoryCode?: string;
  subscriptionId?: number;
  userEmail?: string;
};

export type { SubscriptionResponseType, SubscriptionType };
