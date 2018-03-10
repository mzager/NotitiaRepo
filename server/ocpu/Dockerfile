FROM ubuntu:16.04

ENV DEBIAN_FRONTEND noninteractive

# Basics
RUN apt-get -y update && \
    apt-get -y upgrade && \
    apt-get install -y git nano

# Open CPU
RUN \
  apt-get update && \
  apt-get -y dist-upgrade && \
  apt-get install -y software-properties-common && \
  add-apt-repository -y ppa:opencpu/opencpu-2.0 && \
  apt-get update && \
  apt-get install -y opencpu-server

# Prints apache logs to stdout
RUN \
  ln -sf /proc/self/fd/1 /var/log/apache2/access.log && \
  ln -sf /proc/self/fd/1 /var/log/apache2/error.log && \
  ln -sf /proc/self/fd/1 /var/log/opencpu/apache_access.log && \
  ln -sf /proc/self/fd/1 /var/log/opencpu/apache_error.log

# COPY Docker.OpenCpu.conf /etc/opencpu/server.conf
# COPY Docker.Apache.conf /etc/apache2/sites-available/opencpu.conf
# COPY Docker.Apache.conf /etc/apache2/sites-enabled/opencpu.conf
# COPY Docker.Apache.Default.conf /etc/apache2/sites-available/000-default.conf
# COPY Docker.Apache.Default.conf /etc/apache2/sites-enabled/000-default.conf
# COPY Docker.Apache.Ports.conf /etc/apache2/ports.conf

RUN \
  echo "opencpu:p@blo" | chpasswd

# Custom R Packages
RUN echo 'local({r <- getOption("repos"); r["CRAN"] <- "http://cran.r-project.org"; options(repos=r)})' > ~/.Rprofile
RUN R -e 'source("http://bioconductor.org/biocLite.R"); biocLite("DESeq2")'
RUN Rscript -e "devtools::install_github(c('mzager/R'), dependencies = T)"

# # Html
# COPY /client /var/www/html

# Start
EXPOSE 8004
CMD apachectl -DFOREGROUND