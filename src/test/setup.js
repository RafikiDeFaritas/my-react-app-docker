// Important : cette entrée étend le expect de Vitest (pas Jest)
import "@testing-library/jest-dom/vitest";

// (facultatif mais propre)
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
afterEach(() => cleanup());
