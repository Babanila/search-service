# Search-Service

### Overview of Search-Service

The Search-Service provides a single API endpoint to search for
GitHub users by specifying a programming language they use in their public repositories and a
username string.

### Modules

The Search-Service combines different npm modules for it to work normally:

- Nodejs
- Express
- Got
- Jest

### Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Usage](#usage)
- [Docker](#docker)

## Features

Search-Service is a backend service with a single API endpoint that return git users with the below properties:-

- Username
- Name
- Avatar URL
- Number of followers

## Requirements

- Install git, node, npm.
- Download Code Editor of your choice (VSCode recommended).
- Clone the repo ( [link](https://github.com/Babanila/search-service.git) or use `git clone git@github.com:Babanila/search-service.git`).
- Go into root of the cloned directory and run `npm install`.
- Open the editor (VSCode) and locate the downloaded directory to start developing (or with `code .` in the project director on your terminal).

## How To Start The Server From The Root Directory

- To start the server, from the root directory run `npm run start` or `node server.js`.
- Open web browser and goto`http://localhost:8080/get-users`

## Usage

- Goto `http://localhost:8080/get-users`

- Add query parameters, username and language (must be supplied).

  `E.g - http://localhost:8080/get-users?username=adam&language=javascript`

  `- http://localhost:8080/get-users?username=john&language=java,go`

- Press enter button.

## Test

- From the root directory run `npm run test`.

## For Docker Usage

### Login to Docker

- Install docker on your system([Docker link](https://www.docker.com/products/docker-desktop)).

- Create docker account ([Create docker account](https://hub.docker.com/)).

- Login to docker.

- Then the below docker commands can be carried out.

### To create docker image

- docker build -t <docker_username>/node-search-app .

  E.g `docker build -t babanila/node-search-app .`

### To push the docker image to personal account

- docker push <docker_username>/node-search-app

  E.g `docker push babanila/node-search-app:latest`

### To run docker image in container

- docker run --publish 3000:8080 --detach --name <container name> <image name>

  E.g `docker run --publish 3000:8080 --detach --name test1 <docker_username>/node-search-app:latest`

### Test the connection

- Add the query parameters `(username and language)` to the url `localhost:3000/get-users`

  E.g `curl -i localhost:3000/get-users?username=babanila&language=javascript`
