FROM public.ecr.aws/docker/library/node:16

WORKDIR /api-server

COPY . .


RUN npm install
RUN npm run build
RUN npx prisma generate
# RUN npx prisma db push
CMD ["npm", "start"]
ENV SERVER_PORT=80

ENV DATABASE_URL="postgresql://postgresql123:briltest@localhost:5436/nest?schema=public"
ENV DEBUG=true
ENV SESSION_SECRET_KEY="98fQTDh2uNSRVjrRxFn5V4WgPP99QawUkLHqoDdBFHBXQi3Z"
ENV JWT_SECRET="jwt-secret"
ENV JWT_REFRESH_SECRET="jwt-refresh-secret"
ENV COOKIE_SECRET="secret-cookie"
# Encryption key needs to be 32 chars long
ENV ENCRYPTION_KEY="ZydMYrVB9JPFGM3NMhcjeX9eciSoStw3"

EXPOSE 80

RUN chmod +x /api-server/startProduction.sh
RUN chown root:root startProduction.sh

CMD /api-server/startProduction.sh