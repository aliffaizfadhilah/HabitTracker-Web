const PUBLIC_PATHS = ['/', '/login', '/register', '/forgot-password', '/otp-verify']
const API_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/$/, '')

class HttpService {
  private static instance: HttpService
  private constructor() {}

  static getInstance(): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService()
    }
    return HttpService.instance
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Accept':       'application/json',
    }
  }

  private resolveUrl(url: string): string {
    return url.startsWith('http') ? url : `${API_BASE}${url}`
  }

  private handleUnauthorized(): void {
    if (!PUBLIC_PATHS.includes(window.location.pathname)) {
      window.location.href = '/login'
    }
  }

  private async parseResponse<T>(res: Response): Promise<T> {
    if (res.status === 401) {
      this.handleUnauthorized()
      throw new Error('Unauthorized')
    }
    return res.json() as Promise<T>
  }

  async post<T = unknown>(url: string, body: unknown): Promise<T> {
    const res = await fetch(this.resolveUrl(url), {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(body),
    })
    return this.parseResponse<T>(res)
  }

  async get<T = unknown>(url: string): Promise<T> {
    const res = await fetch(this.resolveUrl(url), {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    })
    return this.parseResponse<T>(res)
  }

  async put<T = unknown>(url: string, body: unknown): Promise<T> {
    const res = await fetch(this.resolveUrl(url), {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(body),
    })
    return this.parseResponse<T>(res)
  }

  async patch<T = unknown>(url: string, body: unknown): Promise<T> {
    const res = await fetch(this.resolveUrl(url), {
      method: 'PATCH',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(body),
    })
    return this.parseResponse<T>(res)
  }

  async delete<T = unknown>(url: string): Promise<T> {
    const res = await fetch(this.resolveUrl(url), {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
    })
    return this.parseResponse<T>(res)
  }

  async postMultipart<T = unknown>(url: string, formData: FormData): Promise<T> {
    const res = await fetch(this.resolveUrl(url), {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      credentials: 'include',
      body: formData,
    })
    return this.parseResponse<T>(res)
  }
}

export const http = HttpService.getInstance()