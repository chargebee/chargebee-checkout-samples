We have demo code samples for the below client side and server side frameworks
  Server side frameworks
  ----------------------
    - Laravel (PHP)
    - Simple Java application
    - Rails (ruby)
    - Flask (python)
    - Express (node)

  Client side frameworks
  -----------------------
    - angular 5
    - vue
    - jquery
    - react


  To view the demo code in action, you need to have a server(with any one of the server side frameworks mentioned above) running at port 8000. We will be hitting this end point from client side code.

  Check README.md file within each server side framework section to know how to run the server at port 8000.

  Each server side code sample will run a service that responds to 4 different end points,

  All the end points will return a application/json response and will expect params in application/x-www-form-urlencoded format
  
    - "/api/generate_checkout_new_url"
    - "/api/generate_checkout_existing_url"
    - "/api/generate_update_payment_method_url"
    - "/api/generate_portal_session"

  
  Similarly, you need to run another server(that serves js and html files)
  - For vue and jquery, a simple python HTTPServer is enough for serving static files
  - For angular and react, use the dev server that comes along with the quick start code