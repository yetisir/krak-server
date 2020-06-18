FROM python:3.6-buster

WORKDIR /app
COPY requirements.txt /app/
RUN pip install -r requirements.txt

EXPOSE 8888

CMD ["wssh", "--xsrf=false", "--origin=primary"]