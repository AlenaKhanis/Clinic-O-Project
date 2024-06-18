
FROM python:3.11-alpine

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

ENV FLASK_DEBUG 0
ENV FLASK_ENV production

ENV GUNICORN_HOST 0.0.0.0
ENV GUNICORN_PORT 8080
ENV GUNICORN_WORKERS 4
ENV GUNICORN_CMD_ARGS "--bind=${GUNICORN_HOST}:${GUNICORN_PORT} --workers=${GUNICORN_WORKERS}"

COPY . /app

EXPOSE ${GUNICORN_PORT}

CMD [ "gunicorn", "main:app" ]