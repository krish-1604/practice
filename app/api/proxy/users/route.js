import { NextResponse } from 'next/server';

export async function GET(request) {
  return proxy(request);
}

export async function POST(request) {
  return proxy(request);
}

export async function PUT(request) {
  return proxy(request);
}

export async function DELETE(request) {
  return proxy(request);
}

async function proxy(request) {
  const BACKEND_URL = 'http://3.110.49.16:8000';

  try {
    const url = new URL(request.url);
    const backendPath = url.pathname.replace('/api/proxy', '');

    const body = request.method !== 'GET' ? await request.json() : undefined;

    const res = await fetch(BACKEND_URL + backendPath, {
      method: request.method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Proxy error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
