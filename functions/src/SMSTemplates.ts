const getOrderSuccess = (
  orderId: string,
  totalAmount: number,
  shippingAddress:string,
  paymentMethod: string
) => {
  return `
    Dear Customer,
  
    Order ID: ${orderId}
    Total Amount: LKR ${totalAmount}
    Shipping Address: ${shippingAddress}
    Payment Method: ${paymentMethod}
    
    Your order has been successfully placed! 
    We will notify you once your order has been shipped.
    
    Thank you for shopping with us!
    NEVERBE Team
  `;
};

const getOrderFailed = (
  orderId: string,
  totalAmount: number,
  paymentMethod:string
) => {
  return `
    Dear Customer,
  
    Order ID: ${orderId}
    Total Amount: LKR ${totalAmount}
    Payment Method: ${paymentMethod}
    
    Your order has been failed to place! 
    Please try again.
    
    Thank you for shopping with us!
    NEVERBE Team
  `;
};
/* const orderStatusUpdate =
    (orderId:string,
      status:string,
      trackingNumber:string) =>{
      return `
    Dear Customer,

    Order ID: ${orderId}
    Status: ${status}
    Tracking Number: ${trackingNumber}

    Your order has been updated!

    Thank you for shopping with us!
    NEVERBE Team
    `;
    };*/


const adminNotify = (
  orderId:string,
  paymentMethod:string,
  total:number) => {
  return `
    New Order Received!
    
    Order ID: ${orderId}
    Payment Method: ${paymentMethod}
    Total Amount: LKR ${total}
    
    NEVERBE Team
    `;
};

export {getOrderSuccess, getOrderFailed, adminNotify};
