// src/tests/setup.js
import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Limpia el DOM y el localStorage después de cada prueba
afterEach(() => {
  cleanup();
  localStorage.clear();
});