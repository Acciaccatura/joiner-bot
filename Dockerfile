FROM node:6.6-onbuild
ENV PORT 3001
EXPOSE 3000 3001
CMD ["node", "server.js"]
