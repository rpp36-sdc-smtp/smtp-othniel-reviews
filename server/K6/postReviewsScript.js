import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export const errorRate = new Rate('errors');
export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      duration: '1m',
      rate: 1, // increase this unit to increse rps
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 1000,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'], // errors should be less than 1%
    http_req_duration: ['p(100)<2000'], // all requests should be below 2000ms
  }
};

export default function () {
  const min = 900009;
  const max = 1000011;
  const rand = Math.floor(Math.random() * (max - min + 1)) + min;
  const body = {
    product_id: rand,
    rating: 1,
    summary: 'review bombing with k6',
    body: 'k6 body text here',
    recommend: false,
    name: 'k6user',
    email: 'k6@user.com',
    photos: [],
    characteristics: {'3347676':5, '3347677':2, '3347678':3, '3347679':1},
  };
  const res = http.post(`http://localhost:3001/reviews/?product_id=${rand}`, JSON.stringify(body), {headers: { 'Content-Type': 'application/json' }, });

  check(res, { 'status was 201': (r) => r.status == 201, // status code must be 201 for this post request
  }) || errorRate.add(1);
  sleep(1);
}

// review id max = 5774952
// product id max = 1000011