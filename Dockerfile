FROM --platform=linux/arm64 node:18-bullseye

WORKDIR /api-server

COPY . .


RUN npm install
RUN npm run build
RUN npx prisma generate
# RUN npx prisma db push
CMD ["npm", "start"]
ENV SERVER_PORT=80

RUN chmod +x /api-server/startProduction.sh
RUN chown root:root startProduction.sh

CMD /api-server/startProduction.sh