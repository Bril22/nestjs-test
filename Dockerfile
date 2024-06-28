FROM public.ecr.aws/docker/library/node:16

WORKDIR /api-server

COPY . .

RUN npm ci
RUN npx prisma generate
RUN npx prisma db push
RUN npm run build
CMD ["npm", "start"]
ENV SERVER_PORT=80


# Encryption key needs to be 32 chars long

EXPOSE 80

# RUN chmod +x /api-server/startProduction.sh
# RUN chown root:root startProduction.sh

# CMD /api-server/startProduction.sh