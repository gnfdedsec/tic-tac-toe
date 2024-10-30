# tic-tac-toe

## การติดตั้ง
bash
pnpm install

## การรันโปรเจค

รันในโหมด development:
bash
pnpm dev

รันในโหมด production:
bash
pnpm start

## การ Build และรัน Docker

### Build Docker Image
bash
docker build -t tic-tac-toe .

### รัน Docker Container
bash
docker run -d -p 3000:3000 tic-tac-toe

