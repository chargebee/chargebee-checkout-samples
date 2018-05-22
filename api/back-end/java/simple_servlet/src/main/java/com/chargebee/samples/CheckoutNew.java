package com.chargebee.samples;
import com.chargebee.Environment;
import com.chargebee.Result;
import com.chargebee.models.HostedPage;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "checkout_new", value = {"generate_checkout_new_url"})
public class CheckoutNew extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String planId = request.getParameter("plan_id");
        Result result = null;
        try {
            result = HostedPage.checkoutNew()
                    .subscriptionPlanId(planId).request(new Environment("honeycomics-v3-test", "test_jqXGuQLkBHUSR2PM0qgUV21W1VqSFJIU"));
        } catch (Exception e) {
            e.printStackTrace();
        }
        HostedPage hostedPage = result.hostedPage();
        // Dont add the below header in production. This is only for demo
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");
        response.getWriter().print(hostedPage.jsonObj);
    }
}
