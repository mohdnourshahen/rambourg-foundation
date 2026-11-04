# Serves the built site (dist/, made by `python3 build.py`) with nginx on Fly.io.
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html/
RUN find /usr/share/nginx/html -name "._*" -delete && rm -f /usr/share/nginx/html/_redirects
EXPOSE 8080
