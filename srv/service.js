// const cds = require("@sap/cds");
// const axios = require("axios");


// module.exports = cds.service.impl(function () {

//     const REPOSITORY_ID =
//         "7ec79ee1-5dd7-4460-9a02-5c5da5c8f6d5";
        
//         this.on("downloadDocument", async (req) => {

//         const { documentId } = req.data;

//         const doc = await SELECT.one
//             .from("sales.db.Documents")
//             .where({ id: documentId });

//         if (!doc) {
//             req.reject(404, "Document not found");
//         }

//          const token = await getDMSToken();

//         const response = await axios.get(
//             doc.downloadUrl,
//             {
//                 responseType: "arraybuffer",
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             }
//         );

//         return response.data;
//     });
// this.after("READ", "Documents", docs => {

//     docs.forEach(doc => {

//         doc.downloadLink =
//             `/odata/v4/SO_DMS/downloadDocument(documentId=${doc.id})`;

//     });

// });


//     // this.on("downloadDocument", async (req) => {

//     //     const { objectId } = req.data;

//     //     const token = await getDMSToken();

//     //     const url =
//     //         `https://api-sdm-di.cfapps.us10.hana.ondemand.com/browser/${REPOSITORY_ID}/root`
//     //         + `?objectId=${objectId}&cmisselector=content`;

//     //     const response = await axios.get(url, {
//     //         responseType: "arraybuffer",
//     //         headers: {
//     //             Authorization: `Bearer ${token}`
//     //         }
//     //     });

//     //     const doc =
//     //         await SELECT.one
//     //             .from("SO_DMS.Documents")
//     //             .where({ objectId });

//     //     return {
//     //         fileName: doc.fileName,
//     //         content: response.data
//     //     };
//     // });
//     // this.on("testDownload", async () => {
//     // console.log("ACTION HIT");
//     // return "WORKING";
// //});

// });


// async function getDMSToken() {

//     const response = await axios.post(
//         "https://build-ai-subaccount.authentication.us10.hana.ondemand.com/oauth/token",
//         "grant_type=client_credentials",
//         {
//             auth: {
//                 username:
//                     "sb-3f7de9f0-5736-445f-9a67-81d56801aaf7!b511955|sdm-di-DocumentManagement-sdm_integration!b6332",
//                 password:
//                     "f27c3377-1018-4d02-b776-c98879742480$GnsdeMTSlGKPjysyDHel7dC0cL8TLv9TfHPIlEnklK8="
//             },
//             headers: {
//                 "Content-Type":
//                     "application/x-www-form-urlencoded"
//             }
//         }
//     );

//     return response.data.access_token;
// }

// const cds = require('@sap/cds');
// const axios = require('axios');
// // const cov2ap = require('@cap-js-community/odata-v2-adapter');

// // cds.on('bootstrap', (app) => {
// //     app.use(cov2ap());
// // });

// module.exports = cds.service.impl(function () {

//     const DMS_URL =
//         'https://api-sdm-di.cfapps.us10.hana.ondemand.com';

//     const REPOSITORY_ID =
//         process.env.REPOSITORY_ID;

//     this.on('downloadDocument', async (req) => {

//         const { objectId } = req.data;

//         console.log("DOWNLOAD REQUEST");
//         console.log("Object ID :", objectId);

//         const token = await getDMSToken();

//         const url =
//             `${DMS_URL}/browser/${REPOSITORY_ID}/root`
//             + `?objectId=${objectId}`
//             + `&cmisselector=content`;

//         const response = await axios.get(url, {
//             responseType: 'arraybuffer',
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         });

//         return {
//             fileName: "document.pdf",
//             content: response.data
//         };
//     });

//     async function getDMSToken() {

//         const response = await axios.post(
//             'https://build-ai-subaccount.authentication.us10.hana.ondemand.com/oauth/token',
//             'grant_type=client_credentials',
//             {
//                 auth: {
//                     username:
//                         'sb-3f7de9f0-5736-445f-9a67-81d56801aaf7!b511955|sdm-di-DocumentManagement-sdm_integration!b6332',
//                     password:
//                         'f27c3377-1018-4d02-b776-c98879742480$GnsdeMTSlGKPjysyDHel7dC0cL8TLv9TfHPIlEnklK8='
//                 },
//                 headers: {
//                     'Content-Type':
//                         'application/x-www-form-urlencoded'
//                 }
//             }
//         );

//         return response.data.access_token;
//     }

// });

const cds = require('@sap/cds');

const axios = require('axios');

module.exports = cds.service.impl(function () {
    const { SalesOrders, Documents} = this.entities;
    const DMS_URL =
    'https://api-sdm-di.cfapps.us10.hana.ondemand.com';
 
  const REPOSITORY_ID =
    process.env.REPOSITORY_ID;

    this.on('getExistingFiles', async (req) => {
        const repositoryId = process.env.REPOSITORY_ID;

        const sdm = await cds.connect.to('sdm');
        const dest = await sdm.getDestination();

        const url = `${dest.url}/browser/${repositoryId}/root`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${dest.authTokens[0].value}`
            }
        });

        const objects = response.data.objects || [];

        return objects.map(obj => ({
            objectId: obj.object.properties['cmis:objectId'].value,
            fileName: obj.object.properties['cmis:name'].value,
            mimeType: obj.object.properties['cmis:contentStreamMimeType']?.value
        }));

    })



this.after("READ", "Documents", docs => {

    if (!Array.isArray(docs)) {
        docs = [docs];
    }

    docs.forEach(doc => {

        doc.downloadLink =
            `/download/${doc.id}`;

    });

});


    this.on('getDmsFiles', async () => {
 console.log("DMS CALLED");
        const repositoryId = process.env.REPOSITORY_ID;

        const token = await getDMSToken();

        const url = `https://api-sdm-di.cfapps.us10.hana.ondemand.com/browser/${repositoryId}/root`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const objects = response.data.objects || [];

         const mappedData = objects.map(obj => ({
            objectId: obj.object.properties['cmis:objectId'].value,
            fileName: obj.object.properties['cmis:name'].value,
            mimeType: obj.object.properties['cmis:contentStreamMimeType']?.value,
            url: `https://api-sdm-di.cfapps.us10.hana.ondemand.com/browser/${repositoryId}/root`
            + `?objectId=${obj.object.properties['cmis:objectId'].value}&cmisselector=content`
        }));
        await cds.run(
    INSERT.into('Documents').entries(mappedData)
);
        return mappedData;

    });



     this.on('getDmsFile', async (req) => {
      // const so = await SELECT.one.from(SalesOrders).where({ ID: req.data.id });

 console.log("DMS CALLED");
        const repositoryId = process.env.REPOSITORY_ID;

        const token = await getDMSToken();

        const url = `https://api-sdm-di.cfapps.us10.hana.ondemand.com/browser/${repositoryId}/root`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const objects = response.data.objects || [];

         const mappedData = objects.map(obj => ({
            // parent: so.id,
            objectId: obj.object.properties['cmis:objectId'].value,
            fileName: obj.object.properties['cmis:name'].value,
            mimeType: obj.object.properties['cmis:contentStreamMimeType']?.value,
            url: `https://api-sdm-di.cfapps.us10.hana.ondemand.com/browser/${repositoryId}/root`
            + `?objectId=${obj.object.properties['cmis:objectId'].value}&cmisselector=content`
        }));
        await cds.run(
    INSERT.into('Documents').entries(mappedData)
);
        return true;

    });
    this.on('downloadFile', async (req) => {
        try{
 console.log("DOWNLOAD CALLED"); // IMPORTANT TEST
    const { Id } = req.data;
console.log("File ID:", Id + req.data); // IMPORTANT TEST
    const repositoryId = process.env.REPOSITORY_ID;

    const token = await getDMSToken();

    const url =
        `https://api-sdm-di.cfapps.us10.hana.ondemand.com/browser/${repositoryId}/root`
        + `?objectId=${Id}&cmisselector=content`;

    const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

     // ✅ OPTION 1: Save to local system
    const filePath = path.join(__dirname, `file_${Id}.pdf`);
    fs.writeFileSync(filePath, response.data);

    console.log("File saved locally:", filePath);

    // ✅ OPTION 2: Trigger browser download
    const res1 = req._.res;
    const doc = SELECT.one.from(Documents).where({ objectId: Id });
 
    res1.setHeader(
    "Content-Type", doc.mimeType||"application/octet-stream"
);

res1.setHeader(
    "Content-Disposition",
    `attachment; filename="${doc.fileName || "file.pdf"}"`
);
res1.send(response.data);
//return res1.end(Buffer.from(response.data)); 
//const base64 = Buffer.from(response.data).toString('base64');

// return {
//     fileName: "file.pdf",
//     mimeType: "application/pdf",
//     content: base64
// };
        }catch(error){
            console.error("Error downloading file:", error.response?.data || error.message);
            req.error(500, `Failed to download file: ${error.response?.data?.message || error.message}`);
        }
// const data = await pdf(response.data);

// return {
//   text: data.text
// };

    // return {
    //     url: url,
    //     content: response.data
    // };
});

    this.on('uploadAttachment', async (req) => {
   console.log("UPLOAD CALLED");
    const {
       salesOrderId,
      fileName,
      mimeType,
      fileContent
    } = req.data;
 console.log(req.data.salesOrderId + " " + req.data.fileName + " " + req.data.mimeType + " " + req.data.fileContent.length);
    const salesOrder =
      await SELECT.one
        .from(SalesOrders)
        .where({ ID: req.data.salesOrderId });
 
    if (!salesOrder) {
      req.reject(
        404,
        'Sales Order not found'
      );
    }
 
    const token =
      await getDMSToken();
 
    const buffer =
      Buffer.from(
        fileContent,
        'base64'
      );
 
    const form =
      new FormData();
 
    form.append('cmisaction', 'createDocument');
 
    form.append('propertyId[0]', 'cmis:name');
    form.append('propertyValue[0]', fileName);
 
    form.append('propertyId[1]', 'cmis:objectTypeId');
    form.append('propertyValue[1]', 'cmis:document');
 
    form.append('filename', fileName);
    form.append('_charset', 'UTF-8');
 
    form.append('media', buffer, {
    filename: fileName,
    contentType: mimeType
    });
 
    const response =
      await axios.post(
        `https://api-sdm-di.cfapps.us10.hana.ondemand.com/browser/7ec79ee1-5dd7-4460-9a02-5c5da5c8f6d5/root`,
        form,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            ...form.getHeaders()
          }
        }
      );
    console.log('File Name:', fileName);
    console.log('Mime Type:', mimeType);
    console.log('Base64 Length:', fileContent.length);
    console.log('Buffer Length:', buffer.length);
    const objectId =
      response.data.properties[
        'cmis:objectId'
      ].value;
 
    await UPDATE(SalesOrders)
      .set({
        fileName,
        mimeType,
        objectId,
        repositoryId:
          REPOSITORY_ID,
        uploadedAt:
          new Date(),
        uploadedBy:
          req.user.id
      })
      .where({
        ID: salesOrderId
      });
 
    return objectId;
  });

//   async function getDMSToken() {
 
//   const response =
//     await axios.post(
//       'https://build-ai-subaccount.authentication.us10.hana.ondemand.com/oauth/token',
//       'grant_type=client_credentials',
//       {
//         auth: {
//           username:
//             'sb-3f7de9f0-5736-445f-9a67-81d56801aaf7!b511955|sdm-di-DocumentManagement-sdm_integration!b6332',
//           password:
//             'f27c3377-1018-4d02-b776-c98879742480$GnsdeMTSlGKPjysyDHel7dC0cL8TLv9TfHPIlEnklK8='
//         },
//         headers: {
//           'Content-Type':
//             'application/x-www-form-urlencoded'
//         }
//       }
//     );
 
//   return response.data.access_token;


// }
});


  async function getDMSToken() {
 
  const response =
    await axios.post(
      'https://build-ai-subaccount.authentication.us10.hana.ondemand.com/oauth/token',
      'grant_type=client_credentials',
      {
        auth: {
          username:
            process.env.USERNAME,
          password:
            process.env.PASSWORD
        },
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded'
        }
      }
    );
 
  return response.data.access_token;


}
    // srv.on("downloadPDF", async (req) => {

    //     const {bookId} = req.data;

    //     const repoId = "3f89ff67-c374-453b-832d-8580cc8aae0b";
 
    //     //fetch the dms objectid from the database

    //     const book = await SELECT.one.from('Books').where({ ID: bookId });

    //     if(!book || !book.dmsObjectId){

    //         return req.error(404, "No document found for this book.");

    //     }

    //     const objectId = book.dmsObjectId;
 
    //     const sdm = cds.env.requires["documentrepository-cs"].credentials;

    //     const tokenUrl = sdm.uaa ? `${sdm.uaa.url}/oauth/token` : sdm.tokenurl;

    //     const baseUrl = sdm.endpoints.ecmservice.url.replace(/\/$/,"");
 
    //     //Get Access Token

    //     const tokenResponse = await axios.post(tokenUrl, "grant_type=client_credentials",{

    //     auth:{

    //         username: sdm.uaa?.clientid || sdm.clientid,

    //         password: sdm.uaa?.clientsecret || sdm.clientsecret

    //     },

    //     headers: { "Content-Type": "application/x-www-form-urlencoded"}

    //     });

    //     const accessToken = tokenResponse.data.access_token;
 
    //     const downloadURL = `${baseUrl}/browser/${repoId}/root?cmisselector=content&objectId=${objectId}`;
 
    //     try{

    //         const downloadResponse = await axios.get(downloadURL, { 

    //             headers: { 

    //                 Authorization: `Bearer ${accessToken}` 

    //             },

    //             responseType: "arraybuffer"

    //         });

    //         //convert the binary arraybuffer to a base64 string

    //         const base64File = Buffer.from(downloadResponse.data, "binary").toString("base64");

    //         return base64File;

    //     } catch(error){

    //         console.error("DMS download Error Detail:", error.response?.data);

    //         req.error(500,`DMS Download Failed: ${error.message}`);

    //     }

    // });
 
    // srv.on("uploadPDF", async(req) => {

    //     const repoId = "4f662514-95b6-47be-8c8b-dcbc02db45db";

    //     const fileName = `generatedFile_${Date.now()}.pdf`;

    //     const fileBuffer = Buffer.from(req.data.file, "base64");
 
    //     const sdm = cds.env.requires["DMS_Instance"].credentials;

    //     const tokenUrl = sdm.uaa ? `${sdm.uaa.url}/oauth/token` : sdm.tokenurl;

    //     const baseUrl = sdm.endpoints.ecmservice.url.replace(/\/$/,"");
 
    //     //Get Access Token

    //     const tokenResponse = await axios.post(tokenUrl, "grant_type=client_credentials",{

    //     auth:{

    //         username: sdm.uaa?.clientid || sdm.clientid,

    //         password: sdm.uaa?.clientsecret || sdm.clientsecret

    //     },

        // headers: { "Content-Type": "application/x-www-form-urlencoded"}

        // });

        // const accessToken = tokenResponse.data.access_token;
 
        // const form = new FormData();

        // form.append("cmisaction", "createDocument");

        // form.append("propertyId[0]", "cmis:objectTypeId");

        // form.append("propertyValue[0]", "cmis:document");

        // form.append("propertyId[1]", "cmis:name");

        // form.append("propertyValue[1]", fileName);    

        // form.append("propertyId[2]", "sap:tags");

        // form.append("propertyValue[2]", "Claim PDF");

        // form.append("major","true");
 
        // form.append("content", fileBuffer, {

        //     filename: fileName,

        //     contentType:"application/pdf"

        // });
 
    //     const uploadUrl = `${baseUrl}/browser/${repoId}/root/`;

    //     try{

    //         const uploadResponse = await axios.post(uploadUrl, form, {

    //             headers: {

    //                 ...form.getHeaders(),

    //                 Authorization: `Bearer ${accessToken}`,

    //                 Accept: "application/json"

    //             }

    //         });

    //         const dmsInfo = uploadResponse.data;

    //         const objectId = dmsInfo.properties['cmis:objectId'].value;
 
    //         await UPDATE('Books').set({ dmsObjectId: objectId }).where({ ID: req.data.bookId });
 
    //         const downloadLink = `${baseUrl}/browser/${repoId}/root?cmisselector=content&objectId=${objectId}`;

    //         console.log("File Uploaded Successfully. Download URL Generated.");
 
    //         return {

    //             success: true,

    //             objectId: objectId,

    //             fileName:fileName,

    //             downloadURL: downloadLink

    //         }

    //     }

    //     catch(error){

    //         console.error("DMS Error Detail: ", error.response?.data);

    //         req.error(500,`DMS Upload Failed: ${error.response?.data?.message || error.message}`);

    //     }
 
    // });
 
    // srv.on('readInvoiceNumber', async (req)=> {

    //     try{

    //         const salesOrderID = req.data.salesOrderID || 0;

    //         const { apiSalesOrderSrv } = require('../srv/generated/API_SALES_ORDER_SRV');

    //         const { salesOrderItemApi } = apiSalesOrderSrv();

    //         const sdkDest = {

    //             url:'https://sandbox.api.sap.com/s4hanacloud',

    //             headers: {

    //                 'APIKey' : 'rCb35clmlROkCrNkO00HSZrEvnPfvDxp'

    //             }

    //         };
 
    //         const salesOrderData = await salesOrderItemApi

    //             .requestBuilder()

    //             .getAll()

    //             .select(

    //                 salesOrderItemApi.schema.SALES_ORDER,

    //                 salesOrderItemApi.schema.SALES_ORDER_ITEM,

    //                 salesOrderItemApi.schema.REQUESTED_QUANTITY,

    //                 salesOrderItemApi.schema.REQUESTED_QUANTITY_UNIT

    //             )

    //             .filter(salesOrderItemApi.schema.SALES_ORDER.equals(salesOrderID))

    //             .execute(sdkDest)

    //             .catch(err => {

    //                 console.log('Root cause:',err.rootCause?.message);

    //                 console.log('Response body:',err.rootCause?.response?.data);

    //                 return {};

    //             });
 
    //             console.log('Reading Invoice Successful');
 
    //             var salesOrderArray = [];

    //             if(salesOrderData.length !== 0){

    //                 for(let i = 0; i<salesOrderData.length;i++){

    //                     const serializedData = entitySerializer(salesOrderItemApi.deSerializers)

    //                     .serializeEntity(salesOrderData[i], salesOrderItemApi);

    //                     salesOrderArray.push(serializedData);

    //                 }

    //             } 

    //             return salesOrderArray;

    //     }catch (err){

    //         return err;

    //     }

    // });


 