
node --max_old_space_size=12288 ./node_modules/.bin/ng build --prod --optimization=true --outputHashing="all" --sourceMap=false --extractCss=true --namedChunks=false --aot=true --extractLicenses=true --vendorChunk=false --buildOptimizer=true
