package uk.ac.ebi.interpro.metagenomics.memi.dao.hibernate;

import org.hibernate.criterion.Criterion;
import uk.ac.ebi.interpro.metagenomics.memi.model.hibernate.Sample;
import uk.ac.ebi.interpro.metagenomics.memi.model.valueObjects.SampleStatisticsVO;
import uk.ac.ebi.interpro.metagenomics.memi.model.valueObjects.StudyStatisticsVO;

import java.util.List;

/**
 * Represents the data access object interface for EMG samples.
 *
 * @author Maxim Scheremetjew, EMBL-EBI, InterPro
 * @version $Id$
 * @since 1.0-SNAPSHOT
 */
public interface SampleDAO extends ISecureEntityDAO<Sample> {

    String retrieveExternalStudyId(String externalSampleId);

    Sample readBySampleIdAndStudyId(String externalStudyId, String externalSampleId);

    List<Sample> retrieveAllSamplesByStudyId(long studyId);

    List<Long> retrieveSampleIdsByStudyId(long studyId);

    List<Sample> retrievePublicSamplesByStudyId(long studyId);

    /**
     * Returns an ordered list of public samples.
     *
     * @param propertyName      Name of the column for which the result should be order by.
     * @param isDescendingOrder Order direction.
     */
    List<Sample> retrieveOrderedPublicSamples(String propertyName, boolean isDescendingOrder);

    /**
     * Returns a list of public samples.
     */
    List<Sample> retrieveAllPublicSamples();

    /**
     * Returns an ordered list of public samples where the submitter ID IS equal the specified submitter ID.
     *
     * @param submitterId       Submitter ID for the IS equal restriction.
     * @param propertyName      Name of the column for which the result should be order by.
     * @param isDescendingOrder Order direction
     */
    List<Sample> retrieveOrderedSamplesBySubmitter(long submitterId, String propertyName, boolean isDescendingOrder);

    /**
     * Returns a list of public samples where the submitter ID IS equal the specified submitter ID.
     *
     * @param submissionAccountId Submitter ID for the IS equal restriction.
     */
    List<Sample> retrieveSamplesBySubmitter(String submissionAccountId);

    /**
     * Returns an ordered list of public samples where the submitter ID IS NOT equal the specified submitter ID.
     *
     * @param submitterId       Submitter ID for the NOT equal restriction.
     * @param propertyName      Name of the column for which the result should be order by.
     * @param isDescendingOrder Order direction.
     */
    List<Sample> retrieveOrderedPublicSamplesWithoutSubId(long submitterId, String propertyName, boolean isDescendingOrder);

    /**
     * Returns a list of public samples where the submitter ID IS NOT equal the specified submitter ID.
     *
     * @param submitterId Submitter ID for the NOT equal restriction.
     */
    List<Sample> retrievePublicSamplesWithoutSubId(long submitterId);

    /**
     * Returns a list of samples filtered by the specified criteria and ordered by sample name (ascending). This method is used for pagination.
     *
     * @param crits         A list of criteria which should be add to the Hibernate query. Criteria must be
     *                      applicable to the sample class, but not to the sub classes.
     * @param startPosition Used for pagination. In terms of Oracle this parameter specifies the row number of the first entry which should be selected.
     * @param pageSize      Used for pagination.Specifies how many entries should be selected for the specified page.
     * @return
     */
    List<Sample> retrieveFilteredSamples(List<Criterion> crits, int startPosition, int pageSize, String orderedByColumnWithName);

    /**
     * Returns a list of samples filtered by the specified criteria and ordered by sample name (ascending).
     *
     * @param crits A list of criteria which should be add to the Hibernate query. Criteria must be
     *              applicable to the sample class, but not to the sub classes.
     * @return
     */
    List<Sample> retrieveFilteredSamples(List<Criterion> crits, String orderedByColumnWithName);

    /**
     * Counts the result size of the specified query.
     *
     * @param crits A list of criteria which should be add to the Hibernate query. Criteria must be
     *              applicable to the sample class, but not to the sub classes.
     * @return
     */
    Long countFilteredSamples(List<Criterion> crits);

    Sample readByStringId(String sampleId);

    long retrieveSampleSizeByStudyId(long studyId);

    public SampleStatisticsVO retrieveStatistics();
}
