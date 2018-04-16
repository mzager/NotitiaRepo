FROM ubuntu:16.04

ENV DEBIAN_FRONTEND noninteractive

# Basics
RUN apt-get -y update && \
    apt-get -y upgrade && \
    apt-get install -y git nano

# Python
RUN apt-get install -y software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get -y update && \
    apt-get install -y python3.6 python3.6-dev python3-pip && \
    apt-get -y update && \
    apt-get install -y python-setuptools 

RUN easy_install pip && \
    apt-get install -y python-virtualenv && \
    pip3 install flask scipy lifelines pandas scikit-learn numpy eve && \
    pip3 install -U flask-cors # 
# && \
# git clone https://github.com/canaantt/Python
RUN mkdir Python
COPY ./ Python
# Start
EXPOSE 80
CMD ["python3", "Python/api.py"]
