package com.healthia.functions.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "image_analysis_history")
public class ImageAnalysisHistoryEntity {

    @Id // This ID will be the one used in the API (requestedId or generated)
    private Integer id;

    private OffsetDateTime fecha;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "analisis_plato_id", referencedColumnName = "id")
    @MapsId // This maps the id of AnalisisPlatoEntity to this entity's id if it's generated by AnalisisPlatoEntity
    private AnalisisPlatoEntity analisis;

    @Column(length = 1024)
    private String imagenOriginalUrl;
    @Column(length = 1024)
    private String imagenProcesadaUrl;

    // Helper method to link AnalisisPlatoEntity
    public void setAnalisis(AnalisisPlatoEntity analisis) {
        this.analisis = analisis;
        if (analisis != null) {
            analisis.setHistoryEntry(this);
            // If you want the history ID to be the same as the analysis ID when analysis.id is generated:
            // this.id = analisis.getId(); // This might need adjustment based on ID generation strategy
        }
    }
} 