<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<jsp:include page="common/header.jsp" />

<div class="stitch-app-container">
    <div id="home-section">
        <jsp:include page="pages/home-content.jsp" />
    </div>

    <div id="loading-section" style="display: none;">
        <jsp:include page="pages/loading-content.jsp" />
    </div>

    <div id="result-section" style="display: none;">
        <jsp:include page="pages/result-content.jsp" />
    </div>
</div>

<jsp:include page="common/footer.jsp" />