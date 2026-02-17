import { Order } from '../types';

export const csvService = {
  exportOrders: (orders: Order[], filename: string = 'orders-export.csv') => {
    if (!orders || orders.length === 0) return;

    // Define CSV Headers
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Phone',
      'State/Wilaya',
      'Address',
      'Total',
      'Currency',
      'Status',
      'Items'
    ];

    // Convert Data to CSV Rows
    const rows = orders.map(order => [
      order.id,
      new Date(order.createdAt).toISOString(),
      `"${order.customerName.replace(/"/g, '""')}"`, // Escape quotes
      order.phone,
      order.wilaya,
      `"${order.address.replace(/"/g, '""')}"`,
      order.total,
      order.currency,
      order.status,
      `"${order.items.map(i => `${i.quantity}x ${i.name}`).join('; ').replace(/"/g, '""')}"`
    ]);

    // Combine Headers and Rows
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    // Create Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Trigger Download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};