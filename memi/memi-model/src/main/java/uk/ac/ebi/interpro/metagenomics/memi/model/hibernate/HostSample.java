package uk.ac.ebi.interpro.metagenomics.memi.model.hibernate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

/**
 * Represents a host-associated sample object, which extends abstract {@link Sample} class.
 * Replaces {@link uk.ac.ebi.interpro.metagenomics.memi.model.EmgSample} object.
 *
 * @author Maxim Scheremetjew, EMBL-EBI, InterPro
 * @version $Id$
 * @since 1.0-SNAPSHOT
 */
@Entity
public class HostSample  {

    @Column(name = "PHENOTYPE")
    private String phenotype;

    /**
     * Host taxonomy ID (e.g. 9606 for Homo sapiens)
     */
    @Column(name = "HOST_TAX_ID")
    private Integer hostTaxonomyId;


    /**
     * Name of the species for instance Homo sapiens
     */
    @Column(name = "SPECIES", nullable = true)
    private String species;

    @Column(name = "HOST_SEX", length = 30)
    @Enumerated(EnumType.STRING)
    private HostSex hostSex;


//    public Class<? extends Sample> getClazz() {
//        return this.getClass();
//    }
//
//    public SampleType getSampleType() {
//        return Sample.SampleType.HOST_ASSOCIATED;
//    }

    public enum HostSex {
        FEMALE, MALE;
    }

    public String getPhenotype() {
        return phenotype;
    }

    public void setPhenotype(String phenotype) {
        this.phenotype = phenotype;
    }

    public Integer getHostTaxonomyId() {
        return hostTaxonomyId;
    }

    public void setHostTaxonomyId(Integer hostTaxonomyId) {
        this.hostTaxonomyId = hostTaxonomyId;
    }

    public HostSex getHostSex() {
        return hostSex;
    }

    public void setHostSex(HostSex hostSex) {
        this.hostSex = hostSex;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }
}