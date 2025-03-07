import { NextRequest, NextResponse } from 'next/server';
import { processAllRecurringTransactions } from '@/utils/recurring';
import * as Sentry from '@sentry/node';
import { headers } from 'next/headers';

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN, // Make sure to set your Sentry DSN in the environment variables
  tracesSampleRate: 1.0, // Adjust this value as needed
});

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    if (!process.env.CRON_SECRET) {
      console.error('CRON_SECRET is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const authorization = request.headers.get('authorization');
    if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
      console.warn('Unauthorized cron job attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Process the recurring transactions
    const result = await processAllRecurringTransactions();
    
    console.log('Cron job completed successfully:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Recurring transactions processed successfully',
      result
    }, { status: 200 });

  } catch (error) {
    console.error('Cron job failed:', error);
    Sentry.captureException(error); // Capture the error with Sentry
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process recurring transactions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Disable body parsing since we don't need it for this endpoint
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Maximum allowed duration on Vercel Hobby plan 