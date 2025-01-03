# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("Original request:", originalRequest.url);
    console.log("Response status:", error.response?.status);
    console.log("Retry flag:", originalRequest._retry);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      console.log("Retry flag:", originalRequest._retry);

      try {
        // Викликаємо refresh-дію
        const result = await store.dispatch(refresh());

        if (refresh.fulfilled.match(result)) {
          // Оновлюємо токен у заголовках
          const newToken = result.payload.accessToken;
          setAuthHeader(newToken);

          // Повторюємо запит
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return Api(originalRequest);
        } else {
          // Якщо оновлення не вдалося
          console.error("Refresh token failed:", result.payload);
          store.dispatch(logout());
          return Promise.reject(result.payload);
        }
      } catch (err) {
         console.error("Failed to refresh token:", err);
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

 
