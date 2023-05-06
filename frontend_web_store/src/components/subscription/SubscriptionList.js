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
              id={subscription.productCategoryId}
              code={subscription.productCategoryCode}
              name={subscription.productCategoryName}
              description={subscription.productCategoryDescription}
              image={subscription.productCategoryImage}
              createTime={subscription.createTime}
              updateTime={subscription.updateTime}
              getSubscriptions={getSubscriptions}
              setSubscriptions={setSubscriptions}
            />
          ))}
        </div>
      </div>
    </>
  );
}
