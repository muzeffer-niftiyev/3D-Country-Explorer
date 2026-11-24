import { Component } from "react";
import GlobeNotice from "./GlobeNotice";

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
        <GlobeNotice onRetry={this.props.onRetry}>
          The 3D globe couldn't be loaded. Try again, or restart your browser
          if it keeps happening. You can still explore countries from the list.
        </GlobeNotice>
      );
    }
    return this.props.children;
  }
}

export default GlobeErrorBoundary;
