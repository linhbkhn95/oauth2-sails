
FROM node:8.11.4

# RUN npm install -g sails grunt npm-check-updates

# COPY ./package.json /package.json
# RUN npm install

# COPY ./startProd.sh /startProd.sh
# RUN sed -i 's/\r//' /startProd.sh
# RUN chmod +x /startProd.sh

# COPY ./start.sh /start-dev.sh
# RUN sed -i 's/\r//' /start-dev.sh
# RUN chmod +x /start-dev.sh

# WORKDIR /app
# EXPOSE 1338

# ENTRYPOINT ["./startProd.sh"]


WORKDIR /app
COPY . ./
RUN yarn
EXPOSE 1347
# RUN node app --prod
# CMD [ "node", "app","--prod" ]

# run docker with docker-compose  docker-compose up -d --build




#  docker build -t sample-app .
#docker run -it \-v ${PWD}:/usr/src/app \ -v /usr/src/app/node_modules \-p 3000:3000 \ --rm \ sample-app
