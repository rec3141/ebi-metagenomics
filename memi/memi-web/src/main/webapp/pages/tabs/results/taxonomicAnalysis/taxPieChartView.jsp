<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<div id="tax-pie">

    <div class="chart_container">
        <div class="chart-block col-1-3">
            <div id="tax_chart_pie_dom"></div>
        </div>

        <div class="chart-block col-1-3">
            <div class="but_chart_export ui-buttonset">
                <button id="select"
                        class="ui-button ui-widget ui-state-default ui-button-text-icon-secondary ui-corner-right"><span
                        class="ui-button-text">Export</span><span
                        class="ui-button-icon-secondary ui-icon ui-icon-triangle-1-s"></span></button>
            </div>

            <ul class="export_list">
                <li><strong>Domain composition</strong></li>
                <li class="chart_exp png" id="pie_dom_png"><a
                        onclick="saveAsImg(document.getElementById('tax_chart_pie_dom'),'<spring:message code="file.name.tax.pie.chart.domain.png"/>',1);">PNG</a>
                </li>
                <li class="chart_exp png" id="pie_dom_png_h"><a
                        onclick="saveAsImg(document.getElementById('tax_chart_pie_dom'),'<spring:message code="file.name.tax.pie.chart.domain.high.png"/>',300/72);">PNG
                    (Higher quality)</a></li>
                <li class="chart_exp" id="pie_dom_svg"><a
                        onclick="saveAsSVG(document.getElementById('tax_chart_pie_dom'),'<spring:message code="file.name.tax.pie.chart.domain.svg"/>');">SVG</a>
                <li><strong>Phylum composition</strong></li>
                <%--<li class="chart_exp"><a onclick="toImg(document.getElementById('tax_chart_pie_phy'), document.getElementById('img_div'));">Snapshot</a> </li>--%>
                <li class="chart_exp png" id="pie_phy_png"><a
                        onclick="saveAsImg(document.getElementById('tax_chart_pie_phy'),'<spring:message code="file.name.tax.pie.chart.phylum.png"/>',1);">PNG</a>
                </li>
                <li class="chart_exp png" id="pie_phy_png_h"><a
                        onclick="saveAsImg(document.getElementById('tax_chart_pie_phy'),'<spring:message code="file.name.tax.pie.chart.phylum.high.png"/>',300/72);">PNG
                    (Higher quality)</a></li>
                <li class="chart_exp" id="pie_phy_svg"><a
                        onclick="saveAsSVG(document.getElementById('tax_chart_pie_phy'),'<spring:message code="file.name.tax.pie.chart.phylum.svg"/>');">SVG</a>
            </ul>

            <div id="tax_chart_pie_phy"></div>
        </div>

        <div id="tax_dashboard" class="col-1-3">
            <div id="tax_table_filter"></div>
            <div id="tax_table_pie"></div>
            <%--<div id="table_div"></div>--%>
            <div class="msg_help blue_h phylum_help">
                <p><span class="icon icon-generic" data-icon="i"></span>This view aggregates the taxonomy
                    information at the domain and phylum level. To download the full detailed taxonomy distribution
                    (TSV format),
                    <a href="#ui-id-6" class="open-tab" data-tab-index="4"> please follow this link</a>.</p>
            </div>
        </div>

    </div>
</div>

<%--Globale page properties--%>
<c:choose>
    <c:when test="${model.run.releaseVersion == '1.0'}"><c:set var="phylumCompositionTitle" scope="request"
                                                               value="Phylum composition (Total: ${model.taxonomyAnalysisResult.sliceVisibilityThresholdDenominator} OTUs)"/></c:when>
    <c:otherwise><c:set var="phylumCompositionTitle" scope="request"
                        value="Phylum composition (Total: ${model.taxonomyAnalysisResult.sliceVisibilityThresholdDenominator} reads)"/></c:otherwise>
</c:choose>

<script type="text/javascript">
    // script to make the tab download link work
    $('.open-tab').click(function (event) {
        $('#navtabs').tabs("option", "active", $(this).data("tab-index"));
//        $('#download_tax_analysis').css("background-color", "yellow");
    });

    drawDomainCompositionPieChartView();
    drawPhylumPieChart();
    drawPhylumTablePieChartView();

    function drawDomainCompositionPieChartView() {
        var domainBarChartPieChartData = google.visualization.arrayToDataTable([
            ['kingdom', 'Match'],
            <c:set var="addComma" value="false"/><c:forEach var="domainEntry" items="${model.taxonomyAnalysisResult.domainComposition.domainMap}"><c:choose><c:when test="${addComma}">,
            </c:when><c:otherwise><c:set var="addComma" value="true"/></c:otherwise></c:choose>
            ['${domainEntry.key}', ${domainEntry.value}]</c:forEach>
        ]);

        // taxonomy Pie chart domain
        var options = {
            'title':'Domain composition',
            'titleTextStyle':{fontSize:12},
            'fontName':'"Arial"',
            'colors':[${model.taxonomyAnalysisResult.domainComposition.colorCode}],
            'height':299,
            'chartArea':{left:20, top:30, width:"100%", height:"100%"},
            'pieSliceBorderColor':'none',
            'legend':{fontSize:10, alignment:'center', 'textStyle':{'fontSize':10}},
            'pieSliceTextStyle':{ bold:true, color:'white'}
        };

        var domainPieChart = new google.visualization.PieChart(document.getElementById('tax_chart_pie_dom'));
        domainPieChart.draw(domainBarChartPieChartData, options);
    }

    function drawPhylumTablePieChartView() {
// Taxonomy top phylum table - Pie Chart
        var taxMatchesDataPieChart = new google.visualization.DataTable();
        taxMatchesDataPieChart.addColumn('string', 'Phylum');
        taxMatchesDataPieChart.addColumn('string', 'Domain');
        <c:choose>
        <c:when test="${model.run.releaseVersion == '1.0'}">taxMatchesDataPieChart.addColumn('number', 'Unique OTUs');
        taxMatchesDataPieChart.addColumn('number', '%');
        </c:when>
        <c:otherwise>taxMatchesDataPieChart.addColumn('number', 'Number of reads');
        taxMatchesDataPieChart.addColumn('number', '%');
        </c:otherwise>
        </c:choose>
        taxMatchesDataPieChart.addRows([
            <c:set var="addComma" value="false"/><c:forEach var="taxonomyData" items="${model.taxonomyAnalysisResult.taxonomyDataSet}" varStatus="status"><c:choose><c:when test="${addComma}">,
            </c:when><c:otherwise><c:set var="addComma" value="true"/></c:otherwise></c:choose>
            ['<div title="${taxonomyData.phylum}" class="_cc" style="background-color: #${taxonomyData.colorCode};"></div> ${taxonomyData.phylum}', '${taxonomyData.superKingdom}', ${taxonomyData.numberOfHits}, ${taxonomyData.percentage}]</c:forEach>
        ]);

// Define a StringFilter control for the 'Phylum' column - Pie chart table
        var taxStringFilter = new google.visualization.ControlWrapper({
            'controlType':'StringFilter',
            'containerId':'tax_table_filter',
            'options':{'matchType':'any', 'filterColumnIndex':'0', 'ui':{'label':'Filter table', 'labelSeparator':':', 'ui.labelStacking':'vertical', 'ui.cssClass':'custom_col_search'}
            }
        });
// Table visualization option  - Pie chart table
        var taxTableOptions = new google.visualization.ChartWrapper({
            'chartType':'Table',
            'containerId':'tax_table_pie',
            'options':{ allowHtml:true, showRowNumber:true, width: '100%', page:'enable', pageSize:10, pagingSymbols:{prev:'prev', next:'next'}, sortColumn:2, sortAscending:false }
        });

// Draw the Dashboard for the pie chart
        new google.visualization.Dashboard(document.getElementById('tax_dashboard')).
        // Configure the string filter to affect the table contents
        bind(taxStringFilter, taxTableOptions).
        // Draw the dashboard
        draw(taxMatchesDataPieChart);
    }  //END function drawPhylumTable()

    function drawPhylumPieChart() {

        // Taxonomy top phylum table 2
        var taxMatchesData2 = new google.visualization.DataTable();
        taxMatchesData2.addColumn('string', 'Phylum');
        taxMatchesData2.addColumn('string', 'Domain');
        <c:choose>
        <c:when test="${model.run.releaseVersion == '1.0'}">taxMatchesData2.addColumn('number', 'Unique OTUs');
        taxMatchesData2.addColumn('number', '%');
        </c:when>
        <c:otherwise>taxMatchesData2.addColumn('number', 'Number of reads');
        taxMatchesData2.addColumn('number', '%');
        </c:otherwise>
        </c:choose>
        taxMatchesData2.addRows([
            <c:set var="addComma" value="false"/><c:forEach var="taxonomyData" items="${model.taxonomyAnalysisResult.taxonomyDataSet}" varStatus="status"><c:choose><c:when test="${addComma}">,
            </c:when><c:otherwise><c:set var="addComma" value="true"/></c:otherwise></c:choose>
            ['<div title="${taxonomyData.phylum}" class="_cc" style="background-color: #${taxonomyData.colorCode};"></div> ${taxonomyData.phylum}', '${taxonomyData.superKingdom}', ${taxonomyData.numberOfHits}, ${taxonomyData.percentage}]</c:forEach>
        ]);

        var options = {'title':'${phylumCompositionTitle}', 'titleTextStyle':{fontSize:12}, 'fontName':'"Arial"', 'colors':[${model.taxonomyAnalysisResult.colorCodeForPieChart}],
            //Krona style 'colors':['#d47f7f','#d1a575','#d4c97f','#99d47f','#7fd4a7','#7fc3d4','#7f8ad4','#a77fd4','#d47fd3','#d47faf','#ccc','#ccc','#ccc'],
            'height':299,
            'pieSliceTextStyle':{bold:true, color:'white'},
            'legend':'none',
            'chartArea':{left:20, top:30, width:"84%", height:"100%"},
            'pieSliceBorderColor':'none',
            'sliceVisibilityThreshold':${model.taxonomyAnalysisResult.sliceVisibilityThresholdNumerator / model.taxonomyAnalysisResult.sliceVisibilityThresholdDenominator}
        };

        // DATA taxonomy Pie+Bar chart Phylum
        var phylumBarChartPieChartData = new google.visualization.DataTable();
        phylumBarChartPieChartData.addColumn('string', 'Phylum');
        phylumBarChartPieChartData.addColumn('number', 'Match');
        phylumBarChartPieChartData.addRows([
            <c:set var="addComma" value="false"/><c:forEach var="taxonomyData" items="${model.taxonomyAnalysisResult.taxonomyDataSet}" varStatus="status"><c:choose><c:when test="${addComma}">,
            </c:when><c:otherwise><c:set var="addComma" value="true"/></c:otherwise></c:choose>
            ['${taxonomyData.phylum}', ${taxonomyData.numberOfHits}]</c:forEach>
        ]);
        var phylumPieChart = new google.visualization.PieChart(document.getElementById('tax_chart_pie_phy'));
        phylumPieChart.draw(phylumBarChartPieChartData, options);

//    var table = new google.visualization.Table(document.getElementById('table_div'));
//    table.draw(taxMatchesData2, { allowHtml:true, showRowNumber:true, page:'enable', pageSize:10, pagingSymbols:{prev:'prev', next:'next'}, sortColumn:2, sortAscending:false});

// When the table is selected, update the phylumPieChart.
//    google.visualization.events.addListener(table, 'select', function () {
//        phylumPieChart.setSelection(table.getSelection());
//    });

// When the phylumPieChart is selected, update the table visualization.
//    google.visualization.events.addListener(phylumPieChart, 'select', function () {
//        table.setSelection(phylumPieChart.getSelection());
//    });
    }
    //make the charts responsive
    $(window).resize(function(){
        drawDomainCompositionPieChartView();
        drawPhylumPieChart();
        drawPhylumTablePieChartView();
    });
</script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/export-button-menu.js"></script>