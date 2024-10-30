# tic-tac-toe

## การติดตั้ง

pnpm install

## การรันโปรเจค

รันในโหมด development:

pnpm dev

รันในโหมด production:
bash
pnpm start

## การ Build และรัน Docker

### Build Docker Image

docker build -t tic-tac-toe .

### รัน Docker Container

docker run -d -p 3000:3000 tic-tac-toe

