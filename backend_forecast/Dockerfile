FROM python:3.10-slim

ENV PIP_DEFAULT_TIMEOUT=100 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 

COPY requirements.txt .

RUN pip install --upgrade pip

RUN pip install -r requirements.txt && \
	rm requirements.txt
	
COPY . /app

WORKDIR /app

RUN chmod +x ./gunicorn_starter.sh

ENTRYPOINT ["./gunicorn_starter.sh"]