package com.chargebee.samples;

import com.chargebee.Environment;
import com.chargebee.Result;
import com.chargebee.models.HostedPage;
import com.chargebee.models.PortalSession;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "create_portal_session", value = {"generate_portal_session"})
public class CreatePortalSession extends HttpServlet{

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String customerId = "cbdemo_sir";
        Result result = null;
        try {
            result = PortalSession.create()
                    .customerId(customerId).request(new Environment("vivek1-test", "test_0kMishobocuobez4OlrbwultwfHfT51fE"));
        } catch (Exception e) {
            e.printStackTrace();
        }
        PortalSession portalSession = result.portalSession();
        // Dont add the below header in production. This is only for demo
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.setContentType("application/json");
        response.getWriter().print(portalSession.jsonObj);
    }
}
