package uk.ac.ebi.interpro.metagenomics.memi.controller;

import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.support.SessionStatus;
import uk.ac.ebi.interpro.metagenomics.memi.forms.LoginForm;
import uk.ac.ebi.interpro.metagenomics.memi.model.hibernate.SecureEntity;
import uk.ac.ebi.interpro.metagenomics.memi.springmvc.model.Breadcrumb;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Represents the login controller for the login component on the right hand side, which is display on each page.
 *
 * @author Maxim Scheremetjew, EMBL-EBI, InterPro
 * @since 1.0-SNAPSHOT
 */
@Controller
public class LoginFormController extends LoginController {


    @RequestMapping(value = "**/doLogin", method = RequestMethod.POST)
    public
    @ResponseBody
    Map<String, String> doProcessLogin(@ModelAttribute("loginForm") @Valid LoginForm loginForm,
                                       final BindingResult bindingResult, HttpServletResponse response,
                                       final SessionStatus sessionStatus) {
        /**
         *  Note: The page reload after login is triggered by the AJAX success function in the JavaScript file called
         *  loginDialog_script.js
         *
         *   window.location = root + "/metagenomics";
         *
         */
        if (bindingResult.hasErrors()) {
            response.setStatus(HttpServletResponse.SC_CONFLICT);
            return null;
        } else {
            super.processLogin(loginForm, bindingResult, sessionStatus);
            if (bindingResult.hasFieldErrors()) {
                response.setStatus(HttpServletResponse.SC_CONFLICT);
                Map<String, String> errorMessages = new HashMap<String, String>();
                for (FieldError error : bindingResult.getFieldErrors()) {
                    errorMessages.put(error.getField(), error.getDefaultMessage());
                }
                return errorMessages;
            }
            return null;
        }
    }

    @Override
    protected String getModelViewName() {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    protected List<Breadcrumb> getBreadcrumbs(SecureEntity obj) {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }
}