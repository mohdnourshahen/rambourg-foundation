# Serves the built site (dist/, made by `python3 build.py`) with nginx on Fly.io.
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html/
# files from the exFAT drive arrive owner-only (700); nginx's worker needs to read them
RUN find /usr/share/nginx/html -name "._*" -delete && rm -f /usr/share/nginx/html/_redirects \
 && chmod -R a+rX /usr/share/nginx/html
EXPOSE 8080
