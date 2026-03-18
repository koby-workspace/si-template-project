import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// handlers에 정의된 모든 핸들러를 등록하여 Service Worker를 설정
export const worker = setupWorker(...handlers);
