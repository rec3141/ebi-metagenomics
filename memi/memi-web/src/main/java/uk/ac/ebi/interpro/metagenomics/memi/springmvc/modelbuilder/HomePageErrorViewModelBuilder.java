package uk.ac.ebi.interpro.metagenomics.memi.springmvc.modelbuilder;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import uk.ac.ebi.interpro.metagenomics.memi.core.MemiPropertyContainer;
import uk.ac.ebi.interpro.metagenomics.memi.forms.EBISearchForm;
import uk.ac.ebi.interpro.metagenomics.memi.model.apro.Submitter;
import uk.ac.ebi.interpro.metagenomics.memi.springmvc.model.Breadcrumb;
import uk.ac.ebi.interpro.metagenomics.memi.springmvc.model.HomePageErrorViewModel;
import uk.ac.ebi.interpro.metagenomics.memi.springmvc.session.UserManager;

import java.util.List;

/**
 * Model builder class for HomePageErrorViewModel. See {@link ViewModelBuilder} for more information of how to use.
 *
 * @author Maxim Scheremetjew, EMBL-EBI, InterPro
 * @version $Id$
 * @since 1.0-SNAPSHOT
 */
public class HomePageErrorViewModelBuilder extends AbstractViewModelBuilder<HomePageErrorViewModel> {

    private final static Log log = LogFactory.getLog(HomePageErrorViewModelBuilder.class);

    private String pageTitle;

    private List<Breadcrumb> breadcrumbs;

    private MemiPropertyContainer propertyContainer;

    public HomePageErrorViewModelBuilder(UserManager sessionMgr, EBISearchForm ebiSearchForm, String pageTitle, List<Breadcrumb> breadcrumbs,
                                         MemiPropertyContainer propertyContainer) {
        super(sessionMgr, ebiSearchForm);
        this.pageTitle = pageTitle;
        this.breadcrumbs = breadcrumbs;
        this.propertyContainer = propertyContainer;
    }

    @Override
    public HomePageErrorViewModel getModel() {
        log.info("Building instance of " + HomePageErrorViewModel.class + "...");
        Submitter submitter = getSessionSubmitter(sessionMgr);
        EBISearchForm ebiSearchForm = getEbiSearchForm();
        return new HomePageErrorViewModel(submitter, ebiSearchForm, pageTitle, breadcrumbs, propertyContainer);
    }
}