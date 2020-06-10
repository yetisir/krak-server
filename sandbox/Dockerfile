FROM linuxserver/openssh-server

python:3.6-buster

WORKDIR /app
COPY requirements.txt /app/
RUN pip install -r requirements.txt

COPY main.py /app/

# # when using docker-compose, this command can be overwritten
# CMD ["python", "main.py"]