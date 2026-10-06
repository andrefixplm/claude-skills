import { Component, type ReactNode } from "react";

interface Props {
  fallback: ReactNode;
  onError?: (error: unknown) => void;
  children: ReactNode;
}

/** Isola falhas do canvas 3D: a experiência degrada para o mapa 2D (DOC 21). */
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    this.props.onError?.(error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
