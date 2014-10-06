package uk.ac.ebi.interpro.metagenomics.memi.springmvc.modelbuilder;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import uk.ac.ebi.interpro.metagenomics.memi.core.MemiPropertyContainer;
import uk.ac.ebi.interpro.metagenomics.memi.dao.hibernate.StudyDAO;
import uk.ac.ebi.interpro.metagenomics.memi.model.apro.Submitter;
import uk.ac.ebi.interpro.metagenomics.memi.model.hibernate.Study;
import uk.ac.ebi.interpro.metagenomics.memi.springmvc.model.Breadcrumb;
import uk.ac.ebi.interpro.metagenomics.memi.springmvc.model.CompareViewModel;
import uk.ac.ebi.interpro.metagenomics.memi.springmvc.session.SessionManager;

import java.util.ArrayList;
import java.util.List;

/**
 * Model builder class for StudiesViewModel. See {@link ViewModelBuilder} for more information of how to use.
 *
 * @author Maxim Scheremetjew, EMBL-EBI, InterPro
 * @version $Id$
 * @since 1.0-SNAPSHOT
 */
public class CompareViewModelBuilder extends AbstractViewModelBuilder<CompareViewModel> {

    private final static Log log = LogFactory.getLog(CompareViewModelBuilder.class);

    private String pageTitle;

    private List<Breadcrumb> breadcrumbs;

    private MemiPropertyContainer propertyContainer;

    private StudyDAO studyDAO;


    public CompareViewModelBuilder(final SessionManager sessionMgr, final String pageTitle, final List<Breadcrumb> breadcrumbs,
                                   final MemiPropertyContainer propertyContainer, final StudyDAO studyDAO) {
        super(sessionMgr);
        this.pageTitle = pageTitle;
        this.breadcrumbs = breadcrumbs;
        this.propertyContainer = propertyContainer;
        this.studyDAO = studyDAO;
    }


//    public StudiesViewModel getModel() {
//        log.info("Building instance of " + StudiesViewModel.class + "...");
//        Submitter submitter = getSessionSubmitter(sessionMgr);
//        String submissionAccountId = (submitter != null ? submitter.getSubmissionAccountId() : null);
//
//        //Get filtered studies
//        List<Criterion> filterCriteria = buildFilterCriteria(filter, submissionAccountId);
//        List<Study> filteredStudies = getFilteredStudies(filterCriteria, doPagination);
//        long filteredStudiesCount = studyDAO.countByCriteria(filterCriteria);
//        ViewPagination pagination = new ViewPagination(startPosition, filteredStudiesCount, PAGE_SIZE);
//
//        //studies are sorted by study name at the moment
////        Map<Study, Long> sortedStudyMap = getStudySampleSizeMap(filteredStudies, sampleDAO, new ViewStudiesComparator());
//
//        attachSampleSize(filteredStudies);
//        return new StudiesViewModel(submitter, filteredStudies, null, pageTitle, breadcrumbs, propertyContainer, tableHeaderNames, pagination, filter);
//    }

    public CompareViewModel getModel() {
        log.info("Building instance of " + CompareViewModel.class + "...");
        Submitter submitter = getSessionSubmitter(sessionMgr);
        String submissionAccountId = (submitter != null ? submitter.getSubmissionAccountId() : null);

        List<Criterion> filterCriteria = buildFilterCriteria(submissionAccountId);
        List<Study> filteredStudies = studyDAO.retrieveFilteredStudies(filterCriteria, false, "studyName");

        return new CompareViewModel(submitter, pageTitle, breadcrumbs, propertyContainer, filteredStudies);
    }

    /**
     * Builds a Hibernate Criteria based on the submission account id.
     *
     * @param submissionAccountId
     * @return
     */
    private static List<Criterion> buildFilterCriteria(final String submissionAccountId) {
        List<Criterion> criterionList = new ArrayList<Criterion>();

        //If submission account Id is not NULL then get private studies only, OTHERWISE public only
        if (submissionAccountId != null) {
            criterionList.add(Restrictions.eq("submissionAccountId", submissionAccountId));
        } else {
            criterionList.add(Restrictions.eq("isPublic", true));
        }

        return criterionList;
    }
}