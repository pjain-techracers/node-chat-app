#Specify a base image
FROM node:alpine

#Specify a working directory in the container
WORKDIR /usr/app
#Copy the project
COPY ./ ./

#Install dependencies
RUN npm install

#Default command
CMD ["npm","start"]
