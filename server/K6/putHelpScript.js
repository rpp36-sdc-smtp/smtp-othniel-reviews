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
  const min = 5197457;
  const max = 5774952;
  const rand = Math.floor(Math.random() * (max - min + 1)) + min;
  const res = http.put(`http://localhost:3001/reviews/${rand}/helpful`);

  check(res, { 'status was 201': (r) => r.status == 201, // status code must be 201 for this post request
  }) || errorRate.add(1);
  sleep(1);
}

// review id max = 5774952
// product id max = 1000011