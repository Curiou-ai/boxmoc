import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    const validation = EmailSchema.safeParse(email);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation Failed', 
        details: validation.error.errors[0].message 
      }, { status: 400 });
    }

    // Check if already on the waitlist
    const existingEntry = await prisma.waitlist.findUnique({
      where: { email },
    });
    
    if (existingEntry) {
       return NextResponse.json({ 
         success: true, 
         message: 'You are already on the waitlist.' 
       }, { status: 200 });
    }

    // Add entry to PostgreSQL via Prisma
    await prisma.waitlist.create({
      data: {
        email,
        status: 'waitlisted',
        source: 'api',
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully joined the waitlist!' 
    });
  } catch (error: unknown) {
    console.error('Waitlist API Error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}
