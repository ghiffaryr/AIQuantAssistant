import Inference from './Inference';
import { SubscriptionType } from '@/type/SubscriptionType';

const InferenceList = ({ subscriptions }: InferenceListProps) => {
  return (
    <>
      <div className="container mb-3">
        <div
          className="row row-cols-1 g-4
        "
          id="subscriptions-row"
        >
          {subscriptions.map((subscription, idx) => (
            <Inference
              key={idx}
              productCategoryCode={subscription.productCategoryCode}
              expTime={subscription.expTime}
            />
          ))}
        </div>
      </div>
    </>
  );
};

type InferenceListProps = {
  subscriptions: SubscriptionType[];
};

export default InferenceList;
