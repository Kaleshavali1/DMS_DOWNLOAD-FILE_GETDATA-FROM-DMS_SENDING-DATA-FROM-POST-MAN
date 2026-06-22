using PracticeDMS as service from '../../srv/service';
annotate service.SalesOrders with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'salesOrderNo',
                Value : salesOrderNo,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CustomerID',
                Value : CustomerID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CustomerName',
                Value : CustomerName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'OrderDate',
                Value : OrderDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Status',
                Value : Status,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'DMS Documents',
            Target : 'Documents/@UI.LineItem',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Sales Order Items',
            Target : 'Items/@UI.LineItem',
        }
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'salesOrderNo',
            Value : salesOrderNo,
        },
        {
            $Type : 'UI.DataField',
            Label : 'CustomerID',
            Value : CustomerID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'CustomerName',
            Value : CustomerName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'OrderDate',
            Value : OrderDate,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Status',
            Value : Status,
        },
    ],
);

annotate service.Documents with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataFieldWithUrl',
            Label : 'fileName',
            Value : fileName,
            Url : Url,
        },
        
        {
            $Type : 'UI.DataField',
            Label : 'mimeType',
            Value : mimeType,
        },
        {
            $Type : 'UI.DataField',
            Label : 'objectId',
            Value : objectId,
        },
         {
            $Type : 'UI.DataFieldForAction',
            Action : 'PracticeDMS.EntityContainer/downloadFile',
            Label : 'Download'
        },
        {
            $Type: 'UI.DataFieldForAction',
            Action: 'PracticeDMS.EntityContainer/getDmsFile',
            Label: 'Fetch DMS Files',
            Criticality : 2,
            Inline:true,
        },
        {

    $Type : 'UI.DataFieldWithUrl',
    Label : 'Download',
    Value : fileName,
    Url : downloadLink

        }
    ],
);

annotate service.SalesOrderItems with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'ProductID',
            Value : ProductID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'ProductName',
            Value : ProductName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Quantity',
            Value : Quantity,
        },
        {
            $Type : 'UI.DataField',
            Label : 'UnitPrice',
            Value : UnitPrice,
        },
        {
            $Type : 'UI.DataField',
            Label : 'NetAmount',
            Value : NetAmount,
        }
    ],
);
