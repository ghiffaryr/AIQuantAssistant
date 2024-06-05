import React from 'react';
import Subscription from './Subscription';

export default function SubscriptionList({ subscriptions, setSubscriptions }) {
  return (
    <>
      <div className="container mb-3">
        <div
          className="row row-cols-1 g-4
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
              setSubscriptions={setSubscriptions}
            />
          ))}
        </div>
      </div>
    </>
  );
}
