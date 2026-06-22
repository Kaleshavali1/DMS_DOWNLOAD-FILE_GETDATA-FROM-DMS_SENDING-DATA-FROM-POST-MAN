namespace sales.db;

using {
    
    managed,
    cuid
} from '@sap/cds/common';


entity SalesOrders : cuid, managed {

    salesOrderNo   : String(20);
    CustomerID     : String(20);
    CustomerName   : String(100);
    OrderDate      : Date;
    Status         : String(20);


    Items : Composition of many SalesOrderItems
              on Items.smallid = $self;

    Documents : Composition of many Documents
              on Documents.salesOrder = $self;
}
entity Documents {

    key id : UUID;

    salesOrder : Association to SalesOrders;

    objectId : String(500);

    fileName : String(255);

    mimeType : String(100);

    Url : String(1000);
}

entity SalesOrderItems  {
key id              : UUID;
    smallid          : Association to SalesOrders;

    ProductID        : String(20);
    ProductName      : String(100);

    Quantity         : Decimal(13,3);
    UnitPrice        : Decimal(15,2);

    NetAmount        : Decimal(15,2);

}