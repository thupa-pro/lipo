import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Missing CLERK_WEBHOOK_SECRET' },
      { status: 500 }
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await req.text();

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Get the event type
  const eventType = evt.type;

  try {
    if (eventType === 'user.created') {
      // User signed up
      const { id, email_addresses, first_name, last_name, unsafe_metadata } = evt.data;
      const email = email_addresses[0]?.email_address;
      
      if (!email) {
        return NextResponse.json(
          { error: 'No email address found' },
          { status: 400 }
        );
      }

      // Create user in database
      const user = await prisma.user.create({
        data: {
          id: id,
          email: email,
          name: `${first_name || ''} ${last_name || ''}`.trim() || email,
          role: unsafe_metadata?.role || 'CUSTOMER',
          status: 'ACTIVE',
          emailVerified: new Date(),
        },
      });

      // Create user profile
      await prisma.userProfile.create({
        data: {
          userId: user.id,
        },
      });

      console.log('User created:', user.id);
    } else if (eventType === 'user.updated') {
      // User updated their profile
      const { id, email_addresses, first_name, last_name, unsafe_metadata } = evt.data;
      const email = email_addresses[0]?.email_address;

      if (email) {
        await prisma.user.update({
          where: { id: id },
          data: {
            email: email,
            name: `${first_name || ''} ${last_name || ''}`.trim() || email,
            role: unsafe_metadata?.role || 'CUSTOMER',
          },
        });

        console.log('User updated:', id);
      }
    } else if (eventType === 'user.deleted') {
      // User deleted their account
      const { id } = evt.data;

      // Delete user and related data
      await prisma.user.delete({
        where: { id: id },
      });

      console.log('User deleted:', id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}