# Compute Service Containers Orchestration

Oncoscape-v3 is adopting Kubernetes as our compute service docker container orchestration system.

## Cloud Platform and Services

#### List of AWS services: IAM, EC2, ELB, S3, CloudFront, CloudWatch, Route 53, Certificate Manager

#### EC2 instances

* worker nodes: c4.large x 3

* master nodes: t2.small x 3

* High Availability (HA) : us-west-2a, us-west-2b, us-west-2c

## Components of oncoscape v3 kubernetes cluster

1.  ingress
    We are providing multiple compute services. Each service is built into a docker container. Ingress routes different url request through the same entrypoint to the corresponding pod.

2.  hpa

3.

## Load Testing

To configure the resource designation to each pod/container, artillery.io is used to perform the loading test.

## Pod/Container-level Monitoring System

* **Heapster & InfluxDB**:

Heapster is used to aggregate metrics data from containers, hosts and send data to time series database such as influxDB for storage. InfluxDB uses SQL-like query language.

* **Grafana**:

Grafana can connect to InfluxDB to visualize and monitor the cluster performance. We put a load balancer behind the Grafana.

## Centralized Logging System

* **Fluentd & ElasticSearch & Kibana**

Fluentd collects logs from all the worker nodes and parses them and sends them to ElasticSearch. ElasticSearch is good at indexing and managing semi-structured data. Kibana visualizes the data. We put a load balancer behind kibana.

* **LogTrail**

## Instance-level Monitoring System

We use AWS CloudWatch to monitor the instance health.

## Security

Each of the three ELBs is
