FROM mongo:latest

WORKDIR mongo-seed/

COPY . .

RUN ["chmod", "+x", "init.sh"]
CMD ./init.sh
