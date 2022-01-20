FROM ubuntu:latest

WORKDIR /proxy/

RUN apt-get update \
    && apt-get install -y wget sudo \
    && wget https://dl.minio.io/server/minio/release/linux-amd64/minio

RUN mkdir /data

COPY ./proxy/ /proxy/

RUN chmod +x minio

ENV MINIO_ROOT_USER=minio
ENV MINIO_ROOT_PASSWORD=minio123

EXPOSE 9000:9000

CMD ["sudo", "./minio",  "server", "/data"]