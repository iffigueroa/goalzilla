FROM python:3-alpine3.15
WORKDIR /app

COPY *.py requirements.txt /app/

RUN pip install -r requirements.txt

EXPOSE 5000
CMD python3 server.py
