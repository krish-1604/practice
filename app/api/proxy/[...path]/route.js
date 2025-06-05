import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const routeParams = await params;
  return proxy(request, routeParams);
}

export async function POST(request, { params }) {
  const routeParams = await params;
  return proxy(request, routeParams);
}

export async function PUT(request, { params }) {
  const routeParams = await params;
  return proxy(request, routeParams);
}

export async function DELETE(request, { params }) {
  const routeParams = await params;
  return proxy(request, routeParams);
}

async function proxy(request, routeParams = {}) {
  const BACKEND_URL = 'http://3.110.49.16:8000';

  try {
    const url = new URL(request.url);
    const pathArray = Array.isArray(routeParams.path) ? routeParams.path : [];
    const backendPath = '/' + pathArray.join('/');

    const query = url.search; // Includes ?start=0&limit=10 if present

    console.log('Captured path segments:', pathArray);
    console.log(`Proxying ${request.method} request to: ${BACKEND_URL}${backendPath}${query}`);

    const body = ['GET', 'HEAD'].includes(request.method)
      ? undefined
      : await request.json().catch(() => undefined);

    const res = await fetch(`${BACKEND_URL}${backendPath}${query}`, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } else {
      const text = await res.text();
      console.log('Non-JSON response from backend:', text);

      if (res.status === 404) {
        return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
      }

      return NextResponse.json({ error: 'Unexpected response from backend' }, { status: res.status });
    }
  } catch (err) {
    console.error('Proxy error:', err);
    return NextResponse.json({ error: 'Failed to connect to backend: ' + err.message }, { status: 500 });
  }
}

