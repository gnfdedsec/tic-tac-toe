# Tic Tac Toe Game

A modern implementation of the classic Tic Tac Toe game.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [pnpm](https://pnpm.io/) (version 8 or higher)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

## Installation

Install project dependencies using pnpm:

```bash
pnpm install
```

## Development

To run the project in development mode with hot-reload:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Production

To run the project in production mode:

```bash
pnpm start
```

## Docker Support

### Building the Docker Image

To build the Docker image:

```bash
docker build -t tic-tac-toe .
```

### Running the Container

To run the application in a Docker container:

```bash
docker run -d -p 3000:3000 tic-tac-toe
```

The application will be accessible at `http://localhost:3000`

## Contributing

If you'd like to contribute, please fork the repository and create a pull request. You can also open an issue for any bugs or feature requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
