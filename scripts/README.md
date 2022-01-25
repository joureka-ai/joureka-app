# joureka - Mit mehr Muße vom Interview zum Artikel

# Wireframes for Prototype Fund application
The following wireframes relates to the Prototype Fund application "joureka - Mit mehr Muße vom Interview zum Artikel".
The first wireframe depicts a view on a Sammlung and the second a view on a Aufnahme. Both wireframes were created by
Ana-Maria Tomi and will be as well realised, from a frontend perspective, by Ana-Maria Tomi.
![Wireframe of View on Sammlung](Wireframe_-_View_of_Sammlung.png)

![Wireframe of View on Aufnahme](Wireframe_-_View_of_Aufnaehme.png)

### Table of Contents

1. [Requirements](#requirements)
2. [Dev setup](#dev-setup)

   2.1. [Starting the backend](#starting-the-backend)

   2.2. [Starting the frontend in development mode](#starting-the-frontend-in-development-mode)

   2.3. [Development URLs](#development-urls)

   2.4. [Development frontend proxy](#development-frontend-proxy)

3. [General docker compose setup](#general-docker-compose-setup)

   3.1. [Files and env vars](#files-and-env-vars)

   3.2. [The .env file](#the-.env-file)

4. [Production URLs](#production-urls)
5. [Programming Ethics](#programming-ethics)

## Requirements

The needed tools are:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Pre-Commit](https://pre-commit.com/)

The used docker images are:

- PostgreSQL - as data warehouse
- Traefik - as proxy server
- Frontend - own build React App
- Backend - own build REST API

The use of FAST API and PostgreSQL result from this [base template](https://github.com/tiangolo/full-stack-fastapi-postgresql)

# Dev Setup

There is a detailed documentation in the _frontend_ and _backend_ folder.

### Development URLs

Development URLs, for local development:

- Frontend: `http://localhost:3000`

- Backend: `http://localhost:8889`

- API documentation: `http://localhost:8889/docs`

- Traefik UI: `http://localhost:8090`

### Starting the backend

Start the backend stack with Docker Compose silently:

```bash
docker-compose up -d
```

If you want to see the logging of the build process:

```bash
docker-compose up
```

Now you can open your browser and interact with these URLs:

- Backend server: http://localhost:8888
- API documentation: http://localhost:8888/docs

### Starting the frontend in development mode

Enter the `frontend` directory, install the NPM packages and start
the live server using the `npm` scripts:

```bash
 cd frontend npm install npm run dev
```

Go to http://localhost:3000

Notice that this live server is not running inside Docker, it is for
local development, and that is the recommended workflow. Once you are
happy with your frontend, you can build the frontend Docker image and
start it, to test it in a production-like environment. But compiling
the image at every change will not be as productive as running the
local development server with live reload.

Check the file `package.json` to see other available options.

### Development frontend proxy

In development mode, the frontend also acts as a proxy to the backend
servers. Since allows us to not worry about CORS for the moment, since
we can always point to the frontend urls.

The following proxies are in place.

- Paths `http://localhost:3000/backend/<path>` will be forwarded
  to the backend path `<path>`.

- Paths `http://localhost:3000/api/<path>` will be forwarded to backend
  `api/<path>`, i.e. without rewriting.

Test the proxy e.g. by viewing the api docs on
`http://localhost:3000/backend/docs` (mapping to
`http://localhost:8888/docs`).

In the normal setup, traefik serves as proxy to all these backend
services.

## General docker compose setup

### Docker Compose files and env vars

There is a main `docker-compose.yml` file with all the configurations
that apply to the whole stack, it is used automatically by
`docker-compose`.

And there's also a `docker-compose.override.yml` with overrides for
development, for example to mount the source code as a volume. It is
used automatically by `docker-compose` to apply overrides on top of
`docker-compose.yml`.

These Docker Compose files use the `.env` file containing
configurations to be injected as environment variables in the
containers.

They also use some additional configurations taken from environment
variables set in the scripts before calling the `docker-compose`
command.

It is all designed to support several "stages", like:

- development,
- building,
- testing,
- and deployment.

Also, allowing the deployment to
different environments like staging and production (and you can add
more environments very easily).

They are designed to have the minimum repetition of code and
configurations, so that if you need to change something, you have to
change it in the minimum amount of places. That's why files use
environment variables that get auto-expanded. That way, if for
example, you want to use a different domain, you can call the
`docker-compose` command with a different `DOMAIN` environment
variable instead of having to change the domain in several places
inside the Docker Compose files.

Also, if you want to have another deployment environment, say
`preprod`, you just have to change environment variables, but you can
keep using the same Docker Compose files.

### The .env file

The `.env` file is the one that contains all your configurations,
generated keys and passwords, etc.

Depending on your workflow, you could want to exclude it from Git, for
example if your project is public. In that case, you would have to
make sure to set up a way for your CI tools to obtain it while
building or deploying your project.

One way to do it could be to add each environment variable to your
CI/CD system, and updating the `docker-compose.yml` file to read that
specific env var instead of reading the `.env` file.

## Production URLs (future work)

These are the URLs that will be used and generated by the project.

Production URLs, from the branch `production`.

- Frontend: https://open.aureka.ai

- Backend: https://open.aureka.ai/api/

- Automatic Interactive Docs (Swagger UI): https://open.aureka.ai/docs

- Automatic Alternative Docs (ReDoc): https://open.aureka.ai/redoc

This is so far not supported:

- PGAdmin: https://pgadmin.open.aureka.ai
- Flower: https://flower.soundquest.com

## Programming Ethics

Our programming ethics follow the [Twelver-Factor App](https://12factor.net/) idea.
