import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// 앱을 렌더링하는 함수
const render = () => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

// 개발 환경에서만 MSW를 시작한 후 앱을 렌더링
if (import.meta.env.DEV) {
  import("./mocks/browser").then(({ worker }) => {
    worker.start({ onUnhandledRequest: "bypass" }).then(render);
  });
} else {
  // 프로덕션 환경에서는 MSW 없이 바로 렌더링
  render();
}
