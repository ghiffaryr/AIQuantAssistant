import HeaderTitleComponent from '../../../components/basic/HeaderTitleComponent';
import { Container } from 'react-bootstrap';
import HeadlineCard from '../../../components/sentiment-analysis/HeadlineCard';
import SentimentEnum from '../../../enums/SentimentEnum';
import newsData from '../../../data/news.json';

export default function NarrativeSummary() {
  return (
    <>
      <>
        <HeaderTitleComponent title={'Narrative Summary'} divider={true} />
        <Container>
          <div>
            <p className="fw-bold">Overall news sentiment: </p>
            <p>
              The Nasdaq Composite crossed the 17,000 mark for the first time
              last week . Today, we are witnessing another tech boom, with the
              daily advancement of generative AI fueling the rise of companies
              such as Nvidia . Guru David Einhorn (Trades, Portfolio) recently
              disclosed that his hedge fund, Greenlight Capital, purchased a
              stake in HP Inc. (NYSE:HPQ) shares traded for an average price of
              $30.76 . The investor noted the company stands to benefit from an
              artificial intelligence-driven upgrade cycle .
            </p>
          </div>
          {Array.from(Array(5).keys())
            .reduce((prev, val) => [...prev, newsData[val].texts], [])
            .map((val, index) => (
              <HeadlineCard
                key={index}
                title={`Headline ${index + 1}`}
                content={val}
                elapsedTime={index}
                status={SentimentEnum.POSITIVE}
                className="mb-3"
              />
            ))}
        </Container>
      </>
    </>
  );
}
