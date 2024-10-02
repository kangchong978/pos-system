import React from 'react';
import { Order, PosProduct, OrderType, OrderStatus } from '@/common/type/order';
import { Printer } from 'lucide-react';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onPrint: (e: React.MouseEvent) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose, onPrint }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className='flex justify-between items-center mb-4'>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Order Details</h3>
            <button
              onClick={onPrint}
              className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <Printer className="mr-2" size={18} />
              Print
            </button>
          </div>
          <div className="mt-2 px-7 py-3">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm font-bold text-gray-500">Order ID</p>
                <p>{order.id}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">Order Type</p>
                <p>{order.orderType === OrderType.DineIn ? 'Dine In' : 'Take Away'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">Status</p>
                <p>{order.status}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">Table ID</p>
                <p>{order.tableId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">Created Date</p>
                <p>{new Date(order.createDate).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">Last Updated</p>
                <p>{new Date(order.updateDate).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">Products</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Variations
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((product: PosProduct, index: number) => (
                      <tr key={index}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">{product.name}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">{product.quantity}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">${product.price.toFixed(2)}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {product.variation.map(v => `${v.pName}: ${v.name}`).join(', ')}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm font-bold text-gray-500">Subtotal</p>
                <p>${order.subTotal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">Tax</p>
                <p>${order.tax.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">Total</p>
                <p>${order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="items-center px-4 py-3">
          <button
            id="ok-btn"
            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;