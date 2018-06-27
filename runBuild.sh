
#!/bin/bash
# npm run compute
# npm run loader
# node --max_old_space_size=12288 ./node_modules/.bin/ng build --prod --optimization=true --outputHashing="all" --sourceMap=false --extractCss=true --namedChunks=false --aot=true --extractLicenses=true --vendorChunk=false --buildOptimizer=true
for filename in dist/*.js; do
  #gzip -9 "./"$filename
  #//mv "./"$filename".gz" "./"$filename
  aws s3 sync "./"$filename "s3://s3-us-west-2.amazonaws.com/oncoscape-frontend/"$filename --acl public-read --content-encoding "gzip" --content-type "application/javascript"
done
for filename in dist/*.css; do
   #gzip -9 "./"$filename
   #mv "./"$filename".gz" "./"$filename
   aws s3 sync "./"$filename "s3://s3-us-west-2.amazonaws.com/oncoscape-frontend/"$filename --acl public-read --content-encoding "gzip" --content-type "text/css"
done
for filename in dist/*.html; do
   #gzip -9 "./"$filename
   #mv "./"$filename".gz" "./"$filename
   aws s3 sync "./"$filename "s3://s3-us-west-2.amazonaws.com/oncoscape-frontend/"$filename --acl public-read --content-encoding "gzip" --content-type "text/html"
done
