// Ticket API Service for dws-ticket-service
// Use relative API routes to proxy through Next.js server

const TICKET_SERVICE_URL = '/api/tickets';

export interface Ticket {
  id: string;
  user_id: string;
  event_id: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface PurchaseRequest {
  event_id: string;
  quantity: number;
  total_price: number;
}

export class TicketService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('keycloak_token');
    console.log('[TicketService] getAuthHeaders:', { 
      hasToken: !!token, 
      tokenPreview: token ? token.substring(0, 30) + '...' : 'none' 
    });
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  /**
   * Purchase tickets for an event
   */
  static async purchaseTicket(request: PurchaseRequest): Promise<Ticket> {
    const headers = this.getAuthHeaders();
    console.log('[TicketService] purchaseTicket headers:', headers);
    
    const response = await fetch(`${TICKET_SERVICE_URL}/purchase`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Purchase failed' }));
      throw new Error(error.message || error.error || 'Failed to purchase ticket');
    }

    return response.json();
  }

  /**
   * Get all tickets for the current user
   */
  static async getMyTickets(): Promise<Ticket[]> {
    const response = await fetch(`${TICKET_SERVICE_URL}/my-tickets`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to fetch tickets' }));
      throw new Error(error.message || error.error || 'Failed to fetch tickets');
    }

    return response.json();
  }

  /**
   * Get a specific ticket by ID
   */
  static async getTicketById(id: string): Promise<Ticket> {
    const response = await fetch(`${TICKET_SERVICE_URL}/tickets/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Ticket not found' }));
      throw new Error(error.message || error.error || 'Failed to fetch ticket');
    }

    return response.json();
  }

  /**
   * Cancel a ticket
   */
  static async cancelTicket(id: string): Promise<Ticket> {
    const response = await fetch(`${TICKET_SERVICE_URL}/tickets/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to cancel ticket' }));
      throw new Error(error.message || error.error || 'Failed to cancel ticket');
    }

    return response.json();
  }
}
