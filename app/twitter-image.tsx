import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
          color: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #3b82f6, #2dd4bf)',
              backgroundClip: 'text',
              color: 'transparent',
              marginRight: '16px',
            }}
          >
            CurioPay
          </div>
        </div>
        <div
          style={{
            fontSize: '32px',
            textAlign: 'center',
            maxWidth: '80%',
            marginBottom: '40px',
          }}
        >
          AI-Powered Personal Finance Management
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            fontSize: '24px',
          }}
        >
          <div
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
            }}
          >
            #PersonalFinance
          </div>
          <div
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
            }}
          >
            #AI
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
} 