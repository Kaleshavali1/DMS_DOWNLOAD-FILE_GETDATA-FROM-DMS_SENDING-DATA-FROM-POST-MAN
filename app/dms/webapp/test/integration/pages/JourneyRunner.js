sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"dms/dms/test/integration/pages/SalesOrdersList",
	"dms/dms/test/integration/pages/SalesOrdersObjectPage",
	"dms/dms/test/integration/pages/DocumentsObjectPage"
], function (JourneyRunner, SalesOrdersList, SalesOrdersObjectPage, DocumentsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('dms/dms') + '/test/flp.html#app-preview',
        pages: {
			onTheSalesOrdersList: SalesOrdersList,
			onTheSalesOrdersObjectPage: SalesOrdersObjectPage,
			onTheDocumentsObjectPage: DocumentsObjectPage
        },
        async: true
    });

    return runner;
});

