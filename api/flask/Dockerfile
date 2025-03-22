FROM python:slim

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY ./flask .

# Expose the port Flask runs on
EXPOSE 5000

CMD ["python", "app.py"]