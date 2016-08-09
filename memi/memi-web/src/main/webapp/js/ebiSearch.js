/**
 * Created by maq on 06/04/2016.
 */

var HIDDEN_CLASS = "this_hide";
var FACET_SEPARATOR = "____";
var SEARCH_TAB_CLASS = "search-tab";
var BASE_URL = "https://wwwdev.ebi.ac.uk/ebisearch/ws/rest/";
var PROJECT = "Projects";
var SAMPLE = "Samples";
var RUN = "Runs";
var DATA_TYPES = [PROJECT, SAMPLE, RUN];
var FACET_SOURCE = "Source";

/*
Behaviour methods
 */

window.onunload = function(event) {
    console.log("Unloading");
    var searchElementID = "local-searchbox";
    var searchElement = document.getElementById(searchElementID);
    if (searchElement != null) {
        saveFormState();
    }
};

window.onload = function(event) {
    console.log("Loading");
    var searchElementID = "local-searchbox";
    var searchElement = document.getElementById(searchElementID);
    loadCss();
    restoreFormState();
};

var loadCss = function() {
    //load css for the modal box
    var linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "/metagenomics/css/ajax-modal.css";
    document.head.appendChild(linkElement);

}

/**
 * Creates table header cells and table row
 * @param columns
 * @param table
 */
var addTableHeader = function(columns, table) {
    tableHeadRow = document.createElement("tr");

    for (i in columns) {
        var column = columns[i];
        var tableCol = document.createElement("th");
        tableCol.innerHTML = column.name;
        if ("className" in column) {
            tableCol.className = column.className;
        }
        tableHeadRow.appendChild(tableCol);
    }

    tableHead = document.createElement("thead");
    tableHead.appendChild(tableHeadRow);
    table.appendChild(tableHead);
}

/**
 * Creates a data table row and table cells
 * @param columns
 * @param table
 */
var addTableRow = function(columns, table) {
    tableRow = document.createElement("tr");
    for (i in columns) {
        var column = columns[i];
        var tableCol = document.createElement("td");
        if ("className" in column) {
            tableCol.className = column.className;
        }
        if ("url" in column) {
            var link = document.createElement("a");
            link.href = column.url;
            link.innerHTML = column.name;
            tableCol.appendChild(link);
        } else {
            tableCol.innerHTML = column.name;
        }
        tableRow.appendChild(tableCol);
    }
    table.appendChild(tableRow);
};

var saveFormState = function() {
    var tabContainer = document.getElementById("searchTabs");
    if (tabContainer) {
        var selected = $(tabContainer).tabs('option', 'active');
        console.log("Saving state " + selected);
        sessionStorage.activeTab = selected;
    }
};

var restoreFormState = function() {
    var tabContainer = document.getElementById("searchTabs");
    if (tabContainer) {
        var selected = sessionStorage.activeTab;
        console.log("Loading state " + selected);
        if (selected) {
            var selected = $(tabContainer).tabs('option', 'active', selected);
        }
    }

};

var displayPagination = function(results, dataType) {
    console.log("Adding pagination for " + dataType);
    paginationContainer = document.getElementById(dataType + "-searchPagination");
    if (paginationContainer != null) {
        paginationContainer.innerHTML = "";
        var prevButton = document.createElement("input");
        prevButton.type = "button";
        prevButton.id = dataType + "-prevPage";
        prevButton.value = "Previous";

        if (projectSearchSettings.page <= 0 ) {
            prevButton.disabled = true;
        }
        prevButton.addEventListener('click', function(event) {
            var searchSetting = searchSettings[dataType];
            searchSetting.page--;
            prepareSearchSettings(false);
            runDomainSearch(searchSetting);
        });

        var nextButton = document.createElement("input");
        nextButton.type = "button";
        nextButton.id = dataType + "-nextPage";
        nextButton.value = "Next";
        var maxPage = Math.ceil(results.hitCount/projectSearchSettings.resultsNum);
        if ((projectSearchSettings.page+1) >= maxPage) {
            nextButton.disabled = true;
        }
        nextButton.addEventListener('click', function(event) {
            var searchSetting = searchSettings[dataType];
            searchSetting.page++;
            prepareSearchSettings(false);
            runDomainSearch(searchSetting);
        });

        var textSpan = document.createElement("span");
        textSpan.textContent = " Page " + (projectSearchSettings.page+1) + " of " + (maxPage) + " ";
        paginationContainer.appendChild(prevButton);
        paginationContainer.appendChild(textSpan);
        paginationContainer.appendChild(nextButton);
    } else {
        console.log("Error: Expected to find div with id '" + dataType + "-searchPagination'");
    }

};

var isFacetGroupHierarchical = function(facetGroup) {
    var isHierarchical = false;
    for (var i=0; i < facetGroup.facetValues.length; i++) {
        if (facetGroup.facetValues[i].hasOwnProperty("children")) {
            isHierarchical = true;
            break;
        }
    }
    return isHierarchical;
};

var displayFacetGroup = function(facetGroup, container, dataType, checkedFacets) {

    var facetGroupContainer = document.createElement("div");
    var groupContainerId = dataType + FACET_SEPARATOR + facetGroup.id;
    facetGroupContainer.id = groupContainerId;
    container.appendChild(facetGroupContainer);

    facetGroupTitle = document.createElement("h4");
    facetGroupTitle.innerHTML = facetGroup.label;
    facetGroupContainer.appendChild(facetGroupTitle);
    for (var i=0; i < facetGroup.facetValues.length; i++) {
        facet = facetGroup.facetValues[i];
        var identifier = dataType + FACET_SEPARATOR + facetGroup.id + FACET_SEPARATOR + facet.value;
        facetItem = document.createElement("div");
        facetInput = document.createElement("input");
        facetInput.id = identifier;
        facetInput.name = facetGroup.id;
        facetInput.form = "local-search";
        facetInput.type = "checkbox";
        facetInput.value = facet.value;
        if (checkedFacets != null && checkedFacets.indexOf(facetInput.value) >= 0) {
            facetInput.checked = true;
        }
        facetInput.addEventListener("change", function(event) {
            prepareSearchSettings(true);
            runDomainSearch(searchSettings[dataType]);
        });

        facetLabel = document.createElement("label");
        facetLabel.htmlFor = facetInput.id;
        facetLabel.innerHTML = facet.label + " (" + facet.count + ")";

        facetItem.appendChild(facetInput);
        facetItem.appendChild(facetLabel);

        facetContainerDiv = document.createElement("div");
        facetContainerDiv.className = "extra-pad";
        facetContainerDiv.appendChild(facetItem);

        facetGroupContainer.appendChild(facetContainerDiv);
    }
};

var displayHierarchicalFacetGroup = function(facetGroup, container, dataType, checkedFacets) {

    var facetGroupContainer = document.createElement("div");
    var groupContainerId = dataType + FACET_SEPARATOR + facetGroup.id;
    //facetGroupContainer.id = groupContainerId;
    container.appendChild(facetGroupContainer);

    facetGroupTitle = document.createElement("h4");
    facetGroupTitle.innerHTML = facetGroup.label;
    facetGroupContainer.appendChild(facetGroupTitle);

    var facetGroupList = document.createElement("ul");
    facetGroupList.id = groupContainerId;
    facetGroupContainer.appendChild(facetGroupList);
    for (var i=0; i < facetGroup.facetValues.length; i++) {
        facet = facetGroup.facetValues[i];
        var identifier = dataType + FACET_SEPARATOR + facetGroup.id + FACET_SEPARATOR + facet.value;
        facetItem = document.createElement("li");
        facetInput = document.createElement("input");
        facetInput.id = identifier;
        facetInput.name = facetGroup.id;
        facetInput.form = "local-search";
        facetInput.type = "checkbox";
        facetInput.value = facet.value;
        if (checkedFacets != null && checkedFacets.indexOf(facetInput.value) >= 0) {
            facetInput.checked = true;
        }
        facetInput.addEventListener("change", function(event) {
            prepareSearchSettings(true);
            runDomainSearch(searchSettings[dataType]);
        });

        facetItem.appendChild(facetInput);
        facetItem.appendChild(document.createTextNode(facet.label + " (" + facet.count + ")"));

        if (facet.children != null) {
            var facetChildList = document.createElement("ul");
            displayHierarchicalChildren(facetChildList, facet, facetGroup, dataType, facetInput.value, checkedFacets);
            facetItem.appendChild(facetChildList);
            //TODO MAQ this is a quick fix for a bug in hierarchical searches - Nicola will fix this soon
            facetGroupList.appendChild(facetItem);
        }
    }
    $("#"+groupContainerId).bonsai({
        checkboxes: true,
        handleDuplicateCheckboxes: true
    });

};

var displayHierarchicalChildren = function(container, facet, facetGroup, dataType, parentPath, checkedFacets) {
    var children = facet.children;
    console.log("Facet with children: " + children.length);
    for (var i = 0; i < children.length; i++) {
        var childFacet = children[i];
        console.log("Child facet: " + facetGroup.id + " name: " + childFacet.label);

        var value = parentPath + "/" + childFacet.value;
        var identifier = dataType + FACET_SEPARATOR + facetGroup.id + FACET_SEPARATOR + value;

        var facetItem = document.createElement("li");
        var facetInput = document.createElement("input");
        facetInput.id = identifier;
        facetInput.name = facetGroup.id;
        facetInput.form = "local-search";
        facetInput.type = "checkbox";
        facetInput.value = value;
        if (checkedFacets != null && checkedFacets.indexOf(facetInput.value) >= 0) {
            facetInput.checked = true;
        }
        facetInput.addEventListener("change", function(event) {
            prepareSearchSettings(true);
            runDomainSearch(searchSettings[dataType]);
        });

        facetItem.appendChild(facetInput);
        facetItem.appendChild(document.createTextNode(childFacet.label + " (" + childFacet.count + ")"));
        container.appendChild(facetItem);

        if (childFacet.children != null) {
            var facetChildList = document.createElement("ul");
            displayHierarchicalChildren(container, childFacet, facetGroup, dataType, facetInput.value, checkedFacets);
            facetItem.appendChild(facetChildList);
        }
    }
};

var displayFacets = function(facetGroups, dataType, checkedFacets) {
    var facetContainer = document.getElementById(dataType + "-searchFacets");
    if (facetContainer != null) {
        facetContainer.innerHTML = ""; //clear out old facets
        facetContainerTitle = document.createElement("h3");
        facetContainerTitle.innerHTML = "Filter your results";

        facetContainer.appendChild(facetContainerTitle);
        //TODO MAQ tidy this up later
        if (dataType == SAMPLE) {
            displaySampleRangeInputs(facetContainer);
        }
        for (var i =0; i < facetGroups.length; i++) {
            var facetGroup = facetGroups[i];
            if (facetGroup.label !== FACET_SOURCE) {
                if (isFacetGroupHierarchical(facetGroup)) {
                    displayHierarchicalFacetGroup(facetGroup, facetContainer, dataType, checkedFacets);
                    console.log("FacetGroup Hierarchical " + facetGroup.label);
                } else {
                    displayFacetGroup(facetGroup, facetContainer, dataType, checkedFacets);
                    console.log("FacetGroup " + facetGroup.label);
                }

            }
        }

        var searchInfoP = document.createElement("p");
        var searchInfoSmall = document.createElement("small");
        searchInfoSmall.className = "text-muted";
        searchInfoSmall.innerHTML = "Powered by ";
        searchInfoSmall.innerHTML += '<a href="http://www.ebi.ac.uk/ebisearch/" class="ext" target="_blank">EBI Search</a>';
        searchInfoP.appendChild(searchInfoSmall);
        facetContainer.appendChild(document.createElement("hr"));
        facetContainer.appendChild(searchInfoP);
    } else {
        console.log("Error: Expected to find div with id '" + dataType + "-searchFacets'");
    }
};

var displaySampleRangeInputs = function(container, dataType) {
    var rangeContainerDiv = document.createElement("div");
    container.appendChild(rangeContainerDiv);

    tempRangeTitle = document.createElement("h4");
    tempRangeTitle.innerHTML = "Temperature";
    rangeContainerDiv.appendChild(tempRangeTitle);

    tempInput = document.createElement("input");
    tempInput.type = "range";
    tempInput.setAttribute("multiple", "");
    tempInput.valueLow = 0;
    tempInput.valueHigh = 100;
    tempInput.setAttribute("value", "0,100");
    tempInput.id = dataType + FACET_SEPARATOR + "temperature";

    tempLabel = document.createElement("label");
    tempLabel.innerHTML = " °C";
    tempLabel.htmlFor = tempInput.id;
    rangeContainerDiv.appendChild(tempInput);
    rangeContainerDiv.appendChild(tempLabel);

    depthRangeTitle = document.createElement("h4");
    depthRangeTitle.innerHTML = "Depth";
    rangeContainerDiv.appendChild(depthRangeTitle);

    depthInput = document.createElement("input");
    depthInput.type = "range";
    depthInput.setAttribute("multiple", "");
    depthInput.valueLow = 0;
    depthInput.valueHigh = 100;
    depthInput.setAttribute("value", "0,100");
    depthInput.id = dataType + FACET_SEPARATOR + "depth";

    depthLabel = document.createElement("label");
    depthLabel.innerHTML = " m";
    depthLabel.htmlFor = depthInput.id;
    rangeContainerDiv.appendChild(depthInput);
    rangeContainerDiv.appendChild(depthLabel);


    phRangeTitle = document.createElement("h4");
    phRangeTitle.innerHTML = "pH";
    rangeContainerDiv.appendChild(phRangeTitle);

    phInput = document.createElement("input");
    phInput.type = "range";
    phInput.setAttribute("multiple", "");
    phInput.setAttribute("valueLow", "0");
    phInput.setAttribute("valueHigh", "14");
    phInput.setAttribute("value", "0,100"); //this seems to be a percentage
    phInput.id = dataType + FACET_SEPARATOR + "ph";

    phLabel = document.createElement("label");
    phLabel.innerHTML = " pH";
    phLabel.htmlFor = phInput.id;
    rangeContainerDiv.appendChild(phInput);
    rangeContainerDiv.appendChild(phLabel);

    multirange(tempInput);
    multirange(depthInput);
    multirange(phInput);
};

/**
 * Setup for project table
 * @param data
 * @param container
 */
var displayProjectTable = function(results, container) {
    console.log("Showing project data");

    table = document.createElement("table");
    table.border = 1;
    table.className = "table-light";

    var headerData = [
        {name: "Project"},
        {name: "Name"},
        {name: "Biome", className: "xs_hide"},
        {name: "Description", className: "xs_hide"}
    ];

    addTableHeader(headerData, table);

    for (var i=0; i < results.entries.length; i++) {
        var entry = results.entries[i];
        var rowData = [
            {
                name: entry["id"],
                url: "http://" + window.location.host + "/metagenomics/projects/" + entry["id"]
            },
            {name: entry.fields.name[0]},
            {name: entry.fields.biome_name[0], className: "xs_hide"},
            {name: entry.fields.description[0], className: "xs_hide"}
        ];
        addTableRow(rowData, table);
    }
    container.appendChild(table);
};

/**
 * Setup for sample table
 * @param results
 * @param container
 */
var displaySampleTable = function(results, container) {
    console.log("Showing sample data");
    table = document.createElement("table");
    table.border = 1;
    table.className = "table-light";

    var headerData = [
        {name: "Sample"},
        {name: "Project", className: "xs_hide"},
        {name: "Name"},
        {name: "Description", className: "xs_hide"},
    ];

    addTableHeader(headerData, table);

    for (var i=0; i < results.entries.length; i++) {
        var entry = results.entries[i];
        var rowData = [
            {
                name: entry["id"],
                url: "http://" + window.location.host + "/metagenomics/projects/" + entry["fields"]["METAGENOMICS_PROJECT"][0] + "/samples/" +  entry["id"]
            },
            {
                name: entry["fields"]["METAGENOMICS_PROJECT"][0],
                url: "http://" + window.location.host + "/metagenomics/projects/" + entry["fields"]["METAGENOMICS_PROJECT"][0]
            },
            {name: entry.fields.name[0]},
            {name: entry.fields.description[0], className: "xs_hide"}
        ];
        addTableRow(rowData, table);
    }
    container.appendChild(table);
};

/**
 * setup run table
 * @param results
 * @param container
 */
var displayRunTable = function(results, container) {
    console.log("Showing run data");
    table = document.createElement("table");
    table.border = 1;
    table.className = "table-light";

    var headerData = [
        {name: "Run"},
        {name: "Sample", className: "xs_hide"},
        {name: "Project", className: "xs_hide"},
        {name: "Experiment Type"},
        {name: "Pipeline Version", className: "xs_hide"},
    ];

    addTableHeader(headerData, table);

    for (var i=0; i < results.entries.length; i++) {
        var entry = results.entries[i];
        var rowData = [
            {
                name: entry.id,
                url: "http://" + window.location.host + "/metagenomics/projects/"
                + entry.fields.METAGENOMICS_PROJECT[0] + "/samples/"
                + entry.fields.METAGENOMICS_SAMPLE[0] + "/runs/"
                + entry.id + "/results/versions/"
                + entry.fields.pipeline_version[0]
            },
            {
                name: entry.fields.METAGENOMICS_SAMPLE[0],
                className: "xs_hide",
                url: "http://" + window.location.host + "/metagenomics/projects/"
                + entry.fields.METAGENOMICS_PROJECT[0] + "/samples/"
                + entry.fields.METAGENOMICS_SAMPLE[0],

            },
            {
                name: entry.fields.METAGENOMICS_PROJECT[0],
                className: "xs_hide",
                url: "http://" + window.location.host + "/metagenomics/projects/" + entry.fields.METAGENOMICS_PROJECT[0],
            },
            {
                name: entry.fields.experiment_type[0]
            },
            {
                name: entry.fields.pipeline_version[0],
                className: "xs_hide",
                url: "http://" + window.location.host + "/metagenomics/pipelines/" + entry.fields.pipeline_version[0],
            },

        ];
        addTableRow(rowData, table);
    }

    container.appendChild(table);
};

var displayProjectData = function(results) {
    resultsContainer = document.getElementById(PROJECT + "-searchData");
    if (resultsContainer != null) {
        resultsContainer.innerHTML = ""; //clear results div
        resultsTitle = document.createElement("h3");
        resultsTitle.innerHTML = "Showing " + results.entries.length
            + " out of " + results.hitCount + " results";
        resultsContainer.appendChild(resultsTitle);
        displayProjectTable(results, resultsContainer);
    } else {
        console.log("Error: Expected to find div with id '" + PROJECT + "-searchData'");
    }
};

var displaySampleData = function(results) {
    resultsContainer = document.getElementById(SAMPLE + "-searchData");
    if (resultsContainer != null) {
        resultsContainer.innerHTML = ""; //clear results div
        resultsTitle = document.createElement("h3");
        resultsTitle.innerHTML = "Showing " + results.entries.length
            + " out of " + results.hitCount + " results";
        resultsContainer.appendChild(resultsTitle);
        displaySampleTable(results, resultsContainer);
    } else {
        console.log("Error: Expected to find div with id '" + SAMPLE + "-searchData'");
    }
};

var displayRunData = function(results) {
    resultsContainer = document.getElementById(RUN + "-searchData");
    if (resultsContainer != null) {
        resultsContainer.innerHTML = ""; //clear results div
        resultsTitle = document.createElement("h3");
        resultsTitle.innerHTML = "Showing " + results.entries.length
            + " out of " + results.hitCount + " results";
        resultsContainer.appendChild(resultsTitle);
        displayRunTable(results, resultsContainer);
    } else {
        console.log("Error: Expected to find div with id '" + RUN + "-searchData'");
    }
};

var displayProjects = function(httpReq) {
    console.log("displayProjects");
    var resultString = httpReq.response;
    var results = JSON.parse(resultString);
    console.log("Search returned " + results.hitCount + " project results");
    setTabText(results.hitCount, PROJECT);
    displayProjectData(results);
    displayFacets(results.facets, PROJECT, null);
    displayPagination(results, PROJECT);
    reapplySearchSettings();
};

var displaySamples = function(httpReq) {
    console.log("displaySamples");
    var resultString = httpReq.response;
    var results = JSON.parse(resultString);
    console.log("Search returned " + results.hitCount + " sample results");
    setTabText(results.hitCount, SAMPLE);
    displaySampleData(results);
    displayFacets(results.facets, SAMPLE, null);
    displayPagination(results, SAMPLE);
    reapplySearchSettings();
};

var displayRuns = function(httpReq) {
    console.log("displayRuns");
    var resultString = httpReq.response;
    var results = JSON.parse(resultString);
    console.log("Search returned " + results.hitCount + " run results");
    setTabText(results.hitCount, RUN);
    displayRunData(results);
    displayFacets(results.facets, RUN, null);
    displayPagination(results, RUN);
    reapplySearchSettings();
};

var searchError = function(httpReq) {
    console.log("Error: Search error");
}

var runAjax = function(method, url, parameters, callback, errCallback) {
    var httpReq = new XMLHttpRequest();
    httpReq.open(method, url);
    httpReq.send(parameters);

    //handle response
    httpReq.onload = function(event) {
        var readyState = httpReq.readyState;
        callback(httpReq);
    };

    //error handling
    httpReq.onerror = function (event) {
        if (errCallback) {
            errCallback(httpReq);
        } else {
            console.log("Ajax error");
        }
    };
};

var parametersToString = function(parameters) {
    var parameterString = "?";
    var types = Object.keys(parameters);
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        var value = parameters[type];
        if (type === "facets") {
            var facetString = "";
            var facetTypes = Object.keys(value)
            for (var j=0; j < facetTypes.length; j++) {
                var facetType = facetTypes[j];
                var facetValues = value[facetType];
                for (var k = 0; k < facetValues.length; k++) {
                    var facetValue = facetValues[k];
                    facetString += facetType + ":" + facetValue + ",";
                }
                //remove final trailing comma ','
                facetString = facetString.substr(0, facetString.length - 1);
                parameterString += type + "=" + facetString + "&";
            }
        } else {
            parameterString += type + "=" + value + "&";
        }

    }
    //remove final trailing ampersand '&'
    parameterString = parameterString.substr(0, parameterString.length - 1);
    return parameterString;
}

var runDomainSearch = function(searchSettings) {
    console.log("Searchtext = " + searchSettings.searchText);
    if (searchSettings.searchText != null && searchSettings.searchText !== "") {
        //searchSettings.searchText = encodeURIComponent(searchSettings.searchText);
        searchSettings.searchText = searchSettings.searchText;
    } else {
        searchSettings.searchText = "domain_source:" + searchSettings.domain;
    }

    var parameters = {
        "query": searchSettings.searchText,
        "format": "json",
        "size": searchSettings.resultsNum,
        "start": searchSettings.page * searchSettings.resultsNum,
        "fields": searchSettings.fields,
        "facetcount": searchSettings.facetNum,
        "facetsdepth": 2
    };

    if (searchSettings.facets != null) {
        parameters.facets = searchSettings.facets;
    }

    //console.log("SEARCH: Size: " + parameters.size + " start = " + parameters.start);

    var paramFragment = parametersToString(parameters);
    var url = BASE_URL + searchSettings.domain + paramFragment;
    console.log("Running domain search = " + url);
    runAjax("GET", url, null, searchSettings.successCallback, searchSettings.errorCallback);
};

var runNewSearch = function() {
    
    for(var i=0; i < DATA_TYPES.length; i++) {
        var dataType = DATA_TYPES[i];
        var searchSetting = searchSettings[dataType];
        runDomainSearch(searchSetting);
    }

    //runDomainSearch(projectSearchSettings);
    //runDomainSearch(sampleSearchSettings);
    //runDomainSearch(runSearchSettings)
};

/**
 * Adds a jquery ui tab set to the supplied div
 * @param container
 * @param disabledList
 */
var setupJQueryTabs = function(container, disabledList) {
    selectedTab = 0;
    var children = container.getElementsByClassName(SEARCH_TAB_CLASS);

    for (var i=0; i < children.length; i++) {
        if (disabledList.indexOf(i) == -1) {
            selectedTab = i;
            break;
        }
    }

    $(container).tabs({
        disabled: disabledList,
        active: selectedTab
    });
};

var setTabText = function(hitCount, dataType, element) {
    var titleText = dataType.charAt(0).toUpperCase() + dataType.slice(1); //capitalise first letter
    if (hitCount != null) {
        titleText += " (" + hitCount + ")";
    }

    if (element == null) {
        element = document.getElementById(dataType + "-link");
    }

    if (element != null) {
        element.innerHTML = titleText;
    } else {
        console.log("Error: Expected to find element with id '" + dataType+"-link'")
    }

};

/**
 * displays a set of tabs based on the datatypes property of the data
 * @param data
 * @returns {Element}
 */
var displayTabHeader = function() {
    var tabContainer = document.getElementById("searchTabs");
    if (tabContainer != null) {
        var tabList = tabContainer.getElementsByTagName("ul");
        if (tabList == null || tabList.length <= 0) {
            tabList = document.createElement("ul");

            var disabledList = [];
            for (i in DATA_TYPES) {
                var dataType = DATA_TYPES[i];
                var tabItem = document.createElement("li");
                tabItem.className = SEARCH_TAB_CLASS;
                var tabLink = document.createElement("a");
                tabLink.id = dataType + "-link";
                tabLink.value = dataType;
                tabLink.href = "#" + dataType;
                setTabText(null, dataType, tabLink);

                /*
                if (data != null && data[dataType].numberOfHits == 0) {
                    disabledList.push(parseInt(i));
                }
                */
                tabItem.appendChild(tabLink)
                tabList.appendChild(tabItem);
            }
            tabContainer.insertBefore(tabList, document.getElementById("tabDiv"));
            setupJQueryTabs(tabContainer, disabledList);
        } else {
            console.log("Tabs already exist");
        }

    } else {
        console.log("Expected to find div with id 'searchTabs'");
    }
    return tabContainer;
};

var prepareSearchSettings = function(resetPage) {
    var searchElementID = "local-searchbox";
    var searchElement = document.getElementById(searchElementID);
    var searchText = "";
    if (searchElement) {
        searchText = searchElement.value;
        for(var i=0; i < DATA_TYPES.length; i++) {
            var dataType = DATA_TYPES[i];
            var searchSetting = searchSettings[dataType];
            searchSetting.searchText = searchText;
            var facetContainer = document.getElementById(dataType + "-searchFacets");
            if (facetContainer != null) {
                var facets = {};
                var facetElements = facetContainer.getElementsByTagName("input");
                for (var j=0; j < facetElements.length; j++) {
                    var facetElement = facetElements[j];
                    if (facetElement.checked) {
                        var type = facetElement.name;
                        var value = facetElement.value;
                        if (!facets.hasOwnProperty(type)) {
                            facets[type] = [];
                        }
                        facets[type].push(value);
                    }
                }
                searchSetting.facets = facets;
            } else {
                console.log("Error: Expected to find div " + dataType + "-searchFacets");
            }
            if (resetPage) {
                searchSetting.page = 0;
            }
        }
    } else {
        console.log("Error: Expected to find text input element " + searchElementID);
    }
    return searchText;
};

var reapplySearchSettings = function(searchText) {
    var searchElementID = "local-searchbox";
    var searchElement = document.getElementById(searchElementID);
    if (searchElement) {
        if (searchText != null) {
            searchElement.value = searchText;
        }

        for(var i=0; i < DATA_TYPES.length; i++) {
            var dataType = DATA_TYPES[i];
            var searchSetting = searchSettings[dataType];
            var facetContainer = document.getElementById(dataType + "-searchFacets");
            if (facetContainer != null) {

                if (searchSetting.facets != null) {
                    var facets = searchSetting.facets;
                    var facetTypes = Object.keys(facets);
                    for(var j=0; j < facetTypes.length; j++) {
                        var facetType = facetTypes[j];
                        var facetValues = facets[facetType];
                        for (var k=0; k < facetValues.length; k++) {
                            var facetValue = facetValues[k];
                            var inputId = dataType + FACET_SEPARATOR + facetType + FACET_SEPARATOR + facetValue;
                            var inputElement = document.getElementById(inputId);
                            if (inputElement != null) {
                                inputElement.checked = true;
                            } else {
                                console.log("Error: Failed to find input with ID " + inputId);
                            }
                        }
                        console.log("Facet " + facetType);
                    }
                }
            }
        }
    } else {
        console.log("Error: Expected to find text input element " + searchElementID);
    }

};

/**
 * Main page setup. Calls Metagenomics server to get header, footer etc
 * and then then populates search tabs with results
 */
var search = function search() {
    var searchText = prepareSearchSettings(true);
    runAjax("GET", "search", null, function(httpReq) {
        var response = httpReq.response;
        console.log("Loading search template");
        document.documentElement.innerHTML = response;
        loadCss();
        reapplySearchSettings(searchText);
        displayTabHeader();
        runNewSearch();
    }, function(httpReq) {
        console.log("Error: Failed to load page template");
    });
};

var PROJECT_RESULTS_NUM = 10;
var SAMPLE_RESULTS_NUM = 10;
var RUN_RESULTS_NUM = 20;
var DEFAULT_SEARCH_START = 0;
var FACET_NUM = 10;

//need to define these objects after definition of callback functions
var projectSearchSettings = {
    type: PROJECT,
    resultsNum: PROJECT_RESULTS_NUM,
    page: DEFAULT_SEARCH_START,
    facetNum: FACET_NUM,
    searchText: "",
    facets: null,
    domain: "metagenomics_projects",
    fields: "id,name,description,biome_name,METAGENOMICS_SAMPLE",
    successCallback: displayProjects,
    errorCallback: searchError
};

var sampleSearchSettings = {
    type: SAMPLE,
    resultsNum: SAMPLE_RESULTS_NUM,
    page: DEFAULT_SEARCH_START,
    facetNum: FACET_NUM,
    searchText: "",
    facets: null,
    domain: "metagenomics_samples",
    fields: "id,name,description,experiment_type,METAGENOMICS_PROJECT",
    successCallback: displaySamples,
    errorCallback: searchError
};

var runSearchSettings = {
    type: RUN,
    resultsNum: RUN_RESULTS_NUM,
    page: DEFAULT_SEARCH_START,
    facetNum: FACET_NUM,
    searchText: "",
    facets: null,
    domain: "metagenomics_runs",
    fields: "id,experiment_type,pipeline_version,METAGENOMICS_SAMPLE,METAGENOMICS_PROJECT",
    successCallback: displayRuns,
    errorCallback: searchError
};

var searchSettings = {};
searchSettings[PROJECT] = projectSearchSettings;
searchSettings[SAMPLE] = sampleSearchSettings;
searchSettings[RUN] = runSearchSettings;
