import React from "react";
import Subscription from "./Subscription";

export default function SubscriptionList({
  subscriptions,
  getSubscriptions,
  setSubscriptions,
}) {
  return (
    <>
      <div className="container mt-3 mb-3">
        <div
          className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4
        "
          id="subscriptions-row"
        >
          {subscriptions.map((subscription, idx) => (
            <Subscription
              key={idx}
              id={subscription.subscriptionId}
              productCategoryCode={subscription.productCategoryCode}
              userEmail={subscription.userEmail}
              expTime={subscription.expTime}
              getSubscriptions={getSubscriptions}
              setSubscriptions={setSubscriptions}
            />
          ))}
        </div>
      </div>
    </>
  );
}
