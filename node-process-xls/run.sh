#!/usr/bin/bash
python 01.split.xls.py $1
node 02.event.js
node 02.matrix.js
if [ -e data/Mutation.csv]
then
    echo "ok"
    node 02.mutation.js
else
    echo "data/Mutation.csv doesn't exit"
fi

node 02.patient.js
node 02.psmap.js
node 03.manifest.js
for file in output/*.json;do gzip -9 "${file}"; done