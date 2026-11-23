import { Component } from "react";

class GlobeErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("The 3D globe failed to load.", error);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-neutral-300">
          <p className="max-w-sm">
            The 3D globe couldn't be loaded. Try refreshing the page. You can
            still explore countries from the list.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default GlobeErrorBoundary;
