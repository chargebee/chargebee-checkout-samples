sh build.sh
echo
echo
echo "--------------------------------------"
echo "         Chargebee Examples           "
echo
echo " Running on: http://localhost:9000/components-examples/    "
echo
echo "--------------------------------------"
echo
cd dist && python -m SimpleHTTPServer 9000
