package uk.ac.ebi.interpro.metagenomics.memi.model.hibernate;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import uk.ac.ebi.interpro.metagenomics.memi.model.hibernate.Study;

/**
 * Test class for {@link uk.ac.ebi.interpro.metagenomics.memi.model.EmgStudy}.
 *
 * @author Maxim Scheremetjew, EMBL-EBI, InterPro
 * @version $Id$
 * @since 1.0-SNAPSHOT
 */
//TODO: Refactor
public class StudyTest {

    private Study study;

    @Before
    public void setUp() throws Exception {
        study = new Study();
    }

    @Test
    public void testGetShortStudyAbstract() throws Exception {
        int maxLength = 100;
        String testString = getStringOfLength(maxLength);
        Assert.assertEquals(maxLength, testString.length());
        study.setStudyAbstract(testString);
        Assert.assertEquals(testString, study.getShortStudyAbstract(maxLength));
        //
        testString = getStringOfLength(90) + ' ' + getStringOfLength(30);
        Assert.assertEquals(121, testString.length());
        study.setStudyAbstract(testString);
        Assert.assertEquals(90, study.getShortStudyAbstract(maxLength).length());
        Assert.assertEquals(getStringOfLength(90), study.getShortStudyAbstract(maxLength));
    }

    private String getStringOfLength(int length) {
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < length; i++) {
            sb.append('N');
        }
        return sb.toString();
    }


    @Test
    @Ignore
    public void testInitialization() {
//        assertEquals(false, study.isPublic());
//        assertNotNull(study.getSubmitDate());
//        assertNotNull(study.getReleaseDate());
//        assertNotNull(study.getReleaseDate());
//        assertNotNull(study.getSamples());
//        assertNull(study.getStudyName());
    }

    /**
     * Tests not all but the most important setter and getter methods.
     */
    @Test
    @Ignore
    public void testSetterAndGetter() {
//        Date date = hibernate Date();
//        study.setSubmitDate(date);
//        assertEquals(date, study.getSubmitDate());
//        assertFalse(study.isPublic());
//        study.setPublic(true);
//        assertTrue(study.isPublic());
//        assertEquals(0, study.getSamples().size());
//        List<Sample> samples = hibernate ArrayList<Sample>();
//        samples.add(hibernate Sample());
//        study.setSamples(samples);
//        assertEquals(1, study.getSamples().size());
//        study.setStudyId(11);
//        assertEquals(11, study.getStudyId());
//        study.setStudyName("test");
//        assertTrue(study.getStudyName().equals("test"));
    }

    @Test
    @Ignore
    public void testEquals() throws Exception {
//        Date date = hibernate Date();
//        Study s1 = hibernate Study();
//        s1.setStudyId(2);
//        s1.setStudyName("test");
//        s1.setSubmitDate(date);
//        s1.setPublic(true);
//
//        Study s2 = hibernate Study();
//        s2.setStudyId(2);
//        s2.setStudyName("test");
//        s2.setSubmitDate(date);
//        s2.setPublic(true);
//
//        Study s3 = hibernate Study();
//        s2.setStudyId(2);
//
//        assertEquals(s1.getStudyId(), s2.getStudyId());
//        assertEquals(s1.getStudyName(), s2.getStudyName());
//        assertEquals(s1.getSubmitDate(), s2.getSubmitDate());
//        assertEquals(s1.isPublic(), s2.isPublic());
//        assertEquals(s1.getSamples().size(), s2.getSamples().size());
//
//        assertNotSame(s1.getStudyId(), s3.getStudyId());
//
//        assertTrue(s1.equals(s2));
//        assertTrue(s2.equals(s1));
//        assertFalse(s1.equals(s3));
//        assertFalse(s2.equals(s3));
    }
}