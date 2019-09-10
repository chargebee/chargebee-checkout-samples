rm -rf dist/

mkdir -p dist/components-examples

cp index.html dist/components-examples/
cp menu-loader.js dist/components-examples/
cp menu.css dist/components-examples/
cp -r jquery dist/components-examples/

npm --prefix vue/cb-components-examples install
npm --prefix vue/cb-components-examples run build
mv vue/cb-components-examples/dist dist/components-examples/vue

npm --prefix react-app install
npm --prefix react-app run build
mv react-app/build dist/components-examples/react

cd angular-app && npm install && ng build --base-href="/components-examples/angular/" && cd .. 
mv angular-app/dist/angular-app dist/components-examples/angular
