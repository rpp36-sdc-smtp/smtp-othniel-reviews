import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export const errorRate = new Rate('errors');
export const options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '2m', target: 100 },
    { duration: '1m', target: 0 },
  ],
};

export default function () {
  const res = http.get('localhost:30001/reviews/?product_id=1000011');
  check(res, { 'status was 200': (r) => r.status == 200,
  }) || errorRate.add(1);
  sleep(1);
}