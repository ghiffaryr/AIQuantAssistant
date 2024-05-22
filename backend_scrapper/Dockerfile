# Use a lightweight Ubuntu-based image
FROM ubuntu:22.04

# Avoid interactive prompts during package installations
ENV DEBIAN_FRONTEND=noninteractive

# Install ffmpeg and Python
RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y \
    git \
    make \
    build-essential \
    libssl-dev \
    zlib1g-dev \
    libbz2-dev \
    libreadline-dev \
    libsqlite3-dev \
    wget \
    jq \
    unzip \
    curl \
    llvm \
    libncurses5-dev \
    libncursesw5-dev \
    xz-utils \
    tk-dev \
    libffi-dev \
    liblzma-dev \
    && apt-get install -y --no-install-recommends python3.10 \
    && apt-get install -y python3.10-dev \
    && apt-get install -y --no-install-recommends python3-pip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIP_DEFAULT_TIMEOUT 100

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \ 
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
RUN apt-get update && apt-get -y install google-chrome-stable
RUN apt-get install -yqq unzip jq
RUN CHROME_VERSION=$(google-chrome --version | awk '{print $3}') && \
    CHROME_DRIVER_URL=$(curl -sSL "https://googlechromelabs.github.io/chrome-for-testing/known-good-versions-with-downloads.json" | \
    jq -r --arg CHROME_VERSION "$CHROME_VERSION" '.versions[] | select(.version==$CHROME_VERSION) | .downloads.chromedriver[] | select(.platform=="linux64") | .url') && \
    wget -O /tmp/chromedriver.zip $CHROME_DRIVER_URL && \
    unzip /tmp/chromedriver.zip -d /tmp/ && \
    mv /tmp/chromedriver-linux64/chromedriver /usr/local/bin/chromedriver && \
    chmod +x /usr/local/bin/chromedriver && \
    rm /tmp/chromedriver.zip

ENV PIP_DEFAULT_TIMEOUT 100

RUN pip3 install pipenv

RUN set -ex && mkdir /app

WORKDIR /app
COPY ./Pipfile /app/
COPY ./Pipfile.lock /app/
COPY ./src /app/src

RUN pipenv install --deploy --system
RUN pipenv install --deploy

CMD pipenv run uvicorn --app-dir src start_application:StartApplication --host 0.0.0.0 --port 8001 --reload

EXPOSE 8000
