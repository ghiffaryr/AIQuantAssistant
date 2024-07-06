import { useInferSentiment } from '@/api/inference';
import HeaderTitleComponent from '@/components/commons/HeaderTitleComponent';
import HeadlineCard from '@/components/commons/HeadlineCard';
import TextWithStatusColor from '@/components/commons/TextWithStatusColor';
import SentimentEnum from '@/enums/SentimentEnum';
import useBoundStore from '@/store/store';
import { MappedType } from '@/utils/type';
import { Loader } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import * as _ from 'lodash';

export default function SentimentAnalysisPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [overallSentiment, setOverallSentiment] = useState(
    SentimentEnum.NEUTRAL,
  );
  const stockCode = useBoundStore.use.stockCode();

  const news = [
    "'BRUSSELS, May 16 (Reuters) - Meta Platforms' social media sites Facebook and Instagram will be investigated for potential breaches of EU online content rules relating to child safety, EU regulators said on Thursday, a move that could lead to hefty fines. Tech companies are required to do more to tackle illegal and harmful content on their platforms under the European Union's landmark Digital Services Act (DSA), which kicked in last year. The European Commission said it had decided to open an in-depth investigation into Facebook and Instagram due to concerns they had not adequately addressed risks to children. Meta submitted a risk assessment report in September.'",
  ];
  const results = useInferSentiment(news);

  useEffect(() => {
    const isSuccess = results.every(val => val.isSuccess);

    if (isSuccess) {
      const sentimentMap: MappedType<string, number> = {};

      results.forEach(val => {
        if (typeof val.data?.data.at(0)?.label != 'undefined') {
          const exist = Object.prototype.hasOwnProperty.call(
            sentimentMap,
            val.data?.data.at(0)?.label as string,
          );

          if (!exist) {
            sentimentMap[val.data?.data.at(0)?.label as string] = 1;
          } else {
            sentimentMap[val.data?.data.at(0)?.label as string] += 1;
          }
        }
      });

      const sorted = _.sortBy(Object.entries(sentimentMap), [([, val]) => val]);
      const [val] = sorted[sorted.length - 1];

      setOverallSentiment(val as SentimentEnum);
      setIsLoading(results.some(val => val.isLoading));
    }
  }, [results]);

  const newsData = useMemo(() => {
    return results.map(val => val.data?.data.at(0));
  }, [results]);

  return (
    <>
      <>
        <HeaderTitleComponent
          title={'Sentiment Analysis'}
          divider={true}
          stockCode={stockCode}
        />
        {isLoading ? (
          <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-screen">
            <Loader size={100} />
            <p className="tw-pt-4 tw-text-[50px]">Retrieving data</p>
          </div>
        ) : (
          <Container>
            <div className="d-flex">
              <div className="flex-grow-1 d-flex">
                <p>Overall news sentiment: </p>
                <TextWithStatusColor
                  className="fw-bold ps-1"
                  status={overallSentiment}>
                  {overallSentiment}
                </TextWithStatusColor>
              </div>
            </div>
            {newsData.map((val, index) => (
              <HeadlineCard
                content={val?.news}
                elapsedTime={1}
                status={val?.label as SentimentEnum}
                key={index}
                title={`Headline ${index}`}
              />
            ))}
          </Container>
        )}
      </>
    </>
  );
}
