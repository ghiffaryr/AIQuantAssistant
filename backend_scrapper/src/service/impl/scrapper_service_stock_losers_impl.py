from service.scrapper_service import ScrapperService
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import WebDriverException
import time
import json
import pandas as pd


class ScrapperServiceStockLosersImpl(ScrapperService):
    def __init__(self) -> None:
        self._driver = None
        self.result = json.dumps({})

    def initialize(self, 
                   window_size: tuple = (1920,1200)) -> None:
        try:
            options = webdriver.ChromeOptions()
            options.add_argument("--verbose")
            options.add_argument('--no-sandbox')
            options.add_argument('--headless')
            options.add_argument('--disable-gpu')
            options.add_argument(f"--window-size={str(window_size)[1:-1]}")
            options.add_argument('--disable-dev-shm-usage')
            driver = webdriver.Chrome(
            options=options
            )
            self._driver = driver
        except WebDriverException as e:
            print(f"WebDriverException: {e}")
            time.sleep(5)  # Wait before retrying
            self.initialize(window_size=window_size)

    def configure(self) -> None:
        url = f"https://finance.yahoo.com/losers/"
        # Disable Bot
        self._driver.execute_cdp_cmd('Network.setUserAgentOverride', {"userAgent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.53 Safari/537.36'})
        self._driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        self._driver.get(url)

    def retrieve(self) -> None:
        # Wait until the table is present
        table = WebDriverWait(self._driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "table"))
        )

        # Find the table element
        table = self._driver.find_element(By.TAG_NAME, "table")

        # Find all rows in the table
        rows = table.find_elements(By.TAG_NAME, "tr")

        # Check if first row contains headers
        header_row = rows[0].find_elements(By.TAG_NAME, "th")
        if header_row:
            headers = [header.text for header in header_row]
            rows = rows[1:]  # Skip header row for data extraction

        # Iterate over rows and extract data
        table_data = []
        for row in rows:
            # Get all columns in this row
            cols = row.find_elements(By.TAG_NAME, "td")
            row_data = [col.text for col in cols]
            # Append row data to table_data
            table_data.append(row_data)

        # Convert to DataFrame with headers if available
        if headers:
            df = pd.DataFrame(table_data, columns=headers)
        else:
            df = pd.DataFrame(table_data)
        result = df.to_dict('index')
        self.result = result
        return result
    
    def end(self) -> None:
        if self._driver:
            self._driver.close()
            del self._driver
