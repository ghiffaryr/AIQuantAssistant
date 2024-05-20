from pathlib import Path
import yaml


class Config:
    def get():
        file = open(Path.cwd() / 'src/resources/config.yml', 'r')
        config = yaml.safe_load(file)
        return config