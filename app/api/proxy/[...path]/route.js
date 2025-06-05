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
    
    // Handle search endpoint specifically
    if (pathArray.length >= 2 && pathArray[0] === 'users' && pathArray[1] === 'search') {
      const searchQuery = url.searchParams.get('q');
      if (!searchQuery) {
        return NextResponse.json({ users: [] }, { status: 200 });
      }
      
      // Try different search endpoints your backend might support
      const searchEndpoints = [
        `/users/search?q=${encodeURIComponent(searchQuery)}`,
        `/users?search=${encodeURIComponent(searchQuery)}`,
        `/users?q=${encodeURIComponent(searchQuery)}`,
        `/search/users?q=${encodeURIComponent(searchQuery)}`
      ];
      
      // Try each endpoint until one works
      for (const endpoint of searchEndpoints) {
        try {
          console.log(`Trying search endpoint: ${BACKEND_URL}${endpoint}`);
          
          const res = await fetch(`${BACKEND_URL}${endpoint}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (res.ok) {
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              const data = await res.json();
              console.log('Search successful with endpoint:', endpoint);
              return NextResponse.json(data, { status: res.status });
            }
          }
        } catch (endpointError) {
          console.log(`Endpoint ${endpoint} failed:`, endpointError.message);
          continue;
        }
      }
      
      // If no search endpoint works, fall back to getting all users and filtering
      console.log('All search endpoints failed, falling back to client-side filtering');
      try {
        const res = await fetch(`${BACKEND_URL}/users?limit=1000`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          const allUsers = data.users || data || [];
          
          // Filter users on the server side
          const filteredUsers = allUsers.filter(user => 
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
          );
          
          return NextResponse.json({ 
            users: filteredUsers,
            total: filteredUsers.length 
          }, { status: 200 });
        }
      } catch (fallbackError) {
        console.error('Fallback search failed:', fallbackError);
      }
      
      return NextResponse.json({ 
        error: 'Search functionality not available',
        users: [] 
      }, { status: 200 });
    }
    
    // Original proxy logic for non-search requests
    const backendPath = '/' + pathArray.join('/');
    const query = url.search;

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