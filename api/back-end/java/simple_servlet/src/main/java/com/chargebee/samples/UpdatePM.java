package com.chargebee.samples;

import com.chargebee.Environment;
import com.chargebee.Result;
import com.chargebee.models.HostedPage;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "update_pm", value = {"generate_update_payment_method_url"})
public class UpdatePM extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String customerId = "cbdemo_sir";
        Result result = null;
        try {
            result = HostedPage.managePaymentSources()
                    .customerId(customerId).request(new Environment("vivek1-test", "test_0kMishobocuobez4OlrbwultwfHfT51fE"));
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
