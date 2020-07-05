#Specify a base image
FROM node:alpine

#Specify a working directory in the container
WORKDIR /usr/app

#Copy the dependencies file
COPY ./package.json ./

#Install dependencies
RUN npm install

#Copy remaining files
COPY ./ ./

#Default command
CMD ["npm","start"]
