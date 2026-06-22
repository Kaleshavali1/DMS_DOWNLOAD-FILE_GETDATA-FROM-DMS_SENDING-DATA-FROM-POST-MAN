using { sales.db } from '../db/datamodel';
 //using { Attachments } from '@cap-js/sdm';
// extend db.SalesOrders with {
//  attachment : Composition of many Attachments
// }

service PracticeDMS {
    // extend db.SalesOrders with { attachment: Composition of many Attachments }

entity SalesOrders @(odata.draft.enabled:true)  as projection on db.SalesOrders{
       *,
         Items,
             Documents
               // attachment
};
 entity Documents as projection on db.Documents{
    *,
    virtual downloadLink : String
};
    entity SalesOrderItems   as projection on db.SalesOrderItems;
 //function getExistingFiles() returns array of FileMeta;
    function getDmsFiles() returns array of DmsFile;
    action getDmsFile() returns Boolean;
     @Core.MediaType: 'application/pdf'
    action downloadFile(Id : String) returns Binary;
    //  type FileResponse {
    // url          : String;
    // content      : LargeBinary
    //  }
//     type FileResponse {
//     fileName : String;
//     mimeType : String;
//     content  : String; // base64
// }
 action uploadAttachment(
        salesOrderId: String,
        fileName     : String,
        mimeType     : String,
        fileContent  : LargeString
    ) returns String;

type DmsFile {
    objectId : String;
    fileName : String;
    mimeType : String;
    url      : String;
}
//  type FileMeta {
//     objectId   : String;
//     fileName   : String;
//     mimeType   : String;
// }
    // action uploadPDF(file: LargeString,docId: UUID) returns String;
    // action downloadPDF(docId: UUID) returns LargeString;

}

// using { sales.db } from '../db/SalesOrder';

// service SO_DMS {

//     entity SalesOrders @(odata.draft.enabled:true)
//         as projection on db.SalesOrders {
//             *,
//             Items,
//             Documents
//         };

//     entity SalesOrderItems
//         as projection on db.SalesOrderItems;

//     // entity Documents
//     //     as projection on db.Documents;
//     entity Documents as projection on db.Documents {
//     *,
//     virtual downloadLink : String
// }
//     action downloadDocument(
//         documentId : UUID
//     ) returns LargeBinary;
// }