<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<div id="content">
    <h2>Overview about all studies</h2>

    <div align="center">
        <table border="0" style="border-width: 1px;border-color: #000000;border-style: solid;">
            <form:form method="POST" action="${baseURL}/listStudies/doSearch" commandName="studyFilter">
                <tr>
                    <td>Text:</td>
                    <td><form:input id="autocomplete" path="searchTerm"/></td>
                    <td><form:errors path="searchTerm" cssClass="error"/></td>
                </tr>
                <tr>
                    <td>Study type:</td>
                    <td>
                        <form:select path="studyType">
                            <form:option value="All" label="All"/>
                            <form:options items="${mgModel.studyTypes}"/>
                        </form:select>
                    </td>
                </tr>
                <tr>
                    <td>Analysis status:</td>
                    <td><form:select id="studyStatus" path="studyStatus">
                        <form:option value="All" label="All"/>
                        <form:options items="${mgModel.studyStatusList}"/>
                    </form:select></td>
                </tr>
                <c:if test="${not empty mgModel.submitter}">
                    <tr>
                        <td>Privacy:</td>
                        <td><form:select id="studyVisibility" path="studyVisibility">
                            <form:options items="${mgModel.studyVisibilityList}"/>
                        </form:select></td>
                    </tr>
                </c:if>
                <tr>
                    <td></td>
                    <td></td>
                    <td>
                        <input type="submit" value="Search"/>
                    </td>
                </tr>
            </form:form>
        </table>
    </div>
    <div style="margin-top:40px"></div>
    <div align="left">
        <a href="<c:url value="${baseURL}/listStudies/exportStudies"/>">Export to CSV</a>
    </div>

    <table border="1" width="95%">
        <tr>
            <th>Study type</th>
            <th>Study Id</th>
            <th>Study name</th>
            <th>Received date</th>
            <c:if test="${not empty mgModel.submitter}">
                <th>Privacy</th>
            </c:if>
            <th>Analysis status</th>
            <th>Experimental factor</th>
            <th>NCBI Project Id</th>
        </tr>
        <c:forEach var="study" items="${mgModel.studies}" varStatus="status">
            <tr>
                <td>${study.studyType}</td>
                <td>${study.studyId}</td>
                <td>
                    <a href="<c:url value="${baseURL}/studyOverview/${study.studyId}"/>">${study.studyName}</a>
                </td>
                <td>${study.formattedLastReceived}</td>
                <c:if test="${not empty mgModel.submitter}">
                    <td>${study.privacy}</td>
                </c:if>
                <td>${study.studyStatus}</td>
                <td>${study.experimentalFactor}</td>
                <td>${study.ncbiProjectId}</td>
            </tr>
        </c:forEach>
    </table>
</div>