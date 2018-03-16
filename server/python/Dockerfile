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
    apt-get install -y python3.6 python3.6-dev && \
    apt-get -y update && \
    apt-get install -y python3-pip python-virtualenv && \
    pip3 install --upgrade pip && \
    pip3 install flask scipy lifelines pandas scikit-learn numpy eve && \
    pip3 install -U flask-cors && \
    git clone https://github.com/canaantt/Python
    # dockgit clone https://github.com/mzager/Python
COPY static/loaderio-0eee16638c75d153d8fe2f0021281756.txt /Python/loaderio-0eee16638c75d153d8fe2f0021281756.txt  
# Start
EXPOSE 80
CMD ["python3", "Python/api.py"]
