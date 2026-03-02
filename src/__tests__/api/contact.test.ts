import { POST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';
import { sendEmail } from '@/lib/email-service';

// Mock Firebase Admin
jest.mock('@/lib/firebase-admin', () => {
  const mockFirestore = {
    collection: jest.fn(() => ({
      add: jest.fn().mockResolvedValue({ id: 'test-id' }),
    })),
  };
  return {
    firestore: Object.assign(jest.fn(() => mockFirestore), {
      FieldValue: {
        serverTimestamp: jest.fn(() => 'mock-timestamp'),
      },
    }),
    apps: { length: 1 },
    credential: { cert: jest.fn() },
    initializeApp: jest.fn(),
    auth: jest.fn(),
  };
});

// Mock Email Service
jest.mock('@/lib/email-service', () => ({
  sendEmail: jest.fn().mockResolvedValue({ id: 'email-id' }),
}));

// Mock process.env
process.env.COMPANY_EMAIL = 'test@example.com';

describe('POST /api/contact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 for valid data', async () => {
    const body = {
      name: 'John Doe',
      email: 'john@example.com',
      prompt: 'I would like to request help with a custom design for my brand.',
    };

    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(sendEmail).toHaveBeenCalled();
  });

  it('should return 400 for invalid email', async () => {
    const body = {
      name: 'John Doe',
      email: 'not-an-email',
      prompt: 'I need help with a custom design for my brand.',
    };

    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation Failed');
  });

  it('should return 400 for a prompt that is too short', async () => {
    const body = {
      name: 'John Doe',
      email: 'john@example.com',
      prompt: 'Help.',
    };

    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.details).toContain('at least 10 characters');
  });

  it('should return 400 when both prompt and notes are missing', async () => {
    const body = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const req = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });
});