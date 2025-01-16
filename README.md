# SDN302 Project - Backend

## Table of contents

1. [Authors](#1-authors)
2. [Introduction](#2-introduction)
3. [Pre-requisites](#3-pre-requisites)
4. [Project setup](#4-project-setup)
5. [License](#5-license)

## 1. Authors

This project is developed by Group 2, class SE1831-NJ of the SDN302 (Server-Side development with NodeJS, Express, and MongoDB) subject at FPT University. The group members are:

- Hồ Anh Dũng - HE181529 ([@dung204](https://github.com/dung204))
- Hoàng Gia Trọng - HE172557 ([@tronghghe172557](https://github.com/tronghghe172557))
- Vũ Lương Bảo - HE172612 ([@Baovu2003](https://github.com/Baovu2003))
- Nguyễn Ngọc Anh - HE176642 ([@anhnnhe176642](https://github.com/anhnnhe176642))
- Nguyễn Hữu Tâm - HE187049 ([@Gentle226](https://github.com/Gentle226))

## 2. Introduction

<!-- TODO: Project introduction here -->

## 3. Pre-requisites

You need to install all of these before continuing:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/): Latest LTS version (22.13.0) is recommended.
- [pnpm](https://pnpm.io/): The package manager that replaces `npm`.
- [Docker](https://www.docker.com/): To setup databases, and bundle the application as a container.
- [MongoDB](https://www.mongodb.com/): The database system used in this project, set this up with Docker is recommended.
- [MongoDB Compass](https://www.mongodb.com/products/compass): The GUI for MongoDB, to work with the database.

## 4. Project setup

1. Clone the repository:

```bash
git clone https://github.com/dung204/sdn302-se1831-nj-group-2-backend.git
```

2. Install dependencies:

```bash
pnpm install --frozen-lockfile
```

> ⚠️ **Note**: The `--frozen-lockfile` is required, since this helps to ensure the `pnpm-lock.yaml` file is not modified during the installation process.

3. Setup the environment variables: Create the `.env` file in the root directory of the project, copy the content from `.env.example` to it, and fill in the values.

> You can also create a `.env.local` file to override the values in the `.env` file. The difference between the two files is that `.env` file will be used in the Docker container, while `.env.local` will be used in the local development environment.

4. Start the development server:

```bash
pnpm start:dev
```

5. The server should be running at `http://localhost:<APP_PORT>`, where `APP_PORT` is the port defined in the `.env` (`.env.local`) file.

6. In order to run the server in production mode with Docker, you can use the following command:

```bash
docker compose up -d
```

> ⚠️ **Note**: Make sure the `.env` file is present in the root directory of the project before running this command.

## 5. License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
