#!/bin/bash
npm update
npm audit fix
npm install typescript@'>=3.1.1 <3.2.0'
npm install @types/node@10.1.4
ng serve

