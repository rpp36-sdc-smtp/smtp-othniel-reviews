import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export const errorRate = new Rate('errors');
export const options = {
  vus: 1,
  duration: '2m',
  thresholds: {
    http_req_failed: ['rate<0.01'], // errors should be less than 1%
    http_req_duration: ['p(100)<2000'], // all requests should be below 2000ms
  }
};

export default function () {
  const min = 900009;
  const max = 1000011;
  const rand = Math.floor(Math.random() * (max - min + 1)) + min;
  const res = http.get(`http://localhost:3001/reviews/meta?product_id=${rand}`);

  check(res, { 'status was 200': (r) => r.status == 200, // status code must be 200 for this post request
  }) || errorRate.add(1);
  sleep(1);
}

// review id max = 5774952
// product id max = 1000011