#!/bin/bash
npm update
npm audit fix
npm install typescript@'>=2.7.2 <2.10.0'
npm install @types/node@10.1.4
ng serve

