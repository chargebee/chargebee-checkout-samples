Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  post "/api/generate_checkout_new_url" => "chargebee#checkout_new"
  post "/api/generate_checkout_existing_url" => "chargebee#checkout_existing"
  post "/api/generate_update_payment_method_url" => "chargebee#update_pm"
  post "/api/generate_portal_session" => "chargebee#portal_session"
end
