export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: "viewer" | "editor" | "admin";
    };
  }

  interface Window {
    lenis?: {
      start: () => void;
      stop: () => void;
    } | null;
    measureNav?: () => void;
  }
}
