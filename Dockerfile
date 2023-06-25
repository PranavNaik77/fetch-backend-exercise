FROM node:18

#Working Dir
WORKDIR /src/

#Copy Package Json File
COPY package*.json ./

#Install Files
RUN npm install

#Copy Source Files
COPY . .

#Build
RUN npm run build

#Expose the API Port
EXPOSE 8800

CMD [ "node", "src/index.js" ]
