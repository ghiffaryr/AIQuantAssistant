# Use a lightweight Ubuntu-based image
FROM infologistix/docker-selenium-python:3.10

RUN pip3 install pipenv

RUN set -ex && mkdir /app

WORKDIR /app
COPY ./Pipfile /app/
COPY ./Pipfile.lock /app/
COPY ./src /app/src
COPY ./tmp /app/tmp

RUN pipenv install --deploy --system
RUN pipenv install --deploy

CMD pipenv run uvicorn --app-dir src start_application:StartApplication --host 0.0.0.0 --port 8001 --reload

EXPOSE 8000
