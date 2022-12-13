export interface ServiceRequest {
  service_request_id: string;
  status: string;
  status_notes: string;
  service_name: string;
  service_code: string;
  requested_datetime: string;
  updated_datetime: string;
  address: string;
  lat: number;
  long: number;
  media_url: string;
}
