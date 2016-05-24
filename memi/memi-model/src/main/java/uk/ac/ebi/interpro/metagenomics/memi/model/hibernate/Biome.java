package uk.ac.ebi.interpro.metagenomics.memi.model.hibernate;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Comparator;


/**
 * Represents a Hierarchical Data structure more precisely an implementation of a Modified Preorder Tree Traversal approach.
 *
 * @author Maxim Scheremetjew, EMBL-EBI, InterPro
 * @since 1.4-SNAPSHOT
 */
@Entity
@Table(name = "BIOME_HIERARCHY_TREE")
public class Biome {

    @Id
    @Column(name = "BIOME_ID", columnDefinition = "SMALLINT(6)")
    private int biomeId;

    @Column(name = "BIOME_NAME", length = 60, nullable = false)
    private String biomeName;

    @Column(name = "LFT", nullable = false, columnDefinition = "SMALLINT(6)")
    private int left;

    @Column(name = "RGT", nullable = false, columnDefinition = "SMALLINT(6)")
    private int right;

    @Column(name = "DEPTH", nullable = false, columnDefinition = "TINYINT(4)")
    private int depth;

    @Column(name = "LINEAGE", length = 110, nullable = false)
    private String lineage;

    public Biome() {
    }

    public Biome(int biomeId, String biomeName, int left, int right, int depth, String lineage) {
        this.biomeId = biomeId;
        this.biomeName = biomeName;
        this.left = left;
        this.right = right;
        this.depth = depth;
        this.lineage = lineage;
    }

    public int getBiomeId() {
        return biomeId;
    }

    public void setBiomeId(int biomeId) {
        this.biomeId = biomeId;
    }

    public String getBiomeName() {
        return biomeName;
    }

    public void setBiomeName(String biomeName) {
        this.biomeName = biomeName;
    }

    public int getLeft() {
        return left;
    }

    public void setLeft(int left) {
        this.left = left;
    }

    public int getRight() {
        return right;
    }

    public void setRight(int right) {
        this.right = right;
    }

    public int getDepth() {
        return depth;
    }

    public void setDepth(int depth) {
        this.depth = depth;
    }

    public String getLineage() {
        return lineage;
    }

    public void setLineage(String lineage) {
        this.lineage = lineage;
    }

    /**
     * Please note this method is auto-generated by IntelliJ.
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Biome that = (Biome) o;

        if (biomeId != that.biomeId) return false;
        if (depth != that.depth) return false;
        if (left != that.left) return false;
        if (right != that.right) return false;
        if (biomeName != null ? !biomeName.equals(that.biomeName) : that.biomeName != null) return false;
        if (lineage != null ? !lineage.equals(that.lineage) : that.lineage != null) return false;

        return true;
    }

    /**
     * Please note this method is auto-generated by IntelliJ.
     */
    @Override
    public int hashCode() {
        int result = biomeId;
        result = 31 * result + (biomeName != null ? biomeName.hashCode() : 0);
        result = 31 * result + left;
        result = 31 * result + right;
        result = 31 * result + depth;
        result = 31 * result + (lineage != null ? lineage.hashCode() : 0);
        return result;
    }
}