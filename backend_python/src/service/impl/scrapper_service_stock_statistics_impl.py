# from service.scrapper_service import ScrapperService
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import json


class ScrapperServiceStockStatisticsImpl():
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
        url = f"https://finance.yahoo.com/quote/{stock_code}/key-statistics"
        # Disable Bot
        self._driver.execute_cdp_cmd('Network.setUserAgentOverride', {"userAgent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.53 Safari/537.36'})
        self._driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        self._driver.get(url)

    def retrieve(self) -> None:
        valuation_measure_table = WebDriverWait(self._driver, 300).until(EC.visibility_of_element_located((By.CLASS_NAME, "svelte-104jbnt"))).text.split('\n')
        date_list = valuation_measure_table[1].split(' ')
        market_cap_list = valuation_measure_table[2].split(' ')[2:]
        trailing_pe_list = valuation_measure_table[4].split(' ')[2:]
        price_per_book_list = valuation_measure_table[8].split(' ')[1:]
        financial_highlights_table = WebDriverWait(self._driver, 300).until(EC.visibility_of_element_located((By.CLASS_NAME, "svelte-14j5zka"))).text.split('\n')
        diluted_eps = financial_highlights_table[17].split(' ')[-1]
        avg_volume_3month = financial_highlights_table[39].split(' ')[-1]
        trailing_annual_dividend_yield = financial_highlights_table[55].split(' ')[-1]
        total_debt_to_equity = financial_highlights_table[23].split(' ')[-1]
        one_year_high = financial_highlights_table[34].split(' ')[-1]
        one_year_low = financial_highlights_table[35].split(' ')[-1]
        result = {
            "valuation_measure_table": valuation_measure_table,
            "date_list": date_list,
            "market_cap_list": market_cap_list,
            "trailing_pe_list": trailing_pe_list,
            "price_per_book_list": price_per_book_list,
            "diluted_eps": diluted_eps,
            "avg_volume_3month": avg_volume_3month,
            "trailing_annual_dividend_yield": trailing_annual_dividend_yield,
            "total_debt_to_equity": total_debt_to_equity,
            "one_year_high": one_year_high,
            "one_year_low": one_year_low
        }
        self.result = result
        return result

    def end(self) -> None:
        if self._driver:
            self._driver.quit()
            del self._driver