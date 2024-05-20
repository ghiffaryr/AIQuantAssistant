from service.scrapper_service import ScrapperService
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import json


class ScrapperServiceStockAnalysisImpl(ScrapperService):
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
        url = f"https://finance.yahoo.com/quote/{stock_code}/analysis"
        # Disable Bot
        self._driver.execute_cdp_cmd('Network.setUserAgentOverride', {"userAgent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.53 Safari/537.36'})
        self._driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        self._driver.get(url)

    def retrieve(self) -> None:
        eps_section = WebDriverWait(self._driver, 300).until(EC.visibility_of_element_located((By.CSS_SELECTOR, "section[data-testid='earningsHistory']")))
        eps_table = eps_section.find_element(By.CLASS_NAME, "svelte-17yshpm").text.split('\n')
        date_list = eps_table[0].split(' ')[3:]
        eps_actual_list = eps_table[2].split(' ')[2:]
        result = {
            "date_list": date_list,
            "eps_actual_list": eps_actual_list,
        }
        self.result = result
        return result
    
    def end(self) -> None:
        if self._driver:
            self._driver.close()
            del self._driver
