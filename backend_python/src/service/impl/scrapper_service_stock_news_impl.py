from service.scrapper_service import ScrapperService
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
import json
import pandas as pd
import time
import re
from tqdm import tqdm
from datetime import datetime


class ScrapperServiceStockNewsImpl(ScrapperService):
    def __init__(self) -> None:
        self._driver = None
        self.result = json.dumps({})

    def initialize(self, 
                   window_size: tuple = (1920,1200)) -> None:
        options = webdriver.ChromeOptions()
        options.add_argument("--verbose")
        options.add_argument('--no-sandbox')
        options.add_argument('--headless')
        # options.add_argument('--disable-gpu')
        options.add_argument(f"--window-size={str(window_size)[1:-1]}")
        # options.add_argument('--disable-dev-shm-usage')
        driver = webdriver.Chrome(
        options=options
        )
        self._driver = driver

    def configure(self, stock_code) -> None:
        url = f"https://finance.yahoo.com/quote/{stock_code}/news"
        # Disable Bot
        self._driver.execute_cdp_cmd('Network.setUserAgentOverride', {"userAgent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.53 Safari/537.36'})
        self._driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        self._driver.get(url)

    def _get_elements(self, driver):
        return driver.find_elements(By.CLASS_NAME, 'stream-item')

    def _get_source(self, snippet):
        return snippet.split('\n')[2]

    def _is_valid_source(self, snippet):
        return 'Ad' not in snippet.split('\n') and 'PREMIUM' not in snippet.split('\n')

    def _scrape_news(self, driver):
        seen_elements = []
        source = []
        i = 0

        pbar = tqdm()
        while True:
            elements = self._get_elements(driver)
            total_elements = len(elements)

            new_elements = [element for element in elements if element not in seen_elements]

            if len(new_elements) == 0:
                break

            for element in new_elements:
                snippet = element.text
                if self._is_valid_source(snippet):
                    i += 1
                    seen_elements.append(element)
                    source.append(self._get_source(snippet))
                    pbar.update(1)

            prev_scroll_height = driver.execute_script("return document.body.scrollHeight;")
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(1)
            new_scroll_height = driver.execute_script("return document.body.scrollHeight;")

            if prev_scroll_height == new_scroll_height:
                break

        pbar.close()
        return source, seen_elements
    
    def _open_new_tab(self, driver, element):
        # Open link in new tab
        element.find_element(By.TAG_NAME, 'a').send_keys(Keys.CONTROL + Keys.RETURN)
        driver.switch_to.window(driver.window_handles[1])
        time.sleep(1)

    def _click_story_continues(self, driver):
        # Click "Story Continues" if it exists
        try:
            read_more_button = driver.find_element(By.CLASS_NAME, 'readmoreButtonText')
            read_more_button.click()
        except NoSuchElementException:
            pass  # Continue scraping if "Story Continues" button is not found

    def _extract_date_writer_article_text(self, driver):
        # Extract article date, writer, and text
        date_writer = driver.find_element(By.CLASS_NAME, 'caas-attr-meta').text
        article_text = "\n\n".join(driver.find_elements(By.CSS_SELECTOR, 'caas-body'))
        paragraph_list = []
        for paragraph in driver.find_elements(By.CSS_SELECTOR, 'p'):
            paragraph_list.append(paragraph.text)
        article_text = "\n\n".join(paragraph_list)
        return date_writer, article_text

    def _close_tab_and_switch_back(self, driver):
        # Close the tab and switch back to the previous tab
        driver.close()
        driver.switch_to.window(driver.window_handles[0])

    def _scrape_seen_elements(self, driver, seen_elements, source, start_index, end_index):
        date_writers = []
        article_texts = []

        with tqdm(total=len(seen_elements[start_index:end_index])) as pbar:
            for element, src in zip(seen_elements[start_index:end_index], source[start_index:end_index]):
                self._open_new_tab(driver, element)
                self._click_story_continues(driver)
                date_writer, article_text = self._extract_date_writer_article_text(driver)

                date_writers.append(date_writer)
                article_texts.append(article_text)

                self._close_tab_and_switch_back(driver)
                pbar.update(1)

        return date_writers, article_texts
    
    def _clean_text(self, text):
        # Remove "Sign in to create a watchlist"
        cleaned_text = text.replace("Sign in to create a watchlist", "")

        # Remove multiple newlines
        cleaned_text = re.sub(r'\n+', '\n', cleaned_text)

        # Remove newlines at the beginning and end of paragraphs
        cleaned_text = re.sub(r'^\n+|\n+$', '', cleaned_text, flags=re.MULTILINE)

        return cleaned_text

    def _extract_writer(self, date_writer):
        return date_writer.split('\n')[0]

    def _extract_time(self, date_writer):
        date_string = date_writer.split('\n')[1].split('M ')[0] + 'M'
        date_string = date_string.replace('Updated ', '')
        date_format = '%a, %b %d, %Y, %I:%M %p'
        return datetime.strptime(date_string, date_format)

    def _process_news_data(self, source, date_writers, article_texts, start_index, end_index):
        dataset_news = pd.DataFrame(
            {
                "source": source[start_index:end_index],
                "date-writer": date_writers,
                "texts": article_texts
            }
        )

        dataset_news['texts'] = dataset_news['texts'].apply(self._clean_text)
        dataset_news['writer'] = dataset_news['date-writer'].apply(self._extract_writer)
        dataset_news['time'] = dataset_news['date-writer'].apply(self._extract_time)
        dataset_news = dataset_news[['source', 'writer', 'time', 'texts']]
        dataset_news['time']=dataset_news['time'].astype(str)
        return dataset_news

    def retrieve(self, 
                 start_index: int = 1, 
                 length: int = 5) -> None:
        end_index = start_index + length
        source, seen_elements = self._scrape_news(self._driver)
        date_writers, article_texts = self._scrape_seen_elements(self._driver, seen_elements, source, start_index, end_index)
        processed_dataset = self._process_news_data(source, date_writers, article_texts, start_index, end_index)
        result = processed_dataset.to_dict('index')
        self.result = result
        return result

    def end(self) -> None:
        if self._driver:
            self._driver.quit()
            del self._driver