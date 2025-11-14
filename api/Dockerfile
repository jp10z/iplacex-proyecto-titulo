FROM python:3.12-slim AS build
WORKDIR /app
RUN pip install gunicorn==21.2.0
COPY requirements-freeze.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["gunicorn", "-b", "0.0.0.0:8080", "app:app", "--timeout", "120"]