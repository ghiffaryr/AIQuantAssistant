import HeaderTitleComponent from '@/components/commons/HeaderTitleComponent';
import HeadlineCard from '@/components/commons/HeadlineCard';
import TextWithStatusColor from '@/components/commons/TextWithStatusColor';
import SentimentEnum from '@/enums/SentimentEnum';
import useBoundStore from '@/store/store';
import { Loader } from '@mantine/core';
import { useMemo } from 'react';
import { Container } from 'react-bootstrap';
import useSentiment from '@/hooks/useSentiment';

export default function SentimentAnalysisPage() {
  const stockCode = useBoundStore.use.stockCode();

  const news = [
    "'BRUSSELS, May 16 (Reuters) - Meta Platforms' social media sites Facebook and Instagram will be investigated for potential breaches of EU online content rules relating to child safety, EU regulators said on Thursday, a move that could lead to hefty fines. Tech companies are required to do more to tackle illegal and harmful content on their platforms under the European Union's landmark Digital Services Act (DSA), which kicked in last year. The European Commission said it had decided to open an in-depth investigation into Facebook and Instagram due to concerns they had not adequately addressed risks to children. Meta submitted a risk assessment report in September.'",
  ];

  const { isLoading, overallSentiment, results } = useSentiment(news);

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
                  status={overallSentiment}
                >
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
