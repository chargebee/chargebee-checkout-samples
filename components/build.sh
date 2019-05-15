rm -rf dist/

mkdir dist

cp index.html dist/
cp menu-loader.js dist/
cp menu.css dist/
cp -r jquery dist/

npm --prefix vue/cb-components-examples install
npm --prefix vue/cb-components-examples run build
mv vue/cb-components-examples/dist dist/vue

npm --prefix react-app install
npm --prefix react-app run build
mv react-app/build dist/react

cd angular-app && npm install && ng build --base-href="/angular/" && cd .. 
mv angular-app/dist/angular-app dist/angular
