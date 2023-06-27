# Build Stage
FROM node:18 AS build
WORKDIR /src/
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Test Stage
FROM build AS test
WORKDIR /src/
RUN npm ci
COPY . .
CMD ["npm", "test"]

# Run Stage
FROM node:18 AS run
WORKDIR /app
COPY --from=build /src/ .
EXPOSE 8800
CMD ["node", "src/index.js"]

