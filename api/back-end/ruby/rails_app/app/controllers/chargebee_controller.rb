class ChargebeeController < ApplicationController
  # This is only for demo purpose. Dont use it in live unless you know about CORS
  before_action :add_cors_header

  def checkout_new
    result = ChargeBee::HostedPage.checkout_new({
      :subscription => {:plan_id => params[:plan_id] },
      :customer => {:first_name => params[:first_name],
        :last_name => params[:last_name],
        :company => params[:company],
        :phone => params[:phone],
        :email => params[:email]
      },
      :embed => false
    })
    render :json => result.hosted_page.to_s
  end

  def checkout_existing
    # Subscription id should match the trial subscription which you have created for the currently logged in user
    subscription_id = "cbdemo_sir-sub"
    result = ChargeBee::HostedPage.checkout_existing({
      :subscription => {:id => subscription_id },
      :embed => false
    })
    render :json => result.hosted_page.to_s
  end

  def update_pm
    result = ChargeBee::HostedPage.manage_payment_sources({
      :customer => {:id => "cbdemo_sir" },
      :embed => false
    })
    render :json => result.hosted_page.to_s
  end
  
  def portal_session
    result = ChargeBee::PortalSession.create({
      :customer => {:id => "cbdemo_sir" }
    })
    render :json => result.portal_session.to_s
  end

  def add_cors_header
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
  end
end
