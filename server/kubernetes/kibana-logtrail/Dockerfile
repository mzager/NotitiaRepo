FROM docker.elastic.co/kibana/kibana:5.6.4
RUN ./bin/kibana-plugin install https://github.com/sivasamyk/logtrail/releases/download/v0.1.23/logtrail-5.6.4-0.1.23.zip
COPY logtrail.json ./plugins/logtrail/logtrail.json
