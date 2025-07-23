import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Mock data for demonstration
  const transactions = [
    {
      id: 'txn_1',
      type: 'payout',
      status: 'completed',
      amount: 485.50,
      currency: 'USD',
      description: 'Weekly payout - Services rendered',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      paymentMethod: 'Bank Transfer',
      reference: 'PAY_001234567',
    },
    {
      id: 'txn_2',
      type: 'payment',
      status: 'completed',
      amount: 75.00,
      currency: 'USD',
      description: 'Professional House Cleaning',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      paymentMethod: 'Credit Card',
      reference: 'PMT_987654321',
      customer: {
        name: 'Jessica Thompson',
        email: 'jessica@email.com',
      },
      booking: {
        id: 'booking_1',
        service: 'Professional House Cleaning',
      },
    },
    {
      id: 'txn_3',
      type: 'fee',
      status: 'completed',
      amount: -7.50,
      currency: 'USD',
      description: 'Platform service fee (10%)',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      paymentMethod: 'Platform',
      reference: 'FEE_111222333',
    },
    {
      id: 'txn_4',
      type: 'payment',
      status: 'pending',
      amount: 150.00,
      currency: 'USD',
      description: 'Office Deep Clean',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      paymentMethod: 'Bank Transfer',
      reference: 'PMT_444555666',
      customer: {
        name: 'Tech Startup Inc.',
        email: 'admin@techstartup.com',
      },
      booking: {
        id: 'booking_2',
        service: 'Office Deep Clean',
      },
    },
  ];
  return NextResponse.json(transactions);
}