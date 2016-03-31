package uk.ac.ebi.interpro.metagenomics.memi.springmvc.model;

import uk.ac.ebi.interpro.metagenomics.memi.core.MemiPropertyContainer;
import uk.ac.ebi.interpro.metagenomics.memi.forms.EBISearchForm;
import uk.ac.ebi.interpro.metagenomics.memi.model.apro.Submitter;
import uk.ac.ebi.interpro.metagenomics.memi.springmvc.model.ebiSearch.EBISampleSearchResults;

import java.util.List;

/**
 * Created by maq on 17/03/2016.
 */
public class SearchViewModel extends ViewModel {

    EBISearchForm ebiSearchForm;
    EBISampleSearchResults ebiSampleSearchResults;

    /**
     * Please notice to use this name for all the different model types. Otherwise the main menu would not work
     * fine.
     */
    public final static String MODEL_ATTR_NAME = "model";

    public SearchViewModel(Submitter submitter, String pageTitle, List<Breadcrumb> breadcrumbs,
                           MemiPropertyContainer propertyContainer, EBISearchForm search,
                           EBISampleSearchResults sampleSearchResults) {
        super(submitter, pageTitle, breadcrumbs, propertyContainer);
        this.ebiSearchForm = search;
        this.ebiSampleSearchResults = sampleSearchResults;
    }

    public EBISearchForm getEbiSearchForm() {
        return ebiSearchForm;
    }

    public void setEbiSearchForm(EBISearchForm ebiSearchForm) {
        this.ebiSearchForm = ebiSearchForm;
    }

    public EBISampleSearchResults getEbiSampleSearchResults() {
        return ebiSampleSearchResults;
    }

    public void setEbiSampleSearchResults(EBISampleSearchResults ebiSampleSearchResults) {
        this.ebiSampleSearchResults = ebiSampleSearchResults;
    }
}
